"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { calendarActions } from '@/app/lib/redux';
import { format } from 'date-fns'

export function CompactCalendarHandler() {
    const dispatch = useDispatch();
    const { selectedDateStr } = useSelector((state:any) => state.calendar);

    const handleDatesSet = (arg: any) => {      
        const calendarApi = arg.view.calendar;
        const currentDate = calendarApi.getDate();
    
        // Selected Month, need to store it globally.
        dispatch(calendarActions.setSelectedDateStr(format(currentDate, 'yyyy-MM-dd')));
    };
    return (
        <div className="full-calendar-custom-style full-calendar-hide">
            <FullCalendar 
                plugins={[dayGridPlugin]}
                datesSet={handleDatesSet} // to handle pre / next on headerTool bar event.
                initialDate={selectedDateStr || null}
                headerToolbar={{
                    left: 'prev',
                    center: 'title today',
                    right: 'next'
                }}
            />
        </div>
    );
}