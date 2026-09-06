import { Spinner } from "../ui/Spinner";

export function LoadingScreen({ "data-testid": testId }: { "data-testid"?: string }) {
  return (
    <div data-testid={testId || "loading-screen"} className="flex min-h-[45vh] flex-col items-center justify-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#232326] bg-[#111113]">
        <Spinner className="h-5 w-5" />
      </div>
      <p className="text-xs font-medium text-[#71717A]">Loading DevOS workspace...</p>
    </div>
  );
}
