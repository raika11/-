import React, { useState } from 'react';
import DateTime from 'react-datetime';
import InputElement from 'react-input-mask';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { MokaIcon } from '@components';

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
     * value
     */
    value: PropTypes.string,
    /**
     * value 변경
     */
    onChange: PropTypes.func,
    /**
     * 날짜포맷(moment)
     */
    dateFormat: PropTypes.string,
    /**
     * 시간포맷(moment)
     */
    timeFormat: PropTypes.string,
    /**
     * input disabled 속성
     */
    disabled: PropTypes.bool,
};

const defaultProps = {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    disabled: false,
};

/**
 * DateTimePicker,
 * DatePicker,
 * TimePicker
 */
const MokaDateTimePicker = (props) => {
    const { placeholder, dateFormat, timeFormat, defaultValue, value, onChange, disabled, ...rest } = props;
    const [calendarOpen, setCalendarOpen] = useState(false);

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

    const handleOpen = (op) => {
        console.log(op);
        setCalendarOpen(true);
    };

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
            <InputGroup>
                <InputElement
                    {...props}
                    onFocus={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    mask={dateTimeFormat.replace(/y|m|d|h/gi, '9')}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <InputGroup.Append>
                    <Button disabled={disabled} onClick={openCalendar}>
                        <MokaIcon iconName={dateFormat ? 'fal-calendar-alt' : timeFormat ? 'fal-clock' : 'fal-calendar-alt'} />
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        );
    };

    return (
        <DateTime
            locale="ko"
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            defaultValue={defaultValue || moment().format(dateTimeFormat)}
            value={value}
            onChange={onChange}
            onOpen={handleOpen}
            {...rest}
            renderDay={renderDay}
            renderInput={renderInput}
        />
    );
};

MokaDateTimePicker.propTypes = propTypes;
MokaDateTimePicker.defaultProps = defaultProps;

export default MokaDateTimePicker;
