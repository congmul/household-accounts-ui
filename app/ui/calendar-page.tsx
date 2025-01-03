"use client"

import React, { useState, useRef, MutableRefObject, useEffect, useTransition } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useTranslation } from '@/app/lib/i18n/client'
import { budgetService, transactionService } from '@/app/lib/api-services';
import { Budget, Transaction, CalendarEvent } from '@/app/lib/models';
import { formatCurrency } from '@/app/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { calendarActions, refreshActions } from '@/app/lib/redux';
import { format } from 'date-fns'
import { HandleItemSlideMenu, SwipeableCard } from '@/app/ui/shared-components';
import { useSessionStorageState } from '@/app/lib/custom-hook';
import { ExpenseCardSkeleton } from '@/app/ui/skeletons';
import { HeaderExpenseCard } from './skeletons/calendar-page/header-expense-card';

type RefType = {
  [key: string]: HTMLElement | null;
};

export const CalendarPage = ({ lng }: { lng: string }) => {
  const dispatch = useDispatch();
  const [ isPending, startTransition] = useTransition();
  const { selectedDateStr } = useSelector((state: any) => state.calendar);
  const { isCalenderPageRefresh } = useSelector((state: any) => state.refresh);
  const expenseListsRef = useRef<RefType>({}) as MutableRefObject<RefType>;
  const { t } = useTranslation(lng, 'main');
  const [budget, setBudget] = useState<Budget>();
  const [totalAmountOfExpense, setTotalAmountOfExpense] = useState<number>(0);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [calendarEvent, setCalendarEvent] = useState<CalendarEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [userInfo, _] = useSessionStorageState("userInfo", "");

  useEffect(() => {
    if (!isCalenderPageRefresh) return;
    if (selectedDateStr === "") return;
    init(selectedDateStr);
    dispatch(refreshActions.setIsCalenderPageRefresh(false));
  }, [isCalenderPageRefresh]);

  useEffect(() => {
    if (selectedDateStr === "") return;
    init(selectedDateStr);
  }, [selectedDateStr]);

  useEffect(() => {
    if (expenses == null) return;
    buildEvents(expenses);
  }, [expenses])

  async function init(selectedDateStr: string) {
    try {
      startTransition(async () => {
        setExpenses([]);
        setBudget(undefined);
        const [year, month] = selectedDateStr.split('-'); // ["2024", "08"]
  
        if (userInfo === "") {
          throw new Error("Userinfo is not correct.")
        }
        const budgetRes = await budgetService.getByUserId(userInfo._id, year, month);
        const transactionRes = await transactionService.getExpenseByUserId(userInfo._id, year, month);
        if (transactionRes == null) return;
  
        setBudget(budgetRes);
        setExpenses(transactionRes);
  
        buildEvents(transactionRes);
      })
    } catch (err) {
      console.log(err);
    }
  }

  // a custom render function
  function renderEventContent(eventInfo: any) {
    return (
      <>
        <span>{eventInfo.event.title}</span>
      </>
    )
  }

  function buildEvents(expenses: Transaction[]) {
    if (expenses == null) return;

    const result: { [key: string]: string }[] = [];
    let totalExpenseTemp = 0
    expenses.forEach((expense) => {
      totalExpenseTemp += expense.totalAmount;
      result.push({ title: `-${formatCurrency(expense.totalAmount)}`, date: expense._id, dateStr: expense._id });
    });

    setTotalAmountOfExpense(totalExpenseTemp);
    setCalendarEvent(result as CalendarEvent[]);
  }

  function handleDateClick(arg: any) {
    if (expenseListsRef.current && expenseListsRef.current[arg.dateStr]) {
      expenseListsRef.current[arg.dateStr]?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
    }
  }
  function handleEventClick(arg: any) {
    if (expenseListsRef.current && expenseListsRef.current[arg.event._def.extendedProps.dateStr]) {
      expenseListsRef.current[arg.event._def.extendedProps.dateStr]?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
    }
  }

  const handleDatesSet = (arg: any) => {
    const calendarApi = arg.view.calendar;
    const currentDate = calendarApi.getDate();

    // Selected Month, need to store it globally.
    dispatch(calendarActions.setSelectedDateStr(format(currentDate, 'yyyy-MM-dd')));
  };

  function updateItem(e: any) {
    const dataset = e.currentTarget.dataset;
    setSelectedItem({ ...dataset, pending: dataset.pending === "true", fixedExpenseMonthly: dataset.fixedExpenseMonthly === "true", category: { name: dataset.category }, subcategory: { name: dataset.subcategory } });
    // Open HandleItem Slidemenu
    setIsOpen(true);
  }
  function calBalance(budget: number, balance: number) {
    if (budget - balance < 0) {
      return <span className="text-red-500">-${formatCurrency(budget - balance).split("-")[1]}</span>
    } else {
      return `$${formatCurrency(budget - balance)}`
    }
  }
  return (<div className="calendar-page-wrapper">
    <div className="full-calendar-custom-style">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialDate={selectedDateStr || null}
        dateClick={handleDateClick}
        datesSet={handleDatesSet} // to handle pre / next on headerTool bar event.
        initialView='dayGridMonth'
        weekends={true}
        events={calendarEvent}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        headerToolbar={{
          left: 'prev',
          center: 'title today',
          right: 'next'
        }}
        height={"43vh"}
        selectable={true}
        dayMaxEvents={true}
        fixedWeekCount={false}
      />
    </div>
    <div className="overflow-hidden flex flex-col list-of-expenses p-4 h-[39vh]">
      {
        !isPending
        ?
        <div className="flex justify-between mb-4">
          <div className="text-center">
            <p>{t('calendar.list-of-expenses.budget')}</p>
            <p className="text-green-500 font-bold">${formatCurrency(budget?.totalAmount || 0)}</p>
          </div>
          <div className="text-center">
            <p>{t('calendar.list-of-expenses.expense')}</p>
            <p className="text-red-500 font-bold">${formatCurrency(totalAmountOfExpense)}</p>
          </div>
          <div className="text-center">
            <p>{t('calendar.list-of-expenses.balance')}</p>
            <p className="text-blue-500 font-bold">{calBalance(budget?.totalAmount || 0, totalAmountOfExpense)}</p>
          </div>
        </div>            
        : <HeaderExpenseCard />
      }
      {!isPending ? 
        expenses && expenses.map((expense, index) => (
          <div key={`${expense._id}-${index}`} className="mb-6" data-date-str={expense._id} ref={(element) => {
            if (element == null) return;
            expenseListsRef.current[expense._id] = element;
          }}>
            <div className="bg-gray-200 p-2 rounded-t-md">
              <p>{expense._id}</p>
            </div>
            <div className="bg-white shadow-md rounded-b-md">
              {expense.transactions.map((transaction, index) => (
                <SwipeableCard key={`${transaction._id}-${index}`} lng={lng} transaction={transaction} editOnClick={updateItem} triggerRefresh={() => dispatch(refreshActions.setIsCalenderPageRefresh(true))} />
              ))}
            </div>
          </div>
        ))
        : <>
          <ExpenseCardSkeleton />
          <ExpenseCardSkeleton />
        </>
      }
      <HandleItemSlideMenu isOpen={isOpen} close={() => setIsOpen(false)} lng={lng} selectedItem={selectedItem}
        triggerRefresh={() => {
          dispatch(refreshActions.setIsCalenderPageRefresh(true));
          dispatch(refreshActions.setIsBudgetPageRefresh(true));
        }} />
    </div>
  </div>)
}