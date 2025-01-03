// Loading animation
const shimmer =
  'overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function HeaderBudgetListSkeleton() {
  return (<>
    <div className="relative">
        <div className={`${shimmer} flex justify-between mb-4`}>
            <div className="flex flex-col items-center">
                <div className="h-[24px] w-[100px] rounded-md bg-gray-200 text-sm font-medium" />
                <div className="my-1 h-[24px] w-[100px] rounded-md bg-gray-200 text-sm font-medium" />
            </div>
            <div className="flex flex-col items-center">
                <div className="h-[24px] w-[65px] rounded-md bg-gray-200 text-sm font-medium" />
                <div className="my-1 h-[24px] w-[100px] rounded-md bg-gray-200 text-sm font-medium" />
            </div>
            <div className="flex flex-col items-center">
                <div className="h-[24px] w-[65px] rounded-md bg-gray-200 text-sm font-medium" />
                <div className="my-1 h-[24px] w-[100px] rounded-md bg-gray-200 text-sm font-medium" />
            </div>
        </div>
    </div>
  </>
  );
}