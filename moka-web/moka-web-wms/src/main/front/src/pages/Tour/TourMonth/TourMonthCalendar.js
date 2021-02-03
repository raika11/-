import React, { useState, useRef, useEffect } from 'react';
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
import { getTourSetup, clearStore, getTourDenyMonthList, getTourApplyMonthList } from '@/store/tour';
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

const TourMonthCalendar = (props) => {
    const dispatch = useDispatch();
    const holidayList = useSelector((store) => store.tour.holidayList);
    const tourApplyList = useSelector((store) => store.tour.tourApplyList);
    const tourSetup = useSelector((store) => store.tour.tourSetup);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState([]);
    const [holidayEvents, setHolidayEvents] = useState([]);
    const [applyEvents, setApplyEvents] = useState([]);
    const [clickDate, setClickDate] = useState('');
    const [selectedData, setSelectedData] = useState({});
    const [holidayModal, setHolidayModal] = useState(false);
    const [summaryModal, setSummaryModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);

    // const [mountCell, setMountCell] = useState([]);
    const calendarRef = useRef(null);
    const setHolidayRef = useRef(null);

    // const formatEvents = {
    //     // { events: [...holidayEvents, ...applyEvents], color: '#FF3907' }
    // };

    // 이벤트 데이터 변경 후 호출
    const handleEventSet = (events) => {
        // console.log(events);
    };

    useEffect(() => {
        if (Object.keys(tourSetup).length < 1) {
            dispatch(getTourSetup());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (Object.keys(tourSetup).length > 0) {
            let weekArr = tourSetup.tourWeekYn.split('');
            setDay(weekArr);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tourSetup]);

    useEffect(() => {
        // console.log(calendarRef.current);
        // console.log(`year: ${year}, month: ${month}`);
        if (year !== '' && month !== '') {
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
        }

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
            {/* {day.length > 0 && ( */}
            {/* <> */}
            <FullCalendar
                ref={calendarRef}
                height="100%"
                plugins={[bootstrapPlugin, interactionPlugin, dayGridPlugin, timeGridPlugin]}
                themeSystem="bootstrap"
                initialView="dayGridMonth"
                initialDate={moment().format(DB_DATEFORMAT)}
                // 달력 상단의 버튼, 제목을 정의
                headerToolbar={{
                    left: 'prev next today',
                    center: 'title',
                    right: false,
                }}
                locale="ko"
                // 제목에 표시 될 텍스트
                titleFormat={(t) => {
                    setYear(t.date.year);
                    setMonth(`0${t.date.month + 1}`.substr(-2));
                    return `${t.date.year}년 ${t.date.month + 1}월`;
                }}
                // true이면 6주로 fix된 월별 보기
                fixedWeekCount={false}
                // true이면 이전 또는 다음 달의 날짜를 렌더링
                showNonCurrentDates={false}
                bootstrapFontAwesome={false}
                events={
                    { events: [...holidayEvents, ...applyEvents], color: '#FF3907' }
                    // demoEvents
                }
                datesSet={(e) => {
                    console.log(e);
                }}
                // selectable={true}
                // selectOverlap={false}
                // select={(s) => {
                //     s.view.calendar.unselect();

                //     let year = s.start.getFullYear();
                //     let month = `0${s.start.getMonth() + 1}`.substr(-2);
                //     let date = `0${s.start.getDate()}`.substr(-2);
                //     let targetDate = `${year}-${month}-${date}`;
                //     let eventDate = s.view.calendar.getEvents().filter((e) => e.startStr === targetDate);
                //     if (eventDate.length < 1) {
                //         setHolidayModal(true);
                //     }
                // }}
                dateClick={(d) => {
                    // console.log(d);

                    let eventDate = d.view.calendar.getEvents().filter((e) => e.startStr === d.dateStr);
                    // let applyDate = d.view.calendar.getEvents().filter((e) => e.extendedProps)
                    console.log(d.extendedProps);
                    if (eventDate.length < 1) {
                        setHolidayModal(true);
                    } else {
                        setCancelModal(true);
                    }
                    // let frame = d.dayEl,
                    //     events = frame.querySelector('.fc-daygrid-day-events');
                    // if (events.style['padding-bottom'] === '') {
                    //     if (!events.querySelector('.fc-daygrid-event-harness')) {
                    //         setHolidayModal(true);
                    //     }
                    // }
                    // setClickDate(date.dateStr);
                    // date.dayEl.style.backgroundColor = 'red';
                }}
                eventsSet={handleEventSet}
                // Dom에 td가 추가된 직후 호출
                // 최초 한번 그려진 후 날짜가 바뀌거나 표시하는 월이 다를때 다시 그리지 않음
                dayCellDidMount={(cell) => {
                    let frame = cell.el;

                    // console.log(frame);
                    // let weekArr = tourSetup.tourWeekYn.split('');

                    // 오늘 날짜 스타일 변경
                    if (frame.className.indexOf('fc-day-today') > -1) {
                        frame.style.backgroundColor = '#fff';
                        let circle = document.createElement('div');
                        let top = frame.querySelector('.fc-daygrid-day-top');
                        circle.className = 'fc-set-today-number';
                        top.appendChild(circle);
                    }

                    // diabled 셀, 이벤트 셀, 기본 설정의 쉬는 날 휴일 지정 막음
                    if (frame.className.indexOf('fc-day-disabled') === -1) {
                        // mouseenter 휴일 지정 el 추가
                        frame.firstChild.addEventListener('mouseenter', function () {
                            const events = this.querySelector('.fc-daygrid-day-events');

                            // if (events.style['padding-bottom'] === '') {
                            if (!events.querySelector('.fc-daygrid-event-harness')) {
                                this.appendChild(holidayEl);
                            }
                            // }
                        });

                        // mouseleave 휴일 지정 el 제거
                        frame.firstChild.addEventListener('mouseleave', function () {
                            if (this.querySelector('.fc-set-holiday')) {
                                this.removeChild(holidayEl);
                            }
                        });
                    }
                }}
                dayCellContent={(cell) => {
                    // let innerText;
                    // console.log(cell);

                    // let year = cell.date.getFullYear();
                    // let month = `0${cell.date.getMonth() + 1}`.substr(-2);
                    // let date = `0${cell.date.getDate()}`.substr(-2);
                    // let targetDate = `${year}-${month}-${date}`;
                    // let eventDate = cell.view.calendar.getEvents().filter((e) => e.startStr === targetDate);
                    // if (eventDate.length < 1) {
                    // innerText = '휴일 지정';
                    // setHolidayModal(true);
                    // let el = createElement('div', {}, innerText);
                    // el.style.position = 'absolute';
                    // el.style.left = '15px';
                    // el.style.top = '50px';

                    // return el;
                    // }
                    // console.log(cell.view.calendar.getEvents());
                    // if (day.length > 0) {
                    //     if (day[cell.dow] === 'Y') {
                    //     cell.isDisabled = true;
                    //     }
                    // }
                    // console.log(cell.view.calendar);
                    // if (setHolidayRef.current) {
                    //     setHolidayRef.current.setHoliday();
                    // }
                    // if (cell.isToday) {
                    //     let frame = document.querySelector('.fc-day-today');

                    // }
                    cell.dayNumberText = cell.dayNumberText.replace('일', '');
                }}
                eventTimeFormat={(time) => {
                    return `${time.date.hour}시`;
                }}
                eventContent={(content) => {
                    // 이벤트 컨텐츠 제어
                    // console.log(content);
                    // let applyFrame = document.createElement('div');

                    // if (setHolidayRef.current) {
                    //     setHolidayRef.current.setHoliday();
                    // }

                    // 관리자 지정 휴일의 스타일 변경
                    if (content.event.extendedProps.denyRepeatYn === 'N') {
                        content.backgroundColor = '#00A99D';
                        content.borderColor = '#00A99D';
                    } else if (content.event.extendedProps.tourTime !== '') {
                    }
                }}
                eventDidMount={(e) => {
                    // console.log(e);

                    let button = document.createElement('button');
                    let top = e.el;
                    let title = top.querySelector('.fc-event-title');

                    if (e.event.extendedProps.tourStatus === 'A' && e.event.extendedProps.tourTime !== '') {
                        button.className = 'btn btn-positive fc-set-event-button';
                        button.innerText = '확정';
                        title.style.position = 'absolute';
                        title.style.top = '20px';
                        title.style.left = '15px';
                        top.appendChild(button);
                    } else if (e.event.extendedProps.tourStatus === 'S' && e.event.extendedProps.tourTime !== '') {
                        button.className = 'btn btn-negative fc-set-event-button';
                        button.innerText = '대기';
                        title.style.position = 'absolute';
                        title.style.top = '20px';
                        title.style.left = '15px';
                        top.appendChild(button);
                    } else if (e.event.extendedProps.denyRepeatYn === 'N') {
                        button.className = 'btn btn-negative fc-set-event-button';
                        button.innerText = '휴일 해제';
                        top.appendChild(button);
                    }
                }}
                eventClick={(eventData) => {
                    // console.log(eventData.event._def.extendedProps);
                    if (eventData.event.allDay) {
                        setCancelModal(true);
                    } else {
                        setSummaryModal(true);
                    }
                    setSelectedData(eventData.event._def.extendedProps);
                }}
            />
            <SetHolidayModal ref={setHolidayRef} show={holidayModal} onHide={() => setHolidayModal(false)} date={clickDate} />
            <SummaryApplyModal show={summaryModal} onHide={() => setSummaryModal(false)} data={selectedData} />
            <CancelHolidayModal show={cancelModal} onHide={() => setCancelModal(false)} data={selectedData} />
            {/* </> */}
            {/* )} */}
        </>
    );
};

export default TourMonthCalendar;
