export default function Loading() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#08090d] text-white">
      <div role="status" className="flex items-center gap-3 text-sm text-white/55">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-violet-300" />
        Preparing your studio…
      </div>
    </main>
  );
}
