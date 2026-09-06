import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main data-testid="not-found-page" className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-6 text-center text-[#FAFAFA]">
      <div className="flex h-16 w-16 items-center justify-center rounded-[16px] border border-[#232326] bg-[#111113] text-[#7C5CFC]">
        <Compass size={30} />
      </div>
      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#71717A]">Lost in the system</p>
      <h1 className="mt-2 text-5xl font-bold tracking-tight text-[#FAFAFA]">404</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#71717A]">
        The page you&apos;re looking for drifted outside the workspace.
      </p>
      <Link
        href="/dashboard"
        data-testid="return-home-button"
        className="mt-6 inline-flex items-center gap-2 rounded-[12px] bg-[#7C5CFC] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#6B46F7]"
      >
        <span>Return to dashboard</span>
        <ArrowRight size={15} />
      </Link>
    </main>
  );
}
