import React, { useState, useRef, forwardRef, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DB_DATEFORMAT } from '@/constants';
import SetHolidayModal from './modals/SetHolidayModal';
import SummaryApplyModal from './modals/SummaryApplyModal';
import CancelHolidayModal from './modals/CancelHolidayModal';
import { clearStore, getTourDenyMonthList, getTourApplyMonthList } from '@/store/tour';
// import toast from '@/utils/toastUtil';

const holidayEl = document.createElement('div');
holidayEl.innerHTML = '휴일 지정';
holidayEl.className = 'fc-set-holiday';

// const demoEvents = {
//     events: [
//         {
//             id: '1',
//             title: '설날',
//             start: '2021-02-11',
//             end: '2021-02-14',
//             allDay: true,
//             holiday: true,
//         },
//         {
//             id: '2',
//             title: '테스트',
//             start: '2021-02-16',
//             end: '2021-02-18',
//         },
//         { title: '중앙대학교사범대학 부속고등학교', start: '2021-02-16T10:00:00' },
//     ],
//     color: '#FF3907',
//     // display: block, list-item, background (event obj)
// };

const TourMonthCalendar = forwardRef((props, ref) => {
    const dispatch = useDispatch();
    const holidayList = useSelector((store) => store.tour.holidayList);
    const tourApplyList = useSelector((store) => store.tour.tourApplyList);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [holidayEvents, setHolidayEvents] = useState([]);
    const [applyEvents, setApplyEvents] = useState([]);
    const [clickDate, setClickDate] = useState('');
    const [selectedData, setSelectedData] = useState({});
    const [holidayModal, setHolidayModal] = useState(false);
    const [summaryModal, setSummaryModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const calendarRef = useRef(null);

    useEffect(() => {
        // console.log(calendarRef.current);
        // console.log(`year: ${year}, month: ${month}`);
        dispatch(
            getTourDenyMonthList({
                year: year,
                month: month,
            }),
        );
        dispatch(
            getTourApplyMonthList({
                year: year,
                month: month,
            }),
        );

        return () => {
            clearStore();
        };
    }, [dispatch, month, year]);

    useEffect(() => {
        // 휴일 목록
        // let holiday = {};
        if (holidayList.length > 0) {
            setHolidayEvents(
                holidayList.map((data) => {
                    if (data.denyRepeatYn === 'Y') {
                        return {
                            ...data,
                            id: data.denySeq,
                            title: `${data.denyTitle} (매년 반복)`,
                            start: data.holiday,
                        };
                    } else if (data.denyRepeatYn === 'N') {
                        return {
                            ...data,
                            id: data.denySeq,
                            title: `${data.denyTitle} (관리자 지정)`,
                            start: data.holiday,
                        };
                    } else {
                        return {
                            ...data,
                            id: data.denySeq,
                            title: data.denyTitle,
                            start: data.holiday,
                        };
                    }
                }),
            );
        }
    }, [holidayList]);

    useEffect(() => {
        if (tourApplyList.length > 0) {
            setApplyEvents(
                tourApplyList.map((apply) => {
                    return {
                        ...apply,
                        title: apply.tourGroupNm,
                        start: `${apply.tourDate.substr(0, 10)}T${apply.tourTime}:00:00`,
                    };
                }),
            );
        }
    }, [tourApplyList]);

    return (
        <>
            <FullCalendar
                ref={calendarRef}
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
                fixedWeekCount={false}
                showNonCurrentDates={false}
                bootstrapFontAwesome={false}
                events={{ events: [...holidayEvents, ...applyEvents], color: '#FF3907' }}
                titleFormat={(title) => {
                    setYear(title.date.year);
                    setMonth(`0${title.date.month + 1}`.substr(-2));
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
                    // console.log(date);
                    let frame = date.dayEl,
                        events = frame.querySelector('.fc-daygrid-day-events');
                    if (events.style['padding-bottom'] === '') {
                        if (!events.querySelector('.fc-daygrid-event-harness')) {
                            setHolidayModal(true);
                        }
                    }
                    setClickDate(date.dateStr);
                    // date.dayEl.style.backgroundColor = 'red';
                }}
                eventClick={(eventData) => {
                    // console.log(eventData.event._def.extendedProps);
                    if (eventData.event.allDay) {
                        setCancelModal(true);
                    } else {
                        setSummaryModal(true);
                    }
                    setSelectedData(eventData.event._def.extendedProps);
                    // date.el.style.borderColor = 'red';
                }}
            />
            <SetHolidayModal show={holidayModal} onHide={() => setHolidayModal(false)} date={clickDate} />
            <SummaryApplyModal show={summaryModal} onHide={() => setSummaryModal(false)} data={selectedData} />
            <CancelHolidayModal show={cancelModal} onHide={() => setCancelModal(false)} data={selectedData} />
        </>
    );
});

export default TourMonthCalendar;
