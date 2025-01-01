
export function ExpenseCardSkeleton() {
    // Loading animation
    const shimmer =
    'overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

  return (
    <div className="relative">
        <div className={`${shimmer} mb-6`}>
            <div className="bg-gray-200 p-2 rounded-t-md">
                <div className="h-[24px] w-[95px] rounded-md bg-gray-300 text-sm font-medium" />
            </div>
            <div className="bg-white shadow-md rounded-b-md">
                <div className="flex justify-between items-center m-0.5 p-2 cursor-pointer">
                    <div className="flex flex-col items-center">                
                        <div className="h-[24px] w-[95px] rounded-md bg-gray-200 text-sm font-medium" /> 
                        <div className="text-gray-500"><div className="h-[24px] w-[95px] rounded-md bg-gray-200 text-sm font-medium" /></div>
                    </div>
                    <div className={'text-red-500 font-bold whitespace-nowrap'}>
                        <div className="h-[24px] w-[95px] rounded-md bg-gray-200 text-sm font-medium" /> 
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}