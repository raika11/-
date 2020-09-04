import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ScheduleIcon from '@material-ui/icons/Schedule';
import DateRangeIcon from '@material-ui/icons/DateRange';
import moment from 'moment';
import { KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import { DB_DATE_FORMAT } from '~/constants';
import { WmsSwitch, WmsPickersUtilsProvider } from '~/components';
import Core from './Core';

/**
 * 컴포넌트 기간설정
 * @param {object} classes classes
 */
const ComponentPeriodSet = ({ classes }) => {
    const { edit } = useSelector((store) => ({
        edit: store.componentStore.edit
    }));
    const [periodSwitchOn, setPeriodSwitchOn] = useState(false);
    const [periodYn, setPeriodYn] = useState('N');
    const [periodStartYmdt, setPeriodStartYmdt] = useState(undefined);
    const [periodEndYmdt, setPeriodEndYmdt] = useState(undefined);
    const [endMinYmdt, setEndMinYmdt] = useState(undefined);

    const handleStartYmdt = (date) => {
        setPeriodStartYmdt(date);
    };

    const handleEndYmdt = (date) => {
        setPeriodEndYmdt(date);
    };

    /**
     * 사용기간 토글
     */
    const onChangePeriodSwitchOn = () => {
        if (periodSwitchOn) {
            // 스위치 오프
            setPeriodSwitchOn(false);
            setPeriodYn('N');
        } else {
            // 스위치 온
            setPeriodSwitchOn(true);
            setPeriodYn('Y');
        }
    };

    useEffect(() => {
        setPeriodYn(edit.periodYn || 'N');
        if (edit.periodYn === 'Y') {
            setPeriodSwitchOn(true);
        } else {
            setPeriodSwitchOn(false);
        }
        if (edit.periodStartYmdt && edit.periodStartYmdt !== '') {
            setPeriodStartYmdt(moment(edit.periodStartYmdt, DB_DATE_FORMAT));
        } else {
            setPeriodStartYmdt(moment(new Date()));
        }
        if (edit.periodEndYmdt && edit.periodEndYmdt !== '') {
            setPeriodEndYmdt(moment(edit.periodEndYmdt, DB_DATE_FORMAT));
        } else {
            setPeriodEndYmdt(moment(new Date()));
        }
    }, [edit]);

    // 시작일이 변경될 때마다 종료일의 최소일을 시작일로 설정한다
    useEffect(() => {
        setEndMinYmdt(periodStartYmdt);
    }, [periodStartYmdt]);

    useEffect(() => {
        Core.prototype.push('save', { key: 'periodYn', value: periodYn });
        if (periodYn === 'Y') {
            Core.prototype.push('save', {
                key: 'periodStartYmdt',
                value: moment(periodStartYmdt).format(DB_DATE_FORMAT)
            });
            Core.prototype.push('save', {
                key: 'periodEndYmdt',
                value: moment(periodEndYmdt).format(DB_DATE_FORMAT)
            });
        } else {
            Core.prototype.push('save', {
                key: 'periodStartYmdt',
                value: undefined
            });
            Core.prototype.push('save', {
                key: 'periodEndYmdt',
                value: undefined
            });
        }
    }, [periodYn, periodStartYmdt, periodEndYmdt]);

    return (
        <WmsPickersUtilsProvider>
            <ExpansionPanel
                className={classes.expansionPanelRoot}
                square
                elevation={0}
                defaultExpanded
            >
                {/* Summary */}
                <ExpansionPanelSummary
                    className={classes.expansionPanelSummary}
                    expandIcon={<ExpandMoreIcon />}
                    IconButtonProps={{ disableRipple: true }}
                    aria-controls="component-period-content"
                    id="component-period-header"
                >
                    <Typography component="div" variant="subtitle2">
                        사용기간
                    </Typography>
                </ExpansionPanelSummary>

                {/* Details */}
                <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                    <div className={clsx(classes.inLine, classes.panelContents)}>
                        <WmsSwitch
                            overrideClassName={classes.mr8}
                            label="사용기간"
                            labelWidth="60"
                            checked={periodSwitchOn}
                            onChange={onChangePeriodSwitchOn}
                        />

                        {/* 시작일 */}
                        <div className={classes.mr8}>
                            <KeyboardDatePicker
                                inputVariant="outlined"
                                disabled={!periodSwitchOn}
                                className={clsx(classes.dateBox, classes.mr8)}
                                value={periodStartYmdt}
                                format="YYYY-MM-DD"
                                keyboardIcon={<DateRangeIcon />}
                                onChange={handleStartYmdt}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date'
                                }}
                                okLabel="설정"
                                cancelLabel="취소"
                            />
                            <KeyboardTimePicker
                                inputVariant="outlined"
                                disabled={!periodSwitchOn}
                                className={clsx(classes.dateBox, classes.timeBox)}
                                value={periodStartYmdt}
                                keyboardIcon={<ScheduleIcon />}
                                format="HH:mm"
                                ampm={false}
                                onChange={handleStartYmdt}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time'
                                }}
                                okLabel="설정"
                                cancelLabel="취소"
                            />
                        </div>

                        <Typography component="div">~</Typography>

                        {/* 종료일 */}
                        <div className={clsx(classes.mr8, classes.ml8)}>
                            <KeyboardDatePicker
                                inputVariant="outlined"
                                disabled={!periodSwitchOn}
                                className={clsx(classes.dateBox, classes.mr8)}
                                value={periodEndYmdt}
                                minDate={endMinYmdt}
                                minDateMessage="시작일보다 큰 날짜를 선택해주세요"
                                format="YYYY-MM-DD"
                                keyboardIcon={<DateRangeIcon />}
                                onChange={handleEndYmdt}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date'
                                }}
                                okLabel="설정"
                                cancelLabel="취소"
                            />
                            <KeyboardTimePicker
                                inputVariant="outlined"
                                disabled={!periodSwitchOn}
                                className={clsx(classes.dateBox, classes.timeBox)}
                                keyboardIcon={<ScheduleIcon />}
                                value={periodEndYmdt}
                                format="HH:mm"
                                ampm={false}
                                onChange={handleEndYmdt}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time'
                                }}
                                okLabel="설정"
                                cancelLabel="취소"
                            />
                        </div>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </WmsPickersUtilsProvider>
    );
};
export default ComponentPeriodSet;
