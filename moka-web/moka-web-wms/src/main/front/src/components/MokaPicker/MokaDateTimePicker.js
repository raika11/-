import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import DateTime from 'react-datetime';
import InputMask from 'react-input-mask';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { MokaIcon } from '@components';

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
     * value => Moment 객체!!!
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
    /**
     * input size
     */
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    /**
     * isInvalid 체크
     */
    isInvalid: PropTypes.bool,
    /**
     * DateTimePicker의 timeDefault 설정
     * start이면 00:00:00 으로 셋팅
     * end이면 59:59:99 으로 셋팅
     * default이면 현재 시간(기본값)
     * @default
     */
    timeDefault: PropTypes.oneOf(['start', 'end', 'default']),
};

const defaultProps = {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    disabled: false,
    timeDefault: 'default',
};

/**
 * DateTimePicker,
 * DatePicker,
 * TimePicker
 */
const MokaDateTimePicker = forwardRef((props, ref) => {
    const {
        width,
        placeholder,
        dateFormat,
        timeFormat,
        defaultValue,
        value,
        onChange,
        disabled,
        className,
        inputClassName,
        size,
        isInvalid,
        onMouseEnter,
        onMouseLeave,
        timeDefault,
        ...rest
    } = props;
    const dateTimeRef = useRef(null);
    const inputGroupRef = useRef(null);

    useImperativeHandle(ref, () => ({
        dateTimeRef: dateTimeRef.current,
        inputGroupRef: inputGroupRef.current,
    }));

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

    /**
     * time 기본값 설정
     * @param {*} date object | string
     */
    const handleChange = (date) => {
        if (typeof date === 'object') {
            if (timeDefault === 'start') {
                date.startOf('day');
            } else if (timeDefault === 'end') {
                date.endOf('day');
            }
        }
        onChange(date);
    };

    // input element 생성
    const renderInput = (props, openCalendar, closeCalendar) => {
        return (
            <InputGroup ref={inputGroupRef} style={{ width }} size={size} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <InputMask
                    onChange={props.onChange}
                    onKeyDown={props.onKeyDown}
                    value={props.value}
                    className={clsx(props.className, 'ft-12', inputClassName, { 'is-invalid': isInvalid })}
                    placeholder={placeholder || dateTimeFormat}
                    disabled={disabled}
                    mask={dateTimeFormat.replace(/y|m|d|h|s/gi, '9')}
                    alwaysShowMask={false}
                    maskChar={null}
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
            ref={dateTimeRef}
            className={clsx('flex-fill', className)}
            locale="ko"
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            value={value}
            onChange={handleChange}
            {...rest}
            renderDay={renderDay}
            renderInput={renderInput}
        />
    );
});

MokaDateTimePicker.propTypes = propTypes;
MokaDateTimePicker.defaultProps = defaultProps;

export default MokaDateTimePicker;
