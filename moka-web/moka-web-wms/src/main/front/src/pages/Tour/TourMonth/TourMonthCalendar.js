import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import jQuery from 'jquery';
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

const holidayEl = document.createElement('div');
// const findEl = (node, targetClass) => (node && node.classList.contains(targetClass) ? node : node.parentElement ? findEl(node.parentElement, targetClass) : null);

/**
 * 견학 월별현황 캘린더
 */
const TourMonthCalendar = () => {
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
    const mouseenterEventRef = useRef(null);

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

    useEffect(() => {
        mouseenterEventRef && document.removeEventListener('mouseenter', mouseenterEventRef.current);

        (function ($) {
            function mouseenterEvent(e) {
                // 이벤트 => 휴일 해제 버튼 렌더링
                if (day !== '') {
                    if ($(this).find('.fc-daygrid-event-harness').length > 0) {
                        const frame = $(this).find('.fc-daygrid-day-frame');
                        const dowNumber = Number(this.dataset['dow']);
                        if (day.substr(dowNumber, 1) === 'Y') {
                            if (this.querySelector('.fc-set-event-button')) {
                                // 휴일 해제 버튼 있을 때
                                return;
                            } else {
                                // 휴일 해제 버튼 없을 때
                                if (this.dataset && this.dataset['tourStatus'] === 'undefined' && this.dataset['denyRepeatYn'] === 'N') {
                                    this.style.cursor = 'pointer';
                                    let button = document.createElement('button');
                                    button.className = 'btn btn-negative fc-set-event-button';
                                    button.innerText = '휴일 해제';
                                    $(frame).append(button);
                                }
                            }
                        }
                    }
                }
            }

            $(document).on('mouseenter', '.fc-daygrid-day', mouseenterEvent);

            mouseenterEventRef.current = mouseenterEventRef;
        })((window.jQuery = jQuery));
    }, [day]);

    useEffect(() => {
        // 이벤트 id 값으로 object 조회
        let getEvent = (id) => {
            return calendarRef.current.getApi().view.calendar.getEventById(id).extendedProps;
        };

        (function ($) {
            // 휴일 버튼 해제
            $(document).on('click', '.fc-set-event-button', function (e) {
                const harness = $(this).parents('.fc-daygrid-day');
                if (harness) {
                    const data = harness[0].dataset['denySeq'];
                    setSelectedData(getEvent(data));
                    setCancelModal(true);
                }
            });

            // 이벤트 mouseleave
            $(document).on('mouseleave', '.fc-daygrid-day', function (e) {
                const targetBtn = $(this).find('.fc-set-event-button');
                if (targetBtn.length > 0) {
                    targetBtn.remove();
                }
            });
        })((window.jQuery = jQuery));
    }, []);

    return (
        <>
            <FullCalendar
                ref={calendarRef}
                height="100%"
                plugins={[bootstrapPlugin, interactionPlugin, dayGridPlugin, timeGridPlugin]}
                themeSystem="bootstrap"
                initialView="dayGridMonth"
                initialDate={moment().format(DB_DATEFORMAT)}
                customButtons={{
                    customPrev: {
                        text: 'prev',
                        click: () => {
                            alert('clicked the custom button!');
                        },
                    },
                }}
                // 달력 상단의 버튼, 제목을 정의
                headerToolbar={{
                    left: 'prev',
                    center: 'title',
                    right: 'today next',
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
                // 이벤트 목록
                events={{ events: [...holidayEvents, ...applyEvents], color: '#FF3907' }}
                // view가 Dom에 추가된 직후 호출
                viewDidMount={(v) => {}}
                datesSet={(d) => {
                    if (day !== '') {
                        let frame = document.querySelectorAll('.fc-daygrid-day');
                        frame.forEach((e) => {
                            if (day[e.dataset['dow']] === 'N') {
                                if (e.querySelector('.fc-daygrid-event-harness') && e.dataset['denyRepeatYn'] === 'N') {
                                    e.querySelector('.fc-daygrid-event-harness').style.visibility = 'hidden';
                                }
                            } else {
                                // 휴일 지정 el 추가
                                e.firstChild.addEventListener('mouseenter', function () {
                                    if (!e.firstChild.querySelector('.fc-daygrid-event-harness')) {
                                        e.firstChild.style.cursor = 'pointer';
                                        holidayEl.className = 'fc-set-holiday';
                                        holidayEl.innerHTML = '휴일 지정';
                                        e.firstChild.appendChild(holidayEl);
                                    }
                                });

                                // mouseleave 휴일 지정 el 제거
                                e.firstChild.addEventListener('mouseleave', function () {
                                    if (e.firstChild.querySelector('.fc-set-holiday')) {
                                        e.firstChild.removeChild(holidayEl);
                                    }
                                });
                            }
                        });
                    }
                }}
                // Dom에 td가 추가된 직후 호출
                // 최초 한번 그려진 후 날짜가 바뀌거나 표시하는 월이 다를때 다시 그리지 않음
                dayCellDidMount={(c) => {
                    let frame = c.el;
                    frame.dataset['dow'] = c.dow;

                    // 오늘 날짜 스타일 변경
                    // if (calendarMonth === currentMonth) {
                    if (frame.className.indexOf('fc-day-today') > -1) {
                        frame.style.backgroundColor = '#fff';
                        let circle = document.createElement('div');
                        let top = frame.querySelector('.fc-daygrid-day-top');
                        circle.className = 'fc-set-today-number';
                        top.appendChild(circle);
                    }
                }}
                dayCellContent={(c) => {
                    c.dayNumberText = c.dayNumberText.replace('일', '');
                }}
                eventTimeFormat={(t) => {
                    return `${t.date.hour}시`;
                }}
                // 이벤트 요소가 DOM에 추가 된 직후 호출
                eventDidMount={(e) => {
                    let eventEl = e.el;
                    let button = document.createElement('button');

                    // 이벤트 상위 el에 커스텀 데이터 추가
                    eventEl.parentElement.parentElement.parentElement.parentElement.dataset['denyRepeatYn'] = e.event.extendedProps.denyRepeatYn;
                    eventEl.parentElement.parentElement.parentElement.parentElement.dataset['denySeq'] = e.event.extendedProps.denySeq;
                    eventEl.parentElement.parentElement.parentElement.parentElement.dataset['tourStatus'] = e.event.extendedProps.tourStatus;
                    eventEl.parentElement.parentElement.parentElement.parentElement.dataset['tourTime'] = e.event.extendedProps.tourTime;
                    // 이벤트가 있고 매년 반복 이벤트가 아닐시 hidden
                    if (day !== '') {
                        let frameAll = document.querySelectorAll('.fc-daygrid-day');
                        frameAll.forEach((e) => {
                            if (day[e.dataset['dow']] === 'N') {
                                if (e.querySelector('.fc-daygrid-event-harness') && e.dataset['denyRepeatYn'] === 'N') {
                                    e.querySelector('.fc-daygrid-event-harness').style.visibility = 'hidden';
                                }
                            } else {
                                // 견학 신청 목록 버튼 추가
                                if (e.querySelector('.fc-daygrid-event-harness') && e.dataset['tourStatus'] === 'A') {
                                    e.style.cursor = 'pointer';
                                    button.className = 'btn btn-positive';
                                    button.style.position = 'absolute';
                                    button.style.top = '75%';
                                    button.style.left = '50%';
                                    button.style.transform = 'translate(-50%, -50%)';
                                    button.innerText = '확정';
                                    e.firstChild.appendChild(button);
                                } else if (e.querySelector('.fc-daygrid-event-harness') && e.dataset['tourStatus'] === 'S') {
                                    e.style.cursor = 'pointer';
                                    button.className = 'btn btn-negative';
                                    button.style.position = 'absolute';
                                    button.style.top = '75%';
                                    button.style.left = '50%';
                                    button.style.transform = 'translate(-50%, -50%)';
                                    button.innerText = '대기';
                                    e.firstChild.appendChild(button);
                                }
                                // 휴일 지정 el 추가
                                e.firstChild.addEventListener('mouseenter', function () {
                                    if (!e.firstChild.querySelector('.fc-daygrid-event-harness')) {
                                        e.firstChild.style.cursor = 'pointer';
                                        holidayEl.className = 'fc-set-holiday';
                                        holidayEl.innerHTML = '휴일 지정';
                                        e.firstChild.appendChild(holidayEl);
                                    }
                                });
                                // mouseleave 휴일 지정 el 제거
                                e.firstChild.addEventListener('mouseleave', function () {
                                    if (e.firstChild.querySelector('.fc-set-holiday')) {
                                        e.firstChild.removeChild(holidayEl);
                                    }
                                });
                            }
                        });
                    }
                    // 견학 타이틀 스타일 변경
                    let title = document.querySelectorAll('.fc-event-title');
                    if (title.length > 0) {
                        title.forEach((t) => {
                            if (t.classList.length > 1) {
                                return;
                            } else {
                                t.style.position = 'absolute';
                                t.style.top = '20px';
                                t.style.left = '15px';
                            }
                        });
                    }
                }}
                // 이벤트 컨텐츠 삽입, 이벤트 데이터가 변경 될 때마다 호출
                eventContent={(c) => {
                    // 관리자 지정 휴일의 스타일 변경
                    if (c.event.extendedProps.denyRepeatYn === 'N') {
                        c.backgroundColor = '#00A99D';
                        c.borderColor = '#00A99D';
                    }
                }}
                dateClick={(d) => {
                    // 클릭한 날짜와 이벤트 목록의 일치하는 이벤트 선택
                    let holiday = d.view.calendar.getEvents().filter((e) => e.extendedProps?.holiday === d.dateStr);
                    let eventDate = d.view.calendar.getEvents().filter((e) => e.extendedProps.denyDate?.substr(0, 10) === d.dateStr);
                    let applyDate = d.view.calendar.getEvents().filter((e) => e.extendedProps.tourDate?.substr(0, 10) === d.dateStr);

                    // 기본 설정 목록의 N과 일치하는 요일이면 클릭 막음
                    if (day[d.dayEl.dataset['dow']] === 'N') {
                        return;
                    } else if (holiday.length < 1 && eventDate.length < 1 && applyDate.length < 1) {
                        setClickDate(d.dateStr);
                        setHolidayModal(true);
                    } else if (applyDate.length > 0) {
                        setSelectedData(applyDate[0].extendedProps);
                        setSummaryModal(true);
                    }
                }}
            />
            <SetHolidayModal show={holidayModal} onHide={() => setHolidayModal(false)} date={clickDate} year={year} month={month} />
            <SummaryApplyModal show={summaryModal} onHide={() => setSummaryModal(false)} data={selectedData} />
            <CancelHolidayModal show={cancelModal} onHide={() => setCancelModal(false)} data={selectedData} year={year} month={month} />
        </>
    );
};

export default TourMonthCalendar;
