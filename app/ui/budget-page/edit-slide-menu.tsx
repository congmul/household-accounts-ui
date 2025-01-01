"use client"

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '@/app/lib/i18n/client';
import { SlideMenu, AmountInput } from '@/app/ui/shared-components';
import { Spinner } from 'react-component-tailwindcss';
import { transactionService, budgetService, categoryService } from '@/app/lib/api-services';
import { useSessionStorageState } from '@/app/lib/custom-hook';
import { refreshActions } from '@/app/lib/redux';

interface EditSlideMenuProps{
    lng: string;
    isOpen: boolean;
    close: () => void;
    selectedItem: Record<string, any> | undefined;
    activeTab: number;
    amount: number;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    getInvestmentsData: () => Promise<void>
    previousIncomeData: () => Promise<void>
}
export function EditSlideMenu({ 
    lng, isOpen, close, selectedItem, activeTab,
    amount, setAmount, input, setInput,
    getInvestmentsData, previousIncomeData
} : EditSlideMenuProps) {

    const { t } = useTranslation(lng, 'main');
    const dispatch = useDispatch();
    const [ isSaving, setIsSaving ] = useState(false);
    const { selectedDateStr } = useSelector((state:any) => state.calendar);
    const [ userInfo, _ ] = useSessionStorageState("userInfo", "");

    return(<>
        <SlideMenu isOpen={isOpen} close={close} position='bottom'
        header={<>
            <div className={`px-4 py-2 text-white flex-2 text-center`}>
                {selectedItem?.category}{" "}{
                    activeTab === 0 
                    ? t('general.budget')
                    : activeTab === 1 
                        ? t('general.investment') : t('general.income')                    
                }
            </div>
            {   
                isSaving
                ?                    
                <div className="text-white p-2 px-3 flex-1 flex justify-end">                   
                    <Spinner color={"white"} />
                </div>
                :
                <div onClick={async () => {                    
                    if(!selectedItem) return;
                    try{
                        setIsSaving(true);
                        // Update the selected item if it has id.
                        if(selectedItem.id){
                            // activeTab 0 = budget
                            // activeTab 1 = investment
                            // activeTab 2 = income
                            if(activeTab === 0){
                                await budgetService.updateBudget(selectedItem.id, amount);
                            }else{
                                await transactionService.updateTransaction(selectedItem.id, {amount});
                            }
                        }else{
                            // Create the selected item(Only Budget) if it didn't id.
                            if(activeTab !== 0) return;
                            
                            const budgetPayload = {
                                userId:userInfo._id, 
                                date:selectedDateStr, 
                                amount,
                                category: selectedItem.category
                            }
                            await budgetService.createBudget(budgetPayload);
                        }
                        dispatch(refreshActions.setIsBudgetPageRefresh(true));
                        close();
                    }catch(err){
                        console.log(err)
                    }finally{
                        setIsSaving(false);    
                    }
                }} className={`text-white p-2 px-3 cursor-pointer flex-1 text-right`}>
                    {t('slide-menu.save')}
                </div>
            }
        </>}
    >
        <div className="p-4 bg-white">  
            <div className="flex justify-between items-center border-b py-3">
                <span className="flex items-center">
                    <span className="mr-2">{t('new_input.body.date')}</span>
                </span>
                <input
                    type="date"
                    value={selectedItem && selectedItem.date}
                    readOnly
                    className="text-left w-2/3 px-2 py-1 focus-visible:outline-none"
                />
            </div>
            <div className="flex justify-between items-center border-b py-3">
                <span>{
                    activeTab === 0 
                    ? t('general.budget')
                    : activeTab === 1
                        ? t('general.investment')
                        : t('general.income')
                }</span>
                <span className="text-left w-2/3 px-2 py-1 flex items-center">
                    {isOpen && <AmountInput setAmount={setAmount} input={input} setInput={setInput} />}
                </span>
            </div>
            <div className="flex justify-between items-center border-b py-3">
                <span>{t('new_input.body.category')}</span>
                <span className="text-left w-2/3 px-2 py-1 flex items-center">{selectedItem?.category}</span>
            </div>
        </div>  
    </SlideMenu>
    </>)
}