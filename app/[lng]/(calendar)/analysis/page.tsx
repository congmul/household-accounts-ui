import { Suspense } from 'react';
import { AnalysisPage } from '@/app/ui/analysis-page';

export default async function Page({ params } : { params: Promise<{ lng: string }> }) {
  const { lng } = await params;
    return (<>
      <div className="analysis-page-wrapper">
        <Suspense fallback={<div>Skeleton loading..</div>}>
          <AnalysisPage lng={lng} />
        </Suspense>
      </div>
    </>
    );
  }
  