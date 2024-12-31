'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { languages } from '@/app/lib/i18n/settings'
import { useTranslation } from '@/app/lib/i18n/client';
import { Dropdown } from '@/app/ui/shared-components';

export function LanguageSelector({lng}: {lng: string}) {
    const { t } = useTranslation(lng, 'main')
    const router = useRouter()
    const [ dropDownData, setDropDownData ]= useState<any[]>([]);

    useEffect(() => {
        buildDropdownData();
    }, [])
    const buildDropdownData = () => {
        const tempData = languages.map(l => {
            return {value: l, label: t(`settings.${l}`)}        
        })
        setDropDownData(tempData);
    }
    return (
        <>
            <span className="flex items-center px-3">
                <span className="mr-2"> {t('settings.language')}</span>
            </span>
            <div className="px-3">
                <Dropdown 
                    lng={lng}  
                    defaultValue={t(`settings.${lng}`)}
                    items={dropDownData} 
                    onChange={(data: any) => {
                        router.push(`/${data.value}/settings`);
                    }}
                />
            </div>
        </>
    );
}