// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function AnalysisPageSkeleton() {
  return (<div className="relative">
    <div
      className={`${shimmer}`}
    >
      <div className="h-[48px] w-[132px] rounded-md bg-gray-200 text-sm font-medium" />
    </div>
  </div>
  );
}