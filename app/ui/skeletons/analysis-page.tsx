// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function AnalysisPageSkeleton() {
  return (
    <div
      className={`${shimmer} card-wrapper relative w-64 h-40 flex flex-col justify-between p-4 border rounded-lg shadow-md transition-shadow duration-300 cursor-pointer
        m-3`}
    >
      <div className="w-16 h-16 object-contain">
        <div className="ml-2 h-16 w-20 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="w-100 flex items-end justify-between mt-2">
        <div className="ml-2 h-6 w-32 rounded-md bg-gray-200 text-sm font-medium" />
        <div className="ml-2 h-3 w-10 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
    </div>
  );
}