import React from 'react';
import DateTime from 'react-datetime';

import moment from 'moment';
moment.locale('ko');
const defaultDateFormat = 'YYYY-MM-DD';
const defaultTimeFormat = 'HH:mm';

/**
 * DateTimePicker
 * @param {string} props.placeholder placeholder
 * @param {string} props.dateFormat 날짜포맷(moment)
 * @param {string} props.timeFormat 시간포맷(moment)
 */
const MokaDateTimePicker = (props) => {
    const { placeholder, dateFormat, timeFormat, ...rest } = props;

    const renderDay = (props, currentDate, selectedDate) => {
        // 일요일 스타일 변경
        if (currentDate._d.getDay() === 0) {
            return (
                <td {...props} className={`${props.className} sunday`}>
                    {currentDate.date()}
                </td>
            );
        }
        return <td {...props}>{currentDate.date()}</td>;
    };

    return (
        <DateTime
            locale="ko"
            dateFormat={dateFormat || defaultDateFormat}
            timeFormat={timeFormat || defaultTimeFormat}
            defaultValue={moment().format(`${defaultDateFormat} ${defaultTimeFormat}`)}
            {...rest}
            renderDay={renderDay}
            inputProps={{ placeholder: placeholder }}
        />
    );
};

export default MokaDateTimePicker;
