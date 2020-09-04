import React, { useState } from 'react';
// import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Typography from '@material-ui/core/Typography';
import { WmsText, WmsDialogAlert, WmsPickersUtilsProvider } from '~/components';
import style from '~/assets/jss/pages/Desking/DeskingDialogStyle';

const useStyle = makeStyles(style);

/**
 * 데스킹 예약 다이얼로그
 * @param {boolean} props.open 오픈여부
 * @param {func} props.onClose 클로즈함수
 */
const ReservationDialog = (props) => {
    const { open, onClose } = props;
    const classes = useStyle();

    const [reservedYmdt, setReservedYmdt] = useState(undefined);

    /**
     * 예약일 변경
     * @param {object} date 선택한 날짜 데이터
     */
    const handleReservedYmdt = (date) => {
        setReservedYmdt(date);
    };

    return (
        <WmsDialogAlert
            type="alert"
            open={open}
            onClose={onClose}
            title="컴포넌트 예약설정"
            titleCloseButton
            buttons={[
                { name: '저장', color: 'primary', onClick: () => {} },
                { name: '취소', onClick: onClose }
            ]}
            overrideClassName={classes.reservedPaper}
        >
            <>
                <div className={classes.deskingName}>
                    <WmsText name="deskingId" value="DeskingId" />
                </div>
                <div className={classes.dateSelect}>
                    <WmsPickersUtilsProvider>
                        {/* 예약일 날짜 지정 */}
                        <KeyboardDatePicker
                            inputVariant="outlined"
                            className={classes.dateBox}
                            value={reservedYmdt}
                            format="YYYY-MM-DD"
                            keyboardIcon={<DateRangeIcon />}
                            onChange={handleReservedYmdt}
                            KeyboardButtonProps={{
                                'aria-label': 'change date'
                            }}
                            okLabel="설정"
                            cancelLabel="취소"
                        />

                        {/* 예약일 시간 지정 */}
                        <KeyboardTimePicker
                            inputVariant="outlined"
                            className={classes.timeBox}
                            value={reservedYmdt}
                            keyboardIcon={<ScheduleIcon />}
                            format="HH:mm"
                            ampm={false}
                            onChange={handleReservedYmdt}
                            KeyboardButtonProps={{
                                'aria-label': 'change time'
                            }}
                            okLabel="설정"
                            cancelLabel="취소"
                        />

                        <Typography variant="subtitle1" component="div" className={classes.textBox}>
                            이후
                        </Typography>
                    </WmsPickersUtilsProvider>
                </div>
            </>
        </WmsDialogAlert>
    );
};
export default ReservationDialog;
