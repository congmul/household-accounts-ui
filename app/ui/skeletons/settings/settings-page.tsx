// Loading animation
const shimmer =
  'overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function SettingsPageSkeleton() {
  return (<div className="relative">
          <div className={`${shimmer} p-4 bg-white text-2xl`}>
            <div className="flex justify-between items-center border-b py-3">
              <span className="flex items-center px-3">
                <div className="h-[32px] w-[138px] rounded-md bg-gray-200 text-sm font-medium" />
              </span>
              <span className="px-3">
                <div className="h-[48px] w-[132px] rounded-md bg-gray-200 text-sm font-medium" />
              </span>
            </div>
            <div className="flex justify-between items-center border-b py-3">
                <span className="flex items-center px-3"></span>
                <div className='px-3 h-[49px]'>
                  <div className="h-[48px] w-[132px] rounded-md bg-gray-200 text-sm font-medium" />
                </div>
            </div>
        </div>
  </div>
  );
}