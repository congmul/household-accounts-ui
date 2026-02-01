'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/app/lib/i18n/client'
import { useSessionStorageState } from '@/app/lib/custom-hook';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { accountBookActions } from '@/app/lib/redux';
import { accountBookService } from '../lib/api-services/accountBook.service';
import { RootState } from '../lib/redux/store';
import { AccountBookForm } from './shared-components';

export const Header = ({ lng }: { lng: string }) => {
  const pathname = usePathname();
  const router = useRouter()
  const { t } = useTranslation(lng, 'main');
  const [ pageName, setPageName ] = useState("calendar");
  const [ userInfo, _ ] = useSessionStorageState("userInfo");
  const [ __, setCookie, removeCookie] = useCookies(["userInfo"])
  const dispatch = useDispatch();
  const { accountBooks, defaultAccountBook } = useSelector((state: RootState) => state.accountBook);

  useEffect(() => {
    const pathNameArr = pathname.split('/');
    setPageName(pathNameArr[pathNameArr.length - 1]);

    // Check userInfo in session storage
    if(!userInfo || userInfo === ""){
      removeCookie("userInfo");
      setTimeout(() => {
        router.push(`/${lng}/login`);
      }, 300)
    }else{
      getAccountBooks();
    }
  }, [pathname]);

  async function getAccountBooks(){
    const accountBooks = await accountBookService.getByUserId(userInfo._id);
    dispatch(accountBookActions.setAccountBooks(accountBooks || []));
    const accountBook = accountBooks?.find((ab) => ab.isDefault === true) || null;
    dispatch(accountBookActions.setDefaultAccountBook(accountBook));
  }

  return (<>
    <div className="header flex justify-around items-center bg-red-300 text-white h-[70px]">
      {(pageName === 'search' || pageName === 'settings' || pageName === 'analysis') && t(`${pageName}.header.title`)}
    </div>
    { accountBooks?.length === 0 && defaultAccountBook == null  && <AccountBookForm isOpen={true} isFirstTime={true} close={() => {}} /> }
  </>
  )
}