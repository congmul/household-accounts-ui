import { Suspense } from 'react';
import { SearchPage } from '@/app/ui/search-page';

export default async function Page({ params } : { params: Promise<{ lng: string }> }) {
  const { lng } = await params;
    return (<>
      <div className="search-page-wrapper">
        <Suspense fallback={<div>Skeleton loading..</div>}>
          <SearchPage lng={lng} />
        </Suspense>
      </div>
    </>
    );
  }
  