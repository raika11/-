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
    const [day, setDay] = useState('');
    const [holidayEvents, setHolidayEvents] = useState([]);
    const [applyEvents, setApplyEvents] = useState([]);
    const [clickDate, setClickDate] = useState('');
    const [selectedData, setSelectedData] = useState({});
    const [holidayModal, setHolidayModal] = useState(false);
    const [summaryModal, setSummaryModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);

    const calendarRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    useEffect(() => {
        if (Object.keys(tourSetup).length < 1) {
            dispatch(getTourSetup());
        } else {
            let weekArr = tourSetup.tourWeekYn;
            setDay(weekArr);
        }
    }, [dispatch, tourSetup]);

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
            {/* <input type="hidden" ref={inputRef} value="" /> */}
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
                    setYear(`${t.date.year}`);
                    setMonth(`0${t.date.month + 1}`.substr(-2));
                    let title = `${t.date.year}년 ${t.date.month + 1}월`;

                    return title;
                }}
                // true이면 6주로 fix된 월별 보기
                fixedWeekCount={false}
                bootstrapFontAwesome={false}
                events={{ events: [...holidayEvents, ...applyEvents], color: '#FF3907' }}
                dateClick={(d) => {
                    // console.log(d);
                    let eventDate = d.view.calendar.getEvents().filter((e) => e.startStr === d.dateStr);
                    // let applyDate = d.view.calendar.getEvents().filter((e) => e.extendedProps)
                    // console.log(d.extendedProps);
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
                    setClickDate(d.dateStr);
                    // date.dayEl.style.backgroundColor = 'red';
                }}
                datesSet={(d) => {
                    if (day !== '') {
                        let a = document.querySelectorAll('.fc-daygrid-day');
                        // let myday = inputRef.current.value;
                        a.forEach((e) => {
                            if (day[e.dataset['dow']] === 'N') {
                                e.firstChild.style.visibility = 'hidden';
                            }
                        });
                    }
                }}
                viewDidMount={(view) => {
                    // if (today.dataset['date'].split('-')[0] === calendarDate[0] && `0${calendarDate[1]}`.substr(-2) === today.dataset['date'].split('-')[1]) {
                    //     let circle = document.createElement('div');
                    //     let top = today.querySelector('.fc-daygrid-day-top');
                    //     circle.className = 'fc-set-today-number';
                    //     top.appendChild(circle);
                    // }
                    // console.log(day);

                    document.addEventListener('mouseover', function (e) {
                        if (e.target.tagName !== 'DIV' && e.target.tagName !== 'A') {
                            return;
                        }
                        if (e.target.classList[0] === 'fc-set-holiday') {
                            return;
                        }
                        let frame;
                        let calendarDate;
                        let currentDate;
                        let targetEl;
                        if (e.target.classList[0] === 'fc-daygrid-day-number') {
                            frame = e.target.parentElement.parentElement.parentElement;
                            targetEl = e.target.parentElement.parentElement;
                        } else if (e.target.classList[0] === 'fc-daygrid-day-events' || e.target.classList[0] === 'fc-daygrid-day-top') {
                            frame = e.target.parentElement.parentElement;
                            targetEl = e.target.parentElement;
                        } else if (e.target.classList[0] === 'fc-daygrid-day-frame') {
                            frame = e.target.parentElement;
                            targetEl = e.target;
                        } else {
                            return;
                        }
                        if (frame.querySelector('.fc-daygrid-event-harness')) {
                            return;
                        }
                        calendarDate = document.querySelector('.fc-toolbar-title').textContent.replace('년', '').replace('월', '').split(' ');
                        currentDate = frame.dataset['date'].split('-');
                        if (calendarDate[0] === currentDate[0] && `0${calendarDate[1]}`.substr(-2) === currentDate[1]) {
                            if (!frame.querySelector('.fc-set-holiday')) {
                                targetEl.appendChild(holidayEl);
                            }
                        }
                    });

                    document.addEventListener('mouseout', function (e) {
                        if (e.target.tagName !== 'DIV' && e.target.tagName !== 'A') {
                            return;
                        }
                        if (e.target.classList[0] === 'fc-set-holiday') {
                            return;
                        }
                        let frame;
                        let calendarDate;
                        let currentDate;
                        if (e.target.classList[0] === 'fc-daygrid-day-number') {
                            frame = e.target.parentElement.parentElement.parentElement;
                        } else if (e.target.classList[0] === 'fc-daygrid-day-events' || e.target.classList[0] === 'fc-daygrid-day-top') {
                            frame = e.target.parentElement.parentElement;
                        } else if (e.target.classList[0] === 'fc-daygrid-day-frame') {
                            frame = e.target.parentElement;
                        } else {
                            return;
                        }
                        calendarDate = document.querySelector('.fc-toolbar-title').textContent.replace('년', '').replace('월', '').split(' ');
                        currentDate = frame.dataset['date'].split('-');
                        if (calendarDate[0] === currentDate[0] && `0${calendarDate[1]}`.substr(-2) === currentDate[1]) {
                            if (frame.querySelector('.fc-set-holiday') !== null) {
                                frame.querySelector('.fc-set-holiday').remove();
                            }
                        }
                    });
                }}
                // Dom에 td가 추가된 직후 호출
                // 최초 한번 그려진 후 날짜가 바뀌거나 표시하는 월이 다를때 다시 그리지 않음
                dayCellDidMount={(cell) => {
                    let frame = cell.el;
                    frame.dataset['dow'] = cell.dow;
                    console.log(day);

                    // let calendarMonth = `0${cell.view.calendar.getDate().getMonth() + 1}`.substr(-2);
                    // let currentDate = cell.el.dataset;
                    // let currentMonth = currentDate['date'].split('-')[1];
                    // let weekArr = tourSetup.tourWeekYn.split('');
                    // console.log(calendarMonth, currentMonth);
                    // if (calendarMonth === currentMonth) {
                    //     frame.firstChild.addEventListener('mouseenter', function (e) {
                    //         const events = e.target.querySelector('.fc-daygrid-day-events');
                    //         if (!events.querySelector('.fc-daygrid-event-harness')) {
                    //             e.target.appendChild(holidayEl);
                    //         }
                    //     });
                    // }
                    // 오늘 날짜 스타일 변경
                    // if (calendarMonth === currentMonth) {
                    if (frame.className.indexOf('fc-day-today') > -1) {
                        let circle = document.createElement('div');
                        let top = frame.querySelector('.fc-daygrid-day-top');
                        circle.className = 'fc-set-today-number';
                        top.appendChild(circle);
                    }
                    // }
                    // diabled 셀, 이벤트 셀, 기본 설정의 쉬는 날 휴일 지정 막음
                    // if (frame.className.indexOf('fc-day-disabled') === -1) {
                    //     // mouseenter 휴일 지정 el 추가
                    //     frame.firstChild.addEventListener('mouseenter', function () {
                    //         const events = this.querySelector('.fc-daygrid-day-events');
                    //         // if (events.style['padding-bottom'] === '') {
                    //         if (!events.querySelector('.fc-daygrid-event-harness')) {
                    //             this.appendChild(holidayEl);
                    //         }
                    //         // }
                    //     });
                    //     // mouseleave 휴일 지정 el 제거
                    //     frame.firstChild.addEventListener('mouseleave', function () {
                    //         if (this.querySelector('.fc-set-holiday')) {
                    //             this.removeChild(holidayEl);
                    //         }
                    //     });
                    // }
                }}
                dayCellContent={(cell) => {
                    // let innerText;
                    // console.log(cell);
                    // let button = document.createElement('button');
                    // let eventEl = document.querySelector('.fc-daygrid-event-harness')

                    // if (eventEl) {
                    //     let targetEl = eventEl.parentElement.parentElement;
                    //     document.addEventListener('mouseover', function (e) {

                    //     });
                    // }

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

                    // 관리자 지정 휴일의 스타일 변경
                    if (content.event.extendedProps.denyRepeatYn === 'N') {
                        content.backgroundColor = '#00A99D';
                        content.borderColor = '#00A99D';
                    }
                    // else if (content.event.extendedProps.tourTime !== '') {
                    // }
                }}
                eventDidMount={(e) => {
                    // if (day !== '') {
                    //     inputRef.current.value = day;
                    // }
                    let button = document.createElement('button');
                    let top = e.el;
                    let title = top.querySelector('.fc-daygrid-day');
                    let a = {};
                    a.el = top;
                    if (e.event.extendedProps.tourStatus === 'A' && e.event.extendedProps.tourTime !== '') {
                        a.type = '1번';
                        a.title = title;
                        // button.className = 'btn btn-positive fc-set-event-button';
                        // button.innerText = '확정';
                        // title.style.position = 'absolute';
                        // title.style.top = '20px';
                        // title.style.left = '15px';
                        // top.appendChild(button);
                    } else if (e.event.extendedProps.tourStatus === 'S' && e.event.extendedProps.tourTime !== '') {
                        a.type = '2번';
                        a.title = title;
                        // button.className = 'btn btn-negative fc-set-event-button';
                        // button.innerText = '대기';
                        // title.style.position = 'absolute';
                        // title.style.top = '20px';
                        // title.style.left = '15px';
                        // top.appendChild(button);
                    } else if (e.event.extendedProps.denyRepeatYn === 'N') {
                        button.className = 'btn btn-negative fc-set-event-button';
                        button.innerText = '휴일 해제';
                        top.appendChild(button);
                    }
                    a.m = document.querySelector('.fc-toolbar-title').textContent;
                }}
                eventClick={(e) => {
                    if (e.event.allDay) {
                        setCancelModal(true);
                    } else {
                        setSummaryModal(true);
                    }
                    setSelectedData(e.event._def.extendedProps);
                }}
            />
            <SetHolidayModal show={holidayModal} onHide={() => setHolidayModal(false)} date={clickDate} year={year} month={month} />
            <SummaryApplyModal show={summaryModal} onHide={() => setSummaryModal(false)} data={selectedData} />
            <CancelHolidayModal show={cancelModal} onHide={() => setCancelModal(false)} data={selectedData} year={year} month={month} />
        </>
    );
};

export default TourMonthCalendar;
