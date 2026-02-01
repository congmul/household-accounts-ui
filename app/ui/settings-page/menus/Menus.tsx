'use client'

import { useTranslation } from '@/app/lib/i18n/client';
import { Button } from 'react-component-tailwindcss';
import { useRouter } from 'next/navigation';

export function SettingMenus({lng}: {lng: string}) {
    const { t } = useTranslation(lng, 'main')
    const router = useRouter();
    return (<div>
        <div className="flex items-center px-3">{t('settings.menu')}</div>
        {/* Search link - navigates to search page while preserving locale */}
        <Button variant="secondary" color='pink' onClick={() => router.push(`/${lng}/search`)}>
            {t('settings.search')}
        </Button>
    </div>
    );
}