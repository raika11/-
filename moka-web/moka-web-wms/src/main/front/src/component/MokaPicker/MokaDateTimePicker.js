import React from 'react';
import DateTime from 'react-datetime';
import PropTypes from 'prop-types';

import moment from 'moment';
moment.locale('ko');

const propTypes = {
    /**
     * placeholder
     */
    placeholder: PropTypes.string,
    /**
     * 날짜포맷(moment)
     */
    dateFormat: PropTypes.string,
    /**
     * 시간포맷(moment)
     */
    timeFormat: PropTypes.string
};

const defaultProps = {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm'
};

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
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            defaultValue={moment().format(`${dateFormat} ${timeFormat}`)}
            {...rest}
            renderDay={renderDay}
            inputProps={{ placeholder: placeholder }}
        />
    );
};

MokaDateTimePicker.propTypes = propTypes;
MokaDateTimePicker.defaultProps = defaultProps;

export default MokaDateTimePicker;
