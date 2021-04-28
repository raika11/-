import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import { DB_DATEFORMAT, DESK_STATUS_WORK, DESK_STATUS_SAVE, DESK_STATUS_PUBLISH } from '@/constants';
import toast, { messageBox } from '@utils/toastUtil';
import { MokaOverlayTooltipButton, MokaIcon, MokaInput } from '@components';
import { postReserveIssueDesking, deleteReserveIssueDesking } from '@store/issue';

moment.locale('ko');

const propTypes = {
    /**
     * 예약 정보
     */
    reserveDt: PropTypes.string,
    /**
     * 패키지 아이디
     */
    pkgSeq: PropTypes.string,
    /**
     * compNo
     */
    compNo: PropTypes.number,
    /**
     * 예약 된 후 실행
     */
    onReserve: PropTypes.func,
    /**
     * 워크 상태
     */
    status: PropTypes.oneOf([DESK_STATUS_WORK, DESK_STATUS_SAVE, DESK_STATUS_PUBLISH]),
};

/**
 * 이슈 데스킹 예약
 */
const ReserveWork = ({ reserveDt: alreadyReservedDt, pkgSeq, compNo, onReserve, status }) => {
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
     * 취소
     */
    const handleClickCancle = () => {
        setOpenReserve(false);
        setReserveDt(originReDt || null);
        setError(false);
    };

    /**
     * 달력 오늘날짜 이후로 선택할 수 있게 처리한다
     */
    const isValidDate = (current) => current.isAfter(moment(thisTime).subtract(1, 'days'));

    /**
     * 예약 아이콘버튼 클릭
     */
    const handleClickBtn = () => (openReserve ? handleClickCancle() : setOpenReserve(true));

    /**
     * 전송
     */
    const handleClickSave = () => {
        if (!reserveDt) {
            setError(true);
            setErrorMessage('선택된 날짜가 없습니다');
            return;
        }

        if (status !== DESK_STATUS_SAVE && status) {
            messageBox.alert('임시저장한 데이터만 예약할 수 있습니다.');
            return;
        }

        if (!error) {
            let message = reservation === true ? '예약을 변경하시겠습니까?' : '예약하시겠습니까?';
            messageBox.confirm(message, () => {
                dispatch(
                    postReserveIssueDesking({
                        pkgSeq,
                        compNo,
                        reserveDt: moment(reserveDt).format(DB_DATEFORMAT),
                        callback: ({ header, body }) => {
                            if (!header.success) {
                                messageBox.alert(header.message);
                            } else {
                                toast.success(header.message);
                                setOpenReserve(false);
                            }
                            if (onReserve) onReserve({ header, body });
                        },
                    }),
                );
            });
        }
    };

    /**
     * 예약 삭제
     */
    const handleClickDelete = () => {
        messageBox.confirm(
            '예약을 삭제하시겠습니까?',
            () => {
                dispatch(
                    deleteReserveIssueDesking({
                        pkgSeq,
                        compNo,
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
        if (alreadyReservedDt) {
            let rd = moment(alreadyReservedDt, DB_DATEFORMAT);
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
    }, [alreadyReservedDt]);

    useEffect(() => {
        setOpenReserve(false);
    }, [pkgSeq]);

    return (
        <React.Fragment>
            <MokaOverlayTooltipButton tooltipText="예약" variant="white" className="work-btn mr-2 flex-shrink-0" onClick={handleClickBtn}>
                <MokaIcon iconName="fal-alarm-clock" className={clsx({ 'text-positive': reservation })} />
            </MokaOverlayTooltipButton>

            {openReserve && (
                <div className="d-flex align-items-center justify-content-between position-absolute bg-white" style={{ left: 26, zIndex: 2, width: 'calc(100% - 26px)' }}>
                    <div style={{ width: 162 }} className="mr-2">
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

ReserveWork.propTypes = propTypes;

export default ReserveWork;
