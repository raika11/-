import React, { useState, useRef } from 'react';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DB_DATEFORMAT } from '@/constants';
import SetHolidayModal from './modals/SetHolidayModal';
import SummaryHolidayModal from './modals/SummaryHolidayModal';
import CancelHolidayModal from './modals/CancelHolidayModal';

const demoEvents = [
    {
        title: '신정',
        start: '2021-01-01',
    },
    {
        title: '테스트',
        start: '2021-01-07',
        end: '2021-01-10',
    },
    { title: '중앙대학교사범대학 부속고등학교', start: '2021-01-12T16:00:00' },
];

const holidayEl = document.createElement('div');
const holidayText = document.createTextNode('휴일 지정');

const TourMonthCalendar = () => {
    const cellRef = useRef(null);
    const [holiday, setHoliday] = useState(false);
    const [summary, setSummary] = useState(false);
    const [cancel, setCancel] = useState(false);

    return (
        <>
            <FullCalendar
                ref={cellRef}
                height={685}
                plugins={[bootstrapPlugin, interactionPlugin, dayGridPlugin, timeGridPlugin]}
                themeSystem="bootstrap"
                initialView="dayGridMonth"
                initialDate={moment().format(DB_DATEFORMAT)}
                headerToolbar={{
                    left: 'prev next today',
                    center: 'title',
                    right: false,
                }}
                // locale="ko"
                events={demoEvents}
                bootstrapFontAwesome={false}
                // editable={false}
                // dayHeaderClassNames={(date) => }
                titleFormat={(date) => {
                    return `${date.date.month + 1}월 ${date.date.year}`;
                }}
                dayHeaderContent={(date) => {
                    let weekList = ['일', '월', '화', '수', '목', '금', '토'];
                    return weekList[date.dow];
                }}
                eventClick={(date) => {
                    console.log(date);
                    setCancel(true);
                    // date.el.style.borderColor = 'red';
                }}
                dateClick={(date) => {
                    console.log(date);
                    console.log(cellRef);
                    alert('Clicked on: ' + date.dateStr);
                    // date.dayEl.style.backgroundColor = 'red';
                }}
            />
            <SetHolidayModal show={holiday} onHide={() => setHoliday(false)} />
            <SummaryHolidayModal show={summary} onHide={() => setSummary(false)} />
            <CancelHolidayModal show={cancel} onHide={() => setCancel(false)} />
        </>
    );
};

export default TourMonthCalendar;
