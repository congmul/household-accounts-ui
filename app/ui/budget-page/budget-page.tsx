"use client"

import { useTranslation } from '@/app/lib/i18n/client';
import React, { useState, useEffect, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { transactionService, budgetService, categoryService } from '@/app/lib/api-services';
import { useSessionStorageState } from '@/app/lib/custom-hook';
import { refreshActions } from '@/app/lib/redux';
import { Tabs, Tab, Table } from '@/app/ui/shared-components';
import { formatCurrency } from '@/app/lib/utils';
import { AccountBookWithMember, Budget, BudgetItem, Category, Transaction, TransactionItems } from '@/app/lib/models';
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { EditSlideMenu } from './edit-slide-menu';
import { HeaderBudgetListSkeleton, TabMenuBudgetListSkeleton } from '../skeletons/budget-page';
import { RootState } from '@/app/lib/redux/store';

export function BudgetPage({ lng } : { lng: string }) {
    const { t } = useTranslation(lng, 'main');
    const [ isPending, startTransition] = useTransition();
    const dispatch = useDispatch();
    const { selectedDateStr } = useSelector((state:any) => state.calendar);
    const { defaultAccountBook } = useSelector((state:RootState) => state.accountBook);
    const { isBudgetPageRefresh } = useSelector((state:any) => state.refresh);
    const [ userInfo, _ ] = useSessionStorageState("userInfo", "");
    const [ totalIncome, setTotalIncome ] = useState(0);
    const [ totalInvestments, setTotalInvestments ] = useState(0);
    const [ budget, setBudget ] = useState<Budget>();
    const [ activeTab, setActiveTab ] = useState(0);
    const [ tableData, setTableData ] = useState<Record<string, any>[] >([]);
    const [ tableTotalData, setTableTotalData ] = useState<Record<string, any>>();
    const [ investmentsData, setInvestmentsData ] = useState<Record<string, any>[] >([]);
    const [ previousIncomeTableData, setPreviousIncomeTableData ] = useState<Record<string, any>[] >([]);
    const [ isOpenSlide, setIsOpenSlide ] = useState(false);
    const [ selectedItem, setSelectedItem ] = useState<Record<string, any>>();
    const [ input, setInput ] = useState<string>('');
    const [ amount, setAmount ] = useState<number>(0);

    useEffect(() => {
        if(!isBudgetPageRefresh) return;
        if(selectedDateStr === "" || !defaultAccountBook) return;
        if(activeTab === 1){
            // Build Table data for investment tab
            getInvestmentsData();
        }else if(activeTab === 2){
            // Build Table data for previous month income
            previousIncomeData();
        }
        init(selectedDateStr, defaultAccountBook);
        dispatch(refreshActions.setIsBudgetPageRefresh(false));
      }, [isBudgetPageRefresh]);

    useEffect(() => {
        if(selectedDateStr === "" || !defaultAccountBook) return;
        init(selectedDateStr, defaultAccountBook);
    }, [selectedDateStr, defaultAccountBook])

    useEffect(() => {
        if(activeTab === 1){
            // Build Table data for investment tab
            getInvestmentsData();
        }
        if(activeTab === 2){
            // Build Table data for previous month income
            previousIncomeData();

        }
    }, [selectedDateStr, activeTab])

    async function init(selectedDateStr:string, defaultAccountBook:AccountBookWithMember){
        try{
            if(userInfo === ""){
              throw new Error("Userinfo is not correct.")
            }
            startTransition(async () => {            
                const [year, month] = selectedDateStr.split('-'); // ["2024", "08"]
                const prevMonth = parseInt(month) - 1 === 0 ? 12 : parseInt(month) - 1;
                const transactionRes = await transactionService.getIncomeByUserId(userInfo._id, defaultAccountBook.accountBookId._id, `${prevMonth === 12 ? parseInt(year) - 1 : year}`, prevMonth.toString(), "date");
                const investmentRes = await transactionService.getInvestmentsByUserId(userInfo._id, defaultAccountBook.accountBookId._id, year, month, "date");
                const budget = await budgetService.getByUserId(userInfo._id, defaultAccountBook.accountBookId._id, year, month);
                const categories = await categoryService.getByUserId(userInfo._id, defaultAccountBook.accountBookId._id, 'expense');
                setBudget(budget);
    
                let totalAmount = 0;
                (transactionRes as Transaction[])?.forEach(transaction => totalAmount += transaction.totalAmount);
                setTotalIncome(totalAmount);
    
                let totalAmountOfInvest = 0;
                (investmentRes as Transaction[])?.forEach(transaction => totalAmountOfInvest += transaction.totalAmount);
                setTotalInvestments(totalAmountOfInvest);
    
                const expenses = await transactionService.getExpenseByUserId(userInfo._id, defaultAccountBook.accountBookId._id, year, month, "category");
                if(categories && expenses){
                    buildTableData(categories, budget?.budgets || [], expenses);
                }
            })
        }catch(err){
            console.log(err);
        }
    }
    async function getInvestmentsData() {
        if(userInfo === ""){
          throw new Error("Userinfo is not correct.")
        }
        const [year, month] = selectedDateStr.split('-'); // ["2024", "08"]
        const income = await transactionService.getInvestmentsByUserId(userInfo._id, defaultAccountBook?.accountBookId._id || "", year, month);
        if(income) buildInvestmentsTableData(income as TransactionItems[]);
    }
    async function previousIncomeData() {
        if(userInfo === ""){
          throw new Error("Userinfo is not correct.")
        }
        const [year, month] = selectedDateStr.split('-'); // ["2024", "08"]
        const prevMonth = parseInt(month) - 1 === 0 ? 12 : parseInt(month) - 1;
        const income = await transactionService.getIncomeByUserId(userInfo._id, defaultAccountBook?.accountBookId._id || "", `${prevMonth === 12 ? parseInt(year) - 1 : year}`, `${prevMonth}`);
        if(income) buildPreviousIncomTableData(income as TransactionItems[]);
    }

    async function buildTableData(categories:Category[], budgets:BudgetItem[], transactions: Transaction[]){
        const data:any[] = []
        let budgetTotal = 0;
        let expenseTotal = 0;
        categories.forEach((category:Category) => {
            const budgetTemp = budgets.find((budget) => budget.category === category.name);
            const transactionTemp = transactions.find((transaction) => transaction._id === category.name);
            budgetTotal += budgetTemp?.amount || 0;
            expenseTotal += transactionTemp?.totalAmount || 0;
            data.push({
                [`${t('general.category')}`]: category.name,
                [`${t('general.budget')}`]: (row:any) => (<button className="flex" data-category={category.name} data-budget-id={budgetTemp?._id} data-amount={budgetTemp?.amount} data-date={selectedDateStr} onClick={(e) => {
                    const id = e.currentTarget.dataset.budgetId;
                    const category = e.currentTarget.dataset.category;
                    const amountTemp = e.currentTarget.dataset.amount;
                    const date = e.currentTarget.dataset.date;
                    setSelectedItem({id, category, amountTemp, date})
                    setInput(amountTemp || '0');
                    setAmount(parseFloat(amountTemp || '0'));
                    setIsOpenSlide(true);
                }}>${formatCurrency(budgetTemp?.amount || 0)} <PencilSquareIcon className='inline ml-1' width={"12px"} /> </button>),
                [`${t('general.expense')}`]: `$${formatCurrency(transactionTemp?.totalAmount || 0)}`,
                [`${t('general.difference')}`]: calBalance((budgetTemp?.amount || 0), (transactionTemp?.totalAmount || 0))
            })
        })
        data.sort((a, b) => {
            const aIsKorean = isKorean(a[`${t('general.category')}`]);
            const bIsKorean = isKorean(b[`${t('general.category')}`]);
            // If both are Korean, sort alphabetically
            if (aIsKorean && bIsKorean) {
                return a[`${t('general.category')}`].localeCompare(b[`${t('general.category')}`]);
            }
            // If a is Korean and b is not, a should come first
            if (aIsKorean) {
              return -1;
            }
            // If b is Korean and a is not, b should come first
            if (bIsKorean) {
              return 1;
            }
            // If neither is Korean, sort alphabetically
            return a[`${t('general.category')}`].localeCompare(b[`${t('general.category')}`]);
        })
        setTableData(data);
        setTableTotalData(
            {
                [`${t('general.category')}`]: t('general.total'),
                [`${t('general.budget')}`]: `$${formatCurrency(budgetTotal)}`,
                [`${t('general.expense')}`]: `$${formatCurrency(expenseTotal)}`,
                [`${t('general.difference')}`]:calBalance(budgetTotal, expenseTotal)
            }
        )
    }
    function isKorean(char:string) {
        const code = char?.charCodeAt(0);
        // Check if the character is within the Hangul syllable range
        return code >= 0xAC00 && code <= 0xD7AF;
    }

    async function buildInvestmentsTableData(investmentTransactions: TransactionItems[]){      
        const tempTableData:any[] = []
        investmentTransactions.forEach(investment=> {                
            tempTableData.push({
                [t('general.date')]: investment.date.split('T')[0], 
                [t('general.category')]: investment.category,
                [t('general.investment')]: (row:any) => (
                    <button className="flex" data-category={investment.category} data-income-id={investment._id} data-amount={investment.amount}  data-date={investment.date.split('T')[0]}
                    onClick={(e) => {
                        const id = e.currentTarget.dataset.incomeId;
                        const category = e.currentTarget.dataset.category;
                        const amountTemp = e.currentTarget.dataset.amount;
                        const date = e.currentTarget.dataset.date;
                        setSelectedItem({id, category, amountTemp, date})
                        setInput(amountTemp || '0');
                        setAmount(parseFloat(amountTemp || '0'));
                        setIsOpenSlide(true);
                    }
                }>${formatCurrency(investment.amount || 0)} <PencilSquareIcon className='inline ml-1' width={"12px"} /> </button>)
            })
        })
        setInvestmentsData(tempTableData);
    }

    async function buildPreviousIncomTableData(incomeTransactions: TransactionItems[]){      
        const tempTableData:any[] = []
        incomeTransactions.forEach(income=> {    
            tempTableData.push({
                [t('general.date')]: income.date.split('T')[0], 
                [t('general.category')]: income.category,
                [t('general.income')]: (row:any) => (
                    <button className="flex" data-category={income.category} data-income-id={income._id} data-amount={income.amount}  data-date={income.date.split('T')[0]}
                    onClick={(e) => {
                        const id = e.currentTarget.dataset.incomeId;
                        const category = e.currentTarget.dataset.category;
                        const amountTemp = e.currentTarget.dataset.amount;
                        const date = e.currentTarget.dataset.date;
                        setSelectedItem({id, category, amountTemp, date})
                        setInput(amountTemp || '0');
                        setAmount(parseFloat(amountTemp || '0'));
                        setIsOpenSlide(true);
                    }
                }>${formatCurrency(income.amount || 0)} <PencilSquareIcon className='inline ml-1' width={"12px"} /> </button>)
            })
        })
        setPreviousIncomeTableData(tempTableData);
    }

    function calBalance(income:number, budget:number) {
      if(income - budget < 0){
        return <span className="text-red-500">-${formatCurrency(income - budget).split("-")[1]}</span>
      }else{
        return <span className="text-blue-500 ">{`$${formatCurrency(income - budget)}`}</span>
      }
    }

    return (<>
    <div className="flex flex-col list-of-budgets p-4">
        {
            !isPending
            ?<>
                <div className="flex justify-between mb-4">
                    <div className="text-center">
                        <p>{`${t('general.income')} (${t('general.last_month')})`}</p>
                        <p className="text-green-500 font-bold">${formatCurrency(totalIncome)}</p>
                    </div>
                    <div className="text-center">
                        <p>{t('general.budget')}</p>
                        <p className="text-red-500 font-bold">${formatCurrency(budget?.totalAmount || 0)}</p>
                    </div>
                    <div className="text-center">
                        <p>{t('general.balance')}</p>
                        <p className="text-blue-500 font-bold">{calBalance(totalIncome, (budget?.totalAmount || 0) + totalInvestments)}</p>
                    </div>
                </div>
                <div className='tabs-menu'>
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
                        <Tab label={t("general.expense")}>
                            <Table 
                                columns={[`${t('general.category')}`, `${t('general.budget')}`, `${t('general.expense')}`, `${t('general.difference')}`]} 
                                data={tableData} 
                                total={tableTotalData}
                            />
                        </Tab>
                        <Tab label={t("general.investment")}>
                            <Table columns={[`${t('general.date')}`, `${t('general.category')}`,`${t('general.investment')}`]} data={investmentsData} />
                        </Tab>
                        <Tab label={t("general.last_month_income")}>
                            <Table columns={[`${t('general.date')}`, `${t('general.category')}`,`${t('general.income')}`]} data={previousIncomeTableData} />
                        </Tab>
                    </Tabs>
                </div>
            </>
            :<>
                <HeaderBudgetListSkeleton />
                <TabMenuBudgetListSkeleton />
            </>
        }
    </div>
    <EditSlideMenu lng={lng} isOpen={isOpenSlide} close={() => setIsOpenSlide(false)} 
        selectedItem={selectedItem} activeTab={activeTab}
        amount={amount} setAmount={setAmount} input={input} setInput={setInput}
        getInvestmentsData={getInvestmentsData} previousIncomeData={previousIncomeData}
    />
    </>
    );
}