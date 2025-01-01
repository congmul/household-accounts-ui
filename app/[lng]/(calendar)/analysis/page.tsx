import { Suspense } from 'react';
import { CompactCalendarHandler } from '@/app/ui/shared-components';

export default async function Page({ params: { lng } } : { params: { lng : string }}) {
    return (<>
      <div className="analysis-page-wrapper">
        <CompactCalendarHandler />
        <Suspense fallback={<div>Skeleton loading..</div>}>
            Analysis Charts
        </Suspense>
      </div>
    </>
    );
  }
  