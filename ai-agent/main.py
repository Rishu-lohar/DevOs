from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field
from ollama import chat

app = FastAPI(title="DevHub AI Agent")


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = Field(default_factory=list)


SYSTEM_PROMPT = """
You are DevHub AI, an intelligent developer assistant.

Give accurate, concise and practical answers.
Use simple language and short examples.
Understand previous conversation messages.
Remember the user's project context within the current conversation.
Avoid unnecessary explanations.
Use Markdown formatting when helpful.
"""


@app.get("/health")
def health():
    return {"status": "DevHub AI is running"}


@app.post("/chat")
def chat_with_agent(request: ChatRequest):

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    # Keep only the latest 12 conversation messages
    for item in request.history[-12:]:
        messages.append({
            "role": item.role,
            "content": item.content
        })

    # Add the latest user message
    messages.append({
        "role": "user",
        "content": "/no_think\n" + request.message
    })

    response = chat(
        model="qwen3:1.7b",
        messages=messages,
        options={
            "num_predict": 300,
            "temperature": 0.3,
        },
        keep_alive="10m",
    )

    return {
        "reply": response.message.content
    }