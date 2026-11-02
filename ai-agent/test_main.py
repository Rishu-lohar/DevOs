import json
import os
import unittest
from types import SimpleNamespace

import main


class ProjectPlanValidationTests(unittest.TestCase):
    def setUp(self):
        self.valid_plan = {
            "title": "Project delivery plan",
            "milestones": [
                {"title": "Foundation", "description": "Set up the base", "dueDate": None},
            ],
            "tasks": [
                {
                    "title": "Create the foundation",
                    "description": "Set up the base project structure.",
                    "priority": "high",
                    "estimate": 3,
                    "milestoneIndex": 0,
                    "dependencies": [],
                    "dueDate": None,
                },
                {
                    "title": "Verify the foundation",
                    "description": "Run the initial validation.",
                    "priority": "medium",
                    "estimate": 1,
                    "milestoneIndex": 0,
                    "dependencies": [0],
                    "dueDate": None,
                },
            ],
            "recommendations": ["Review estimates before approval."],
            "risks": [],
        }

    def test_valid_plan_is_structured_as_ollama_output(self):
        plan = main.parse_project_plan(json.dumps(self.valid_plan))
        self.assertEqual(plan["source"], "ollama")
        self.assertEqual(plan["tasks"][1]["dependencies"], [0])

    def test_rejects_forward_or_self_dependencies(self):
        self.valid_plan["tasks"][0]["dependencies"] = [0]
        with self.assertRaises(ValueError):
            main.parse_project_plan(json.dumps(self.valid_plan))

    def test_rejects_invalid_dates(self):
        self.valid_plan["milestones"][0]["dueDate"] = "2026-02-31"
        with self.assertRaises(ValueError):
            main.parse_project_plan(json.dumps(self.valid_plan))

    def test_rejects_empty_response(self):
        with self.assertRaisesRegex(ValueError, "empty response"):
            main.parse_project_plan("")

    def test_rejects_invalid_task_fields_and_references(self):
        invalid_values = [
            ("priority", "critical"),
            ("estimate", 0),
            ("milestoneIndex", 2),
            ("dependencies", [1]),
        ]
        for field, value in invalid_values:
            with self.subTest(field=field):
                plan = json.loads(json.dumps(self.valid_plan))
                plan["tasks"][0][field] = value
                with self.assertRaises((ValueError, main.ValidationError)):
                    main.parse_project_plan(json.dumps(plan))

    def test_fallback_is_explicit_when_ollama_is_unavailable(self):
        original_client = main.Client
        original_chat = main.chat
        main.Client = None
        main.chat = None
        try:
            plan = main.plan_project(
                main.ProjectPlanRequest(
                    project_name="Personal project",
                    requirements="Build a small task tracker.",
                    mode="individual",
                )
            )
        finally:
            main.Client = original_client
            main.chat = original_chat

        self.assertEqual(plan["source"], "fallback")
        self.assertTrue(plan["fallbackReason"])
        self.assertTrue(plan["milestones"])
        self.assertTrue(plan["tasks"])

    def test_local_generation_uses_the_plan_json_schema(self):
        original_chat = main.chat
        original_client = main.Client
        captured = {}
        valid_plan_json = json.dumps(self.valid_plan)

        class FakeClient:
            def __init__(self, timeout):
                captured["timeout"] = timeout

            def chat(self, **kwargs):
                captured["format"] = kwargs["format"]
                captured["think"] = kwargs["think"]
                captured["num_predict"] = kwargs["options"]["num_predict"]
                return SimpleNamespace(
                    message=SimpleNamespace(content=valid_plan_json)
                )

        main.Client = FakeClient
        try:
            plan = main.plan_project(
                main.ProjectPlanRequest(
                    project_name="Personal project",
                    requirements="Build a small task tracker.",
                    mode="individual",
                )
            )
        finally:
            main.chat = original_chat
            main.Client = original_client

        self.assertEqual(plan["source"], "ollama")
        self.assertEqual(captured["timeout"], main.PLAN_TIMEOUT_SECONDS)
        self.assertEqual(captured["format"]["title"], "ProjectPlan")
        self.assertFalse(captured["think"])
        self.assertLessEqual(captured["num_predict"], 700)

    def test_local_generation_timeout_returns_explicit_fallback(self):
        original_client = main.Client
        attempts = 0

        class TimeoutClient:
            def __init__(self, timeout):
                pass

            def chat(self, **kwargs):
                nonlocal attempts
                attempts += 1
                raise TimeoutError("Ollama timed out")

        main.Client = TimeoutClient
        try:
            plan = main.plan_project(
                main.ProjectPlanRequest(
                    project_name="Personal project",
                    requirements="Build a small task tracker.",
                    mode="individual",
                )
            )
        finally:
            main.Client = original_client

        self.assertEqual(plan["source"], "fallback")
        self.assertIn("TimeoutError", plan["fallbackReason"])
        self.assertEqual(attempts, main.PLAN_MAX_ATTEMPTS)

    def test_invalid_response_is_retried_before_accepting_plan(self):
        original_client = main.Client
        responses = iter(["", json.dumps(self.valid_plan)])
        attempts = []

        class RetryClient:
            def __init__(self, timeout):
                pass

            def chat(self, **kwargs):
                attempts.append(kwargs["messages"][-1]["content"])
                return SimpleNamespace(
                    message=SimpleNamespace(content=next(responses))
                )

        main.Client = RetryClient
        try:
            plan = main.plan_project(
                main.ProjectPlanRequest(
                    project_name="Personal project",
                    requirements="Build a small task tracker.",
                    mode="individual",
                )
            )
        finally:
            main.Client = original_client

        self.assertEqual(plan["source"], "ollama")
        self.assertEqual(len(attempts), 2)
        self.assertIn("previous response was rejected", attempts[1])

    def test_invalid_responses_after_retries_are_labeled_fallback(self):
        original_client = main.Client
        attempts = 0

        class InvalidResponseClient:
            def __init__(self, timeout):
                pass

            def chat(self, **kwargs):
                nonlocal attempts
                attempts += 1
                return SimpleNamespace(message=SimpleNamespace(content="not JSON"))

        main.Client = InvalidResponseClient
        try:
            plan = main.plan_project(
                main.ProjectPlanRequest(
                    project_name="Personal project",
                    requirements="Build a small task tracker.",
                    mode="manager",
                )
            )
        finally:
            main.Client = original_client

        self.assertEqual(plan["source"], "fallback")
        self.assertIn("after 2 attempts", plan["fallbackReason"])
        self.assertEqual(attempts, main.PLAN_MAX_ATTEMPTS)

    def test_chat_returns_structured_read_only_tool_calls(self):
        original_chat = main.chat
        captured = {}
        tool_call = SimpleNamespace(
            function=SimpleNamespace(
                name="database_list_accessible_projects",
                arguments={},
            )
        )

        def fake_chat(**kwargs):
            captured.update(kwargs)
            return SimpleNamespace(
                message=SimpleNamespace(content="", tool_calls=[tool_call])
            )

        main.chat = fake_chat
        try:
            response = main.chat_with_agent(
                main.ChatRequest(
                    message="List my available DevHub projects.",
                    tools=[
                        {
                            "type": "function",
                            "function": {
                                "name": "database_list_accessible_projects",
                                "description": "List authorized projects.",
                                "parameters": {"type": "object", "properties": {}},
                            },
                        }
                    ],
                )
            )
        finally:
            main.chat = original_chat

        self.assertEqual(response["toolCalls"], [{
            "name": "database_list_accessible_projects",
            "arguments": {},
        }])
        self.assertEqual(captured["model"], main.PLAN_MODEL)
        self.assertFalse(captured["think"])

    def test_chat_ignores_invalid_tool_call_arguments(self):
        original_chat = main.chat
        invalid_call = SimpleNamespace(
            function=SimpleNamespace(
                name="database_list_accessible_projects",
                arguments="not json",
            )
        )
        main.chat = lambda **kwargs: SimpleNamespace(
            message=SimpleNamespace(content="", tool_calls=[invalid_call])
        )
        try:
            response = main.chat_with_agent(
                main.ChatRequest(
                    message="List my DevHub projects.",
                    tools=[{"type": "function", "function": {"name": "database_list_accessible_projects"}}],
                )
            )
        finally:
            main.chat = original_chat

        self.assertEqual(response["toolCalls"], [])

