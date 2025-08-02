import { Suspense } from 'react';
import { CompactCalendarHandler } from '@/app/ui/shared-components';
import { AnalysisPage } from '@/app/ui/analysis-page';

export default async function Page({ params } : { params: { lng : string }}) {
  const { lng } = await params;
    return (<>
      <div className="analysis-page-wrapper">
        <CompactCalendarHandler />
        <Suspense fallback={<div>Skeleton loading..</div>}>
          <AnalysisPage lng={lng} />
        </Suspense>
      </div>
    </>
    );
  }
  