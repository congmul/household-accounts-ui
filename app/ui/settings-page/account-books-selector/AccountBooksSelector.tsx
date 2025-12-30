'use client'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accountBookActions } from '@/app/lib/redux';
import { useTranslation } from '@/app/lib/i18n/client';
import { RootState } from '@/app/lib/redux/store';
import { Button } from 'react-component-tailwindcss';
import { AccountBookForm } from '../../shared-components';
import { accountBookService } from '@/app/lib/api-services/accountBook.service';
import { useSessionStorageState } from '@/app/lib/custom-hook';

const AccountBooksSelector = ({lng}: {lng: string}) => {
    const { t } = useTranslation(lng, 'main')
    const { accountBooks, defaultAccountBook } = useSelector((state: RootState) => state.accountBook);
    const [ dropDownData, setDropDownData ]= useState<any[]>([]);
    const [ isOpen, setIsOpen ] = useState(false);
    const dispatch = useDispatch();
    const [ userInfo, _ ] = useSessionStorageState("userInfo");

    useEffect(() => {
        setDropDownData(accountBooks?.map(ab => { return (
            { 
                value: ab.accountBookId._id, 
                label: ab.accountBookId.name 
            }
        )
        }) || []);
    }, [accountBooks])

    async function getAccountBooks(){
        const accountBooks = await accountBookService.getByUserId(userInfo._id);
        dispatch(accountBookActions.setAccountBooks(accountBooks || []));
        const accountBook = accountBooks?.find((ab) => ab.isDefault === true) || null;
        dispatch(accountBookActions.setDefaultAccountBook(accountBook));
    }
    return (<>
        <div>
            <div className="flex items-center px-3">{t(`settings.accountBooks`)}</div>
            <div className='px-3'>
                {
                    accountBooks && (
                        <ul>
                            {
                                accountBooks?.map(ab => (
                                    <li key={ab.accountBookId._id} className={`list-decimal list-inside p-1 ${ab.isDefault ? 'font-bold' : ''}`}>
                                        <span>
                                            {ab.accountBookId.name} {ab.isDefault && (<span className='text-gray-500 pl-3 text-sm'>(Current)</span>  )}
                                        </span>
                                        {
                                            !ab.isDefault && (
                                                <span>
                                                    <Button size="sm" variant="text" color="pink" onClick={async () => {
                                                        // Switch default account book
                                                        await accountBookService.setDefaultAccountBook(ab.accountBookId._id, ab.userId);
                                                        await getAccountBooks();
                                                    }}>{t('settings.switch')}</Button>
                                                </span>
                                            )
                                        }
                                    </li>
                                ))
                            }
                        </ul>
                    )
                }
            </div>
        </div>
        <div className='px-3'>
            <Button className="text-2xl" size="lg" variant="primary" color="pink" onClick={() => setIsOpen(true)}>{t('settings.add_account_book')}</Button>
        </div>
        <AccountBookForm isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
    );
}

export { AccountBooksSelector };