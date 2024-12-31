'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useSelector } from 'react-redux';
import { ExpenseCardSkeleton } from './expense-card';

// Loading animation
const shimmer =
  'overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CalendarPageSkeleton() {
    const { selectedDateStr } = useSelector((state: any) => state.calendar);
  return (
    <div className="calendar-page-wrapper">
        <div className="full-calendar-custom-style">            
            <FullCalendar 
                plugins={[dayGridPlugin]}
                initialDate={selectedDateStr || null}
                initialView='dayGridMonth'
                weekends={true}
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
        <div className="relative">
            <div className={`${shimmer} relative flex flex-col list-of-expenses p-4 h-[39vh]`}>
                <div className="flex justify-between mb-4">
                    <div className="flex flex-col items-center">
                        <div className="h-[24px] w-[75px] rounded-md bg-gray-200 text-sm font-medium" />
                        <div className="my-2 h-[24px] w-[85px] rounded-md bg-gray-200 text-sm font-medium" />
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-[24px] w-[95px] rounded-md bg-gray-200 text-sm font-medium" />
                        <div className="my-2 h-[24px] w-[110px] rounded-md bg-gray-200 text-sm font-medium" />
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-[24px] w-[95px] rounded-md bg-gray-200 text-sm font-medium" />
                        <div className="my-2 h-[24px] w-[110px] rounded-md bg-gray-200 text-sm font-medium" />
                    </div>
                </div>
                <ExpenseCardSkeleton />
                <ExpenseCardSkeleton />
                <ExpenseCardSkeleton />
            </div>
        </div>
    </div>
  );
}