'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/app/lib/i18n/client';
import { Button } from 'react-component-tailwindcss';
import { useCookies } from 'react-cookie';

export function LogoutButton({lng}: {lng: string}) {
    const { t } = useTranslation(lng, 'main')
    const router = useRouter()
    const [ isLoading, setIsLoading ] = useState(false);
    const [ _, __, removeCookie] = useCookies(['userInfo'])

    function logoutClick() {
        setIsLoading(true);
        
        removeCookie("userInfo", { path: '/' });
        sessionStorage.removeItem("userInfo");
        
        setTimeout(() => {
            router.push(`/${lng}/login`);
        }, 300)
    }
    return (
        <Button className="text-2xl" size="lg" variant='secondary' color='pink' loading={isLoading} onClick={logoutClick}>
            {t('auth.logout')}
        </Button>
    );
}