@unittest.skipUnless(
    os.environ.get("DEVHUB_OLLAMA_INTEGRATION") == "1",
    "Set DEVHUB_OLLAMA_INTEGRATION=1 to run live Qwen3 inference.",
)
class OllamaProjectPlanIntegrationTests(unittest.TestCase):
    def test_individual_and_manager_plans_use_live_qwen3(self):
        for mode in ("individual", "manager"):
            with self.subTest(mode=mode):
                plan = main.plan_project(
                    main.ProjectPlanRequest(
                        project_name="Local AI planning verification",
                        requirements=(
                            "Build a small team task planner with project setup, "
                            "task assignment, and validation before release."
                        ),
                        mode=mode,
                    )
                )
                self.assertEqual(plan["source"], "ollama", plan.get("fallbackReason"))
                self.assertGreaterEqual(len(plan["milestones"]), 1)
                self.assertGreaterEqual(len(plan["tasks"]), 1)
                print(
                    f"LIVE_QWEN3 mode={mode} source={plan['source']} "
                    f"tasks={len(plan['tasks'])} milestones={len(plan['milestones'])} "
                    f"priorities={[task['priority'] for task in plan['tasks']]}"
                )


@unittest.skipUnless(
    os.environ.get("DEVHUB_OLLAMA_INTEGRATION") == "1",
    "Set DEVHUB_OLLAMA_INTEGRATION=1 to run live Qwen3 inference.",
)
class OllamaMentorToolSelectionIntegrationTests(unittest.TestCase):
    def test_qwen3_selects_the_authorized_project_catalog_tool(self):
        response = main.chat_with_agent(
            main.ChatRequest(
                message=(
                    "What projects can I access in DevHub? Use the project listing tool "
                    "to retrieve the current answer."
                ),
                tools=[
                    {
                        "type": "function",
                        "function": {
                            "name": "database_list_accessible_projects",
                            "description": (
                                "List up to 50 project names and IDs owned by or shared "
                                "with the authenticated user."
                            ),
                            "parameters": {"type": "object", "properties": {}},
                        },
                    }
                ],
            )
        )

        self.assertTrue(
            any(
                tool_call["name"] == "database_list_accessible_projects"
                for tool_call in response["toolCalls"]
            ),
            f"Qwen3 did not select the project catalog tool: {response}",
        )
        print(f"LIVE_QWEN3 mentor tool selection={response['toolCalls']}")

    def test_qwen3_selects_task_read_for_progress_with_project_context(self):
        project_id = "cm_test_authorized_project"
        request = main.ChatRequest(
            message=(
                "List my accessible projects and show their current progress. "
                "Use actual project database data."
            ),
            context=json.dumps(
                {
                    "projects": [{"id": project_id, "name": "DevHub"}],
                    "truncated": False,
                }
            ),
            tools=[
                {
                    "type": "function",
                    "function": {
                        "name": "database_list_project_tasks",
                        "description": (
                            "List read-only task details for an authorized project. "
                            "Use task statuses to calculate current progress."
                        ),
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "projectId": {"type": "string", "minLength": 1, "maxLength": 128},
                                "limit": {
                                    "type": "integer",
                                    "minimum": 1,
                                    "maximum": 100,
                                    "default": 100,
                                },
                            },
                            "required": ["projectId"],
                        },
                    },
                },
            ],
        )

        response = main.chat_with_agent(request)
        task_calls = [
            tool_call
            for tool_call in response["toolCalls"]
            if tool_call["name"] == "database_list_project_tasks"
        ]
        self.assertTrue(
            task_calls,
            f"Qwen3 did not select the task read: {response}",
        )
        self.assertTrue(
            all(call["arguments"].get("projectId") == project_id for call in task_calls),
            f"Qwen3 did not use the project ID from retrieved context: {task_calls}",
        )
        self.assertTrue(
            all(call["arguments"].get("limit", 100) == 100 for call in task_calls),
            f"Qwen3 did not request the available task window for progress: {task_calls}",
        )
        print(f"LIVE_QWEN3 progress tool selection={response['toolCalls']}")


if __name__ == "__main__":
    unittest.main()
