import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaIcon, MokaOverlayTooltipButton } from '@components';
import { postReserveComponentWork, deleteReserveComponentWork } from '@store/desking';
import toast, { messageBox } from '@utils/toastUtil';

moment.locale('ko');

/**
 * 컴포넌트 워크 예약
 */
const ReserveComponentWork = ({ component, workStatus }) => {
    const dispatch = useDispatch();
    const [reservation, setReservation] = useState(false);
    const [originReDt, setOriginReDt] = useState(null);
    const [reserveDt, setReserveDt] = useState(null);
    const [openReserve, setOpenReserve] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const thisTime = new Date(); // 예약일시 지금보다 이후로 설정

    /**
     * 날짜 변경
     */
    const handleDate = (date) => {
        if (typeof date === 'object') {
            setReserveDt(date);
            if (date.isAfter(thisTime)) {
                setError(false);
            } else {
                setError(true);
                setErrorMessage('예약 일시는 현재 일시보다 커야합니다');
            }
        } else if (date === '') {
            setReserveDt(null);
        } else {
            setError(true);
            setErrorMessage('선택된 날짜가 없습니다');
        }
    };

    /**
     * 달력 오늘날짜 이후로 선택할 수 있게 처리한다
     */
    const isValidDate = (current) => current.isAfter(moment(thisTime).subtract(1, 'days'));

    /**
     * 예약 아이콘버튼 클릭
     */
    const handleClickBtn = () => {
        openReserve ? handleClickCancle() : setOpenReserve(true);
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        if (!reserveDt) {
            setError(true);
            setErrorMessage('선택된 날짜가 없습니다');
            return;
        }

        if (workStatus !== 'save' && workStatus) {
            messageBox.alert('임시저장한 데이터만 예약할 수 있습니다.');
            return;
        }

        if (!error) {
            let message = reservation === true ? '예약을 변경하시겠습니까?' : '예약하시겠습니까?';
            messageBox.confirm(message, () => {
                dispatch(
                    postReserveComponentWork({
                        componentWorkSeq: component.seq,
                        reserveDt: moment(reserveDt).format(DB_DATEFORMAT),
                        callback: ({ header }) => {
                            if (!header.success) {
                                messageBox.alert(header.message);
                            } else {
                                toast.success(header.message);
                                setOpenReserve(false);
                            }
                        },
                    }),
                );
            });
        }
    };

    /**
     * 취소
     */
    const handleClickCancle = () => {
        setOpenReserve(false);
        setReserveDt(originReDt || null);
    };

    /**
     * 예약 삭제
     */
    const handleClickDelete = () => {
        messageBox.confirm(
            '예약을 삭제하시겠습니까?',
            () => {
                dispatch(
                    deleteReserveComponentWork({
                        componentWorkSeq: component.seq,
                        callback: ({ header }) => {
                            if (header.success) {
                                toast.success(header.message);
                                setOpenReserve(false);
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            },
            () => {},
        );
    };

    useEffect(() => {
        if (component.reserveDt) {
            let rd = moment(component.reserveDt, DB_DATEFORMAT);
            setOriginReDt(rd);
            setReserveDt(rd);
            // 현재 시각보다 예약일이 크면 예약상태
            if (rd > moment()) {
                setReservation(true);
            }
        } else {
            setOriginReDt(null);
            setReserveDt(null);
            setReservation(false);
        }
    }, [component]);

    return (
        <React.Fragment>
            <MokaOverlayTooltipButton tooltipText="예약" variant="white" className="px-1 py-0 mr-1 flex-shrink-0" onClick={handleClickBtn}>
                <MokaIcon iconName="fal-alarm-clock" className={clsx({ 'text-positive': reservation })} />
            </MokaOverlayTooltipButton>

            {openReserve && (
                <div className="d-flex align-items-center justify-content-between position-absolute bg-white" style={{ left: 27, right: 0, zIndex: 1 }}>
                    <div style={{ width: 180 }}>
                        <MokaInput
                            as="dateTimePicker"
                            className="is-not-position-center"
                            size="sm"
                            value={reserveDt}
                            onChange={handleDate}
                            isInvalid={error}
                            invalidMessage={errorMessage}
                            inputProps={{ isValidDate: isValidDate }}
                        />
                    </div>
                    <div className="d-flex align-items-center">
                        <Button variant="positive" className="mr-1" size="sm" onClick={handleClickSave}>
                            전송
                        </Button>
                        <Button variant="negative" size="sm" onClick={handleClickCancle}>
                            취소
                        </Button>
                        {reservation && (
                            <Button variant="negative" size="sm" className="ml-1" onClick={handleClickDelete}>
                                삭제
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default ReserveComponentWork;
