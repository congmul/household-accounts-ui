"use client"

import { useTranslation } from '@/app/lib/i18n/client';
import React, { useState, useEffect, useTransition } from 'react';
import { useSelector } from 'react-redux';
import { useSessionStorageState } from '@/app/lib/custom-hook';
import { transactionService } from '@/app/lib/api-services';
import { Transaction, TransactionItems } from '@/app/lib/models';
import { formatCurrency } from '@/app/lib/utils';

export function AnalysisPage({ lng } : { lng: string }) {
    const { t } = useTranslation(lng, 'main');
    const { selectedDateStr } = useSelector((state:any) => state.calendar);
    const [ isPending, startTransition] = useTransition();
    const [ userInfo, _ ] = useSessionStorageState("userInfo", "");
    const [ expenses, setExpenses ] = useState<Transaction[] | undefined>();

    useEffect(() => {
        if(!selectedDateStr) return;
        init(selectedDateStr);
    }, [selectedDateStr]);

    async function init(selectedDateStr:string) {
        if(userInfo === ""){
            throw new Error("Userinfo is not correct.")
          }
          startTransition(async () => {
            const [year, month] = selectedDateStr.split('-'); // ["2024", "08"]
            const res = await transactionService.getExpenseByUserId(userInfo._id, year, month, "category");
            setExpenses(res)
          })
    }

    function totalAmountByCategory(items: TransactionItems[]){
        const totalByCategory = items.reduce((acc, { subcategory, amount }) => {
            if(subcategory){
                acc[subcategory] = (acc[subcategory] || 0) + amount;
            }else{
                acc['N/A'] = (acc['N/A'] || 0) + amount;
            }
            return acc;
        }, {} as Record<string, number>);
        return totalByCategory
    }
    return(<div className="analysis-page flex flex-col p-4">
        {
            isPending 
                ? <div>Loading...</div>
                : expenses && expenses.length > 0
                    ? expenses.map(expense => {
                        const totalByCategory = totalAmountByCategory(expense.transactions);
                        return(<div key={expense._id} className="mb-3">
                            <div>{expense._id} - ${formatCurrency(expense.totalAmount)}</div>
                            {
                                Object.entries(totalByCategory).map(item => {
                                    return (<div key={item[0]} className="ms-3">{item[0]} - ${formatCurrency(item[1])}</div>)
                                })
                            }
                        </div>)
                    })
                    : <div>No expenses</div>
            
        }
    </div>)
}