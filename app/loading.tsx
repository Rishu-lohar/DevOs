import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <main data-testid="global-loading" className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] text-[#FAFAFA]">
      <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#232326] bg-[#111113]">
        <Spinner className="h-6 w-6" />
      </div>
      <p className="mt-4 text-xs font-medium text-[#71717A]">Preparing your workspace...</p>
    </main>
  );
}
