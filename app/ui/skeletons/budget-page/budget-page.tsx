import { HeaderBudgetListSkeleton } from './header-budget-list';
import { TabMenuBudgetListSkeleton } from './tabmenu-budget-list';
// Loading animation
const shimmer =
  'overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function BudgetPageSkeleton() {
  return (<>
    <div className="relative budget-page-wrapper">
        <div className={`${shimmer} flex flex-col list-of-budgets-remove p-4`}>
          <HeaderBudgetListSkeleton />
          <TabMenuBudgetListSkeleton />
        </div>
    </div>
  </>
  );
}