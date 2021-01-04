import React from 'react';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DB_DATEFORMAT } from '@/constants';

const demoEvents = [
    {
        title: 'All Day Event',
        start: '2021-01-01',
    },
    {
        title: 'Long Event',
        start: '2020-07-07',
        end: '2020-01-10',
    },
    {
        groupId: '999',
        title: 'Repeating Event',
        start: '2020-01-09T16:00:00',
    },
    {
        groupId: '999',
        title: 'Repeating Event',
        start: '2020-01-16T16:00:00',
    },
    {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2020-01-28',
    },
];

const TourMonthCalendar = () => {
    return (
        <FullCalendar
            plugins={[bootstrapPlugin, dayGridPlugin, timeGridPlugin]}
            themeSystem="bootstrap"
            initialView="dayGridMonth"
            initialDate={moment().format(DB_DATEFORMAT)}
            headerToolbar={{
                left: 'prev next today',
                center: 'title',
                right: false,
            }}
            events={demoEvents}
            bootstrapFontAwesome={false}
            locale="ko"
            height="100%"
            eventClick={(info) => {
                alert('Event: ' + info.event.title);
                alert('View: ' + info.view.type);
            }}
            eventMouseEnter={() => {
                return <p className="m-0 color-secondary">휴일 지정</p>;
            }}
        />
    );
};

export default TourMonthCalendar;
