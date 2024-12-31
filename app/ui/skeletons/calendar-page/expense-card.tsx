export function ExpenseCardSkeleton() {
  return (
    <div className="mb-6">
        <div className="bg-gray-200 p-2 rounded-t-md">
            <div className="h-[24px] w-[95px] rounded-md bg-gray-300 text-sm font-medium" />
        </div>
        <div className="bg-white shadow-md rounded-b-md">
            <div className="flex justify-between items-center m-0.5 p-2 cursor-pointer">
                <div className="flex items-center">                
                    <div className="h-[24px] w-[95px] rounded-md bg-gray-200 text-sm font-medium" /> 
                    <div className="ml-2  text-gray-500"><div className="h-[24px] w-[95px] rounded-md bg-gray-200 text-sm font-medium" /></div>
                </div>
                <div className={'text-red-500  font-bold whitespace-nowrap'}>
                    <div className="h-[24px] w-[95px] rounded-md bg-gray-200 text-sm font-medium" /> 
                </div>
            </div>
        </div>
    </div>
  );
}