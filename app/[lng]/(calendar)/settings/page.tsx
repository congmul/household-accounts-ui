import { LanguageSelector, LogoutButton, AccountBooksSelector, SettingMenus } from '@/app/ui/settings-page'

export default async function Page({ params } : { params: Promise<{ lng: string }> }) {    
    const { lng } = await params;
    return (<>
        <div className="p-4 bg-white text-2xl">
            <div className="flex justify-between items-center border-b py-3">
                <LanguageSelector lng={lng} />
            </div>
            <div className="flex justify-between items-start border-b py-3">
                <AccountBooksSelector lng={lng} />
            </div>
            <div className="flex justify-between items-start border-b py-3">
                <SettingMenus lng={lng} />
            </div>
            <div className="flex justify-between items-center border-b py-3">
                <span className="flex items-center px-3"></span>
                <div className='px-3 h-[49px]'>
                    <LogoutButton lng={lng} />
                </div>
            </div>
        </div>
    </>
    );
}