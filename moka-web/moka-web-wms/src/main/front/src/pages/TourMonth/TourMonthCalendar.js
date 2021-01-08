import React, { useState } from 'react';
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
    const [holidayModal, setHolidayModal] = useState(false);
    const [summaryModal, setSummaryModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);

    return (
        <>
            <FullCalendar
                height="100%"
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
                    return `${title.date.year}년 ${title.date.month + 1}월`;
                }}
                eventTimeFormat={(time) => {
                    return `${time.date.hour}시`;
                }}
                // eventContent={(content) => {
                //     이벤트 컨텐츠 제어
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
                        const events = this.querySelector('.fc-daygrid-day-events');

                        if (events.style['padding-bottom'] === '') {
                            if (!events.querySelector('.fc-daygrid-event-harness')) {
                                this.appendChild(holidayEl);
                            }
                        }
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
                    let frame = date.dayEl,
                        events = frame.querySelector('.fc-daygrid-day-events');
                    if (events.style['padding-bottom'] === '') {
                        if (!events.querySelector('.fc-daygrid-event-harness')) {
                            setHolidayModal(true);
                        }
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
