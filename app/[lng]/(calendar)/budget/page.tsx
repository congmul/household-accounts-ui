import { CompactCalendarHandler } from '@/app/ui/shared-components';
import { BudgetPage } from '@/app/ui/budget-page';

export default async function Page({ params } : { params: Promise<{ lng: string }> }) {
    const { lng } = await params;
    return (<>
        <div className="budget-page-wrapper">
            <CompactCalendarHandler />
            <BudgetPage lng={lng} />
        </div>
    </>
    );
}