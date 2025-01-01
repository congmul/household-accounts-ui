import { CompactCalendarHandler } from '@/app/ui/shared-components';
import { BudgetPage } from '@/app/ui/budget-page';

export default async function Page({ params: { lng } } : { params: { lng : string }}) {
    return (<>
      <div className="budget-page-wrapper">
        <CompactCalendarHandler />
        <BudgetPage lng={lng} />
      </div>
    </>
    );
}