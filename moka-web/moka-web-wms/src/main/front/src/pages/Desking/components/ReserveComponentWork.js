import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaIcon, MokaOverlayTooltipButton } from '@components';

/**
 * 컴포넌트 워크 예약
 */
const ReserveComponentWork = ({ component }) => {
    // state
    // const [reserveState, setReserveState] = useState(false);
    const [reserveDt, setReserveDt] = useState(null);
    const [openReserve, setOpenReserve] = useState(false);

    /**
     * 날짜 변경
     */
    const handleDate = (date) => {
        if (typeof date === 'object') {
            setReserveDt(date);
        }
    };

    /**
     * 예약 아이콘버튼 클릭
     */
    const handleClickBtn = () => {
        openReserve ? handleClickCancle() : setOpenReserve(true);
    };

    /**
     * 저장
     */
    const handleClickSave = () => {};

    /**
     * 취소
     */
    const handleClickCancle = () => {
        setOpenReserve(false);
        setReserveDt(null);
    };

    useEffect(() => {
        setReserveDt(moment(component.reserveDt, DB_DATEFORMAT));
    }, [component]);

    return (
        <React.Fragment>
            <MokaOverlayTooltipButton tooltipText="예약" variant="white" className="px-1 py-0 mr-1 flex-shrink-0" onClick={handleClickBtn}>
                <MokaIcon iconName="fal-alarm-clock" />
            </MokaOverlayTooltipButton>

            {openReserve && (
                <div className="d-flex align-items-center justify-content-between position-absolute bg-white" style={{ left: 27, right: 0, zIndex: 1 }}>
                    <div style={{ width: 160 }}>
                        <MokaInput as="dateTimePicker" inputClassName="ft-12" size="sm" value={reserveDt} onChange={handleDate} />
                    </div>
                    <div className="d-flex align-items-center">
                        <Button variant="positive" className="mr-2" size="sm" onClick={handleClickSave}>
                            전송
                        </Button>
                        <Button variant="negative" size="sm" onClick={handleClickCancle}>
                            취소
                        </Button>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default ReserveComponentWork;
