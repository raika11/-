import React, { forwardRef } from 'react';
import clsx from 'clsx';
import DateTime from 'react-datetime';
import InputMask from 'react-input-mask';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { MokaIcon } from '@components';

import moment from 'moment';
moment.locale('ko');

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * input의 ClassName
     */
    inputClassName: PropTypes.string,
    /**
     * width
     */
    width: PropTypes.number,
    /**
     * placeholder
     */
    placeholder: PropTypes.string,
    /**
     * 기본값 (string)
     */
    defaultValue: PropTypes.string,
    /**
     * value => Date 객체!!!
     */
    value: PropTypes.any,
    /**
     * value 변경
     */
    onChange: PropTypes.func,
    /**
     * 날짜포맷(moment)
     */
    dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    /**
     * 시간포맷(moment)
     */
    timeFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
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
const MokaDateTimePicker = forwardRef((props, ref) => {
    const { width, placeholder, dateFormat, timeFormat, defaultValue, value, onChange, disabled, className, inputClassName, ...rest } = props;

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
            <InputGroup style={{ width }}>
                <InputMask
                    {...props}
                    onFocus={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className={clsx(props.className, inputClassName)}
                    mask={dateTimeFormat.replace(/y|m|d|h/gi, '9')}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <InputGroup.Append>
                    <Button variant="searching" disabled={disabled} onClick={openCalendar}>
                        <MokaIcon iconName={dateFormat ? 'fal-calendar-alt' : timeFormat ? 'fal-clock' : 'fal-calendar-alt'} />
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        );
    };

    return (
        <DateTime
            ref={ref}
            className={clsx('flex-fill', className)}
            locale="ko"
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            value={value}
            onChange={onChange}
            {...rest}
            renderDay={renderDay}
            renderInput={renderInput}
        />
    );
});

MokaDateTimePicker.propTypes = propTypes;
MokaDateTimePicker.defaultProps = defaultProps;

export default MokaDateTimePicker;
