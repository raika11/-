import React from 'react';
import DateTime from 'react-datetime';

import moment from 'moment';
moment.locale('ko');
const defaultDateFormat = 'YYYY-MM-DD';
const defaultTimeFormat = 'HH:mm';

/**
 * DateTime 입력창
 * @param {string} props.placeholder placeholder
 * @param {string} props.dateFormat 날짜포맷(moment)
 * @param {string} props.timeFormat 시간포맷(moment)
 */
const MokaDateTimePicker = (props) => {
    const { placeholder, dateFormat, timeFormat, ...rest } = props;

    return (
        <DateTime
            locale="ko"
            dateFormat={dateFormat || defaultDateFormat}
            timeFormat={timeFormat || defaultTimeFormat}
            defaultValue={moment().format(`${defaultDateFormat} ${defaultTimeFormat}`)}
            {...rest}
            inputProps={{ placeholder: placeholder }}
        />
    );
};

export default MokaDateTimePicker;
