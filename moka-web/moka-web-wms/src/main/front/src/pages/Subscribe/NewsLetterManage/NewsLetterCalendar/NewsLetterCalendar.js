import React, { useRef } from 'react';
import moment from 'moment';
// import jQuery from 'jquery';
import Helmet from 'react-helmet';
// import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@/components';
import { DB_DATEFORMAT } from '@/constants';
import NewsLetterCalendarAgGrid from './NewsLetterCalendarAgGrid';

/**
 * 뉴스레터 관리 > 뉴스레더 발송 일정
 */
const NewsLetterCalendar = ({ match, displayName }) => {
    const calendarRef = useRef(null);

    return (
        <>
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 캘린더 */}
            <MokaCard className="w-100" title={displayName}>
                <Row className="h-100" noGutters>
                    <Col xs={10} className="pr-gutter">
                        <FullCalendar
                            ref={calendarRef}
                            height="100%"
                            plugins={[bootstrapPlugin, interactionPlugin, dayGridPlugin, timeGridPlugin]}
                            themeSystem="bootstrap"
                            initialView="dayGridMonth"
                            initialDate={moment().format(DB_DATEFORMAT)}
                            // 달력 상단의 버튼, 제목을 정의
                            headerToolbar={{
                                left: 'prev',
                                center: 'title',
                                right: 'today next',
                            }}
                            // buttonIcons={{
                            //     prev: 'fa-angle-double-left',
                            //     next: 'fa-angle-double-right',
                            // }}
                            locale="ko"
                            bootstrapFontAwesome={false}
                            // 제목에 표시 될 텍스트
                            titleFormat={(t) => {
                                // setYear(`${t.date.year}`);
                                // setMonth(`0${t.date.month + 1}`.substr(-2));
                                let title = `${t.date.year}년 ${t.date.month + 1}월`;

                                return title;
                            }}
                            // true이면 6주로 fix된 월별 보기
                            fixedWeekCount={false}
                            // 이벤트 목록
                            events={{}}
                            // view가 Dom에 추가된 직후 호출
                            viewDidMount={(v) => {}}
                            datesSet={(d) => {}}
                            // Dom에 td가 추가된 직후 호출
                            // 최초 한번 그려진 후 날짜가 바뀌거나 표시하는 월이 다를때 다시 그리지 않음
                            dayCellDidMount={(c) => {}}
                            dayCellContent={(c) => {
                                // c.dayNumberText = c.dayNumberText.replace('일', '');
                            }}
                            eventTimeFormat={(t) => {
                                return `${t.date.hour}시`;
                            }}
                            // 이벤트 요소가 DOM에 추가 된 직후 호출
                            eventDidMount={(e) => {}}
                            // 이벤트 컨텐츠 삽입, 이벤트 데이터가 변경 될 때마다 호출
                            eventContent={(c) => {
                                // 관리자 지정 휴일의 스타일 변경
                                // if (c.event.extendedProps.denyRepeatYn === 'N') {
                                //     c.backgroundColor = '#00A99D';
                                //     c.borderColor = '#00A99D';
                                // }
                            }}
                            dateClick={(d) => {
                                // 클릭한 날짜와 이벤트 목록의 일치하는 이벤트 선택
                                // let holiday = d.view.calendar.getEvents().filter((e) => e.extendedProps?.holiday === d.dateStr);
                                // let eventDate = d.view.calendar.getEvents().filter((e) => e.extendedProps.denyDate?.substr(0, 10) === d.dateStr);
                                // let applyDate = d.view.calendar.getEvents().filter((e) => e.extendedProps.tourDate?.substr(0, 10) === d.dateStr);
                                // 기본 설정 목록의 N과 일치하는 요일이면 클릭 막음
                                // if (day[d.dayEl.dataset['dow']] === 'N') {
                                //     return;
                                // } else if (holiday.length < 1 && eventDate.length < 1 && applyDate.length < 1) {
                                //     setClickDate(d.dateStr);
                                //     setHolidayModal(true);
                                // } else if (applyDate.length > 0) {
                                //     setSelectedData(applyDate[0].extendedProps);
                                //     setSummaryModal(true);
                                // }
                            }}
                        />
                    </Col>

                    <Col xs={2} className="d-flex flex-column">
                        <NewsLetterCalendarAgGrid />
                    </Col>
                </Row>
            </MokaCard>
        </>
    );
};

export default NewsLetterCalendar;
