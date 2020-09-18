import React from 'react';
import DateTime from 'react-datetime';
import InputElement from 'react-input-mask';
import PropTypes from 'prop-types';

import moment from 'moment';
moment.locale('ko');

const propTypes = {
    /**
     * placeholder
     */
    placeholder: PropTypes.string,
    /**
     * 기본값 (string)
     */
    defaultValue: PropTypes.string,
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
    const { placeholder, dateFormat, timeFormat, defaultValue, ...rest } = props;

    // 날짜시간 포맷
    const dateTimeFormat = (() => {
        if (dateFormat && timeFormat) {
            return `${dateFormat} ${timeFormat}`;
        } else if (timeFormat) {
            return timeFormat;
        } else {
            return dateFormat;
        }
    })();

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

    // input element 생성
    const renderInput = (props, openCalendar, closeCalendar) => {
        return (
            <InputElement
                {...props}
                mask={dateTimeFormat.replace(/y|m|d|h/gi, '9')}
                placeholder={placeholder}
            />
        );
    };

    return (
        <DateTime
            locale="ko"
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            defaultValue={defaultValue || moment().format(dateTimeFormat)}
            {...rest}
            renderDay={renderDay}
            renderInput={renderInput}
        />
    );
};

MokaDateTimePicker.propTypes = propTypes;
MokaDateTimePicker.defaultProps = defaultProps;

export default MokaDateTimePicker;
