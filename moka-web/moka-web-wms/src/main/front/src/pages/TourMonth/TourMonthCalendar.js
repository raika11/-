import React, { useState, useRef, useEffect } from 'react';
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

const holidayEl = document.createElement('div');
holidayEl.innerHTML = '휴일 지정';
holidayEl.className = 'fc-set-holiday';

const demoEvents = {
    events: [
        {
            id: '1',
            title: '신정',
            start: '2021-01-01',
            allDay: true,
            holiday: true,
        },
        {
            id: '2',
            title: '테스트',
            start: '2021-01-07',
            end: '2021-01-10',
        },
        { title: '중앙대학교사범대학 부속고등학교', start: '2021-01-12T10:00:00' },
    ],
    color: '#FF3907',
    // display: block, list-item, background (event obj)
};

const TourMonthCalendar = () => {
    const cellRef = useRef(null);
    const [holidayModal, setHolidayModal] = useState(false);
    const [summaryModal, setSummaryModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);

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
                locale="ko"
                events={demoEvents}
                bootstrapFontAwesome={false}
                titleFormat={(title) => {
                    return `${title.date.month + 1}월 ${title.date.year}`;
                }}
                eventTimeFormat={(time) => {
                    return `${time.date.hour}시`;
                }}
                // eventContent={(content) => {
                //     console.log(content);
                //     if (content.event.extendedProps.holiday) {
                //         content.backgroundColor = 'blue';
                //     }
                // }}
                dayCellDidMount={(cellData) => {
                    // console.log(cellData);
                    // console.log(cellData.view.calendar.getEvents());
                    let frame = cellData.el;
                    frame.style.cursor = 'pointer';

                    frame.firstChild.addEventListener('mouseenter', function () {
                        const events = this.querySelectorAll('.fc-daygrid-day-events');

                        if (!this.querySelector('.fc-event')) {
                            this.appendChild(holidayEl);
                        }

                        // events.forEach((event) => {
                        //     if (event.style['padding-bottom'] === '') {
                        //         frame.firstChild.appendChild(holidayEl);
                        //     }
                        // });

                        // console.log(events);
                        // if (events.style['padding-bottom'] === '') {
                        // }
                    });
                    frame.firstChild.addEventListener('mouseleave', function () {
                        if (this.querySelector('.fc-set-holiday')) {
                            this.removeChild(holidayEl);
                        }
                    });

                    // if (!frame.querySelector('.fc-daygrid-event')) {

                    // }
                }}
                dateClick={(date) => {
                    console.log(date);
                    let frame = date.dayEl;
                    if (!frame.querySelector('.fc-daygrid-event')) {
                        setHolidayModal(true);
                    }
                    // date.dayEl.style.backgroundColor = 'red';
                }}
                eventClick={(eventData) => {
                    console.log(eventData);
                    if (eventData.event.allDay) {
                        setCancelModal(true);
                    } else {
                        setSummaryModal(true);
                    }
                    // date.el.style.borderColor = 'red';
                }}
            />
            <SetHolidayModal show={holidayModal} onHide={() => setHolidayModal(false)} />
            <SummaryHolidayModal show={summaryModal} onHide={() => setSummaryModal(false)} />
            <CancelHolidayModal show={cancelModal} onHide={() => setCancelModal(false)} />
        </>
    );
};

export default TourMonthCalendar;
