// Loading animation
const shimmer =
    'overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function TabMenuBudgetListSkeleton() {
    return (<>
        <div className="relative">
            <div className={`${shimmer} tabs-menu`}>
                <div className="w-full mx-auto mt-1">
                    <div className="relative border-b border-gray-300">
                        <div className="flex justify-between">
                            <div className="py-2 mr-2 flex-1 h-[24px] w-[125px] rounded-md bg-gray-200 text-sm font-medium" />
                            <div className="py-2 mr-2 flex-1 h-[24px] w-[125px] rounded-md bg-gray-200 text-sm font-medium" />
                            <div className="py-2 flex-1 h-[24px] w-[125px] rounded-md bg-gray-200 text-sm font-medium" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="mt-4">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-2 px-4 text-left border-b border-gray-200">
                                            <div className="h-[24px] w-[110px] rounded-md bg-gray-300 text-sm font-medium" />
                                        </th>
                                        <th className="py-2 px-4 text-left border-b border-gray-200"> 
                                            <div className="h-[24px] w-[65px] rounded-md bg-gray-300 text-sm font-medium" />
                                        </th>
                                        <th className="py-2 px-4 text-left border-b border-gray-200">
                                            <div className="h-[24px] w-[65px] rounded-md bg-gray-300 text-sm font-medium" />
                                        </th>
                                        <th className="py-2 px-4 text-left border-b border-gray-200">
                                         <div className="h-[24px] w-[65px] rounded-md bg-gray-300 text-sm font-medium" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                    </tr>
                                    <tr className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                    </tr>
                                    <tr className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-b border-gray-200"><div className="h-[24px] w-[90px] rounded-md bg-gray-200 text-sm font-medium" /></td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-gray-200 text-black">
                                    <tr>
                                        <td className="py-2 px-4 border-t border-gray-200 font-bold"><div className="h-[24px] w-[65px] rounded-md bg-gray-300 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-t border-gray-200 font-bold"><div className="h-[24px] w-[90px] rounded-md bg-gray-300 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-t border-gray-200 font-bold"><div className="h-[24px] w-[90px] rounded-md bg-gray-300 text-sm font-medium" /></td>
                                        <td className="py-2 px-4 border-t border-gray-200 font-bold"><div className="h-[24px] w-[90px] rounded-md bg-gray-300 text-sm font-medium" /></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
                {/* <div className="my-1 h-[500px] w-full rounded-md bg-gray-200 text-sm font-medium" /> */}
            </div>
        </div>
    </>
    );
}