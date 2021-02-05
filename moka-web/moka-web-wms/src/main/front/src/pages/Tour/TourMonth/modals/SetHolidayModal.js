import React, { useState, useCallback } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInputLabel } from '@/components';
import { saveTourDeny } from '@/store/tour';
import { DB_DATEFORMAT } from '@/constants';
import toast from '@/utils/toastUtil';

const SetHolidayModal = (props) => {
    const { show, onHide, date, year, month } = props;
    const dispatch = useDispatch();
    const [holidayName, setHolidayName] = useState('');

    const handleHide = useCallback(() => {
        setHolidayName('');
        onHide();
    }, [onHide]);

    const handleClickConfirm = useCallback(() => {
        let today = new Date();
        let saveObj = {
            denyTitle: holidayName === '' ? '신청 마감' : holidayName,
            denyDate: moment(date).format(DB_DATEFORMAT),
            denyYear: today.getFullYear(),
            denyRepeatYn: 'N',
        };
        dispatch(
            saveTourDeny({
                tourDeny: saveObj,
                search: { year, month },
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success('휴일이 지정되었습니다.');
                        handleHide();
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    }, [date, dispatch, handleHide, holidayName, month, year]);

    return (
        <MokaModal
            size="md"
            width={600}
            title="휴일 지정"
            show={show}
            onHide={onHide}
            buttons={[
                { text: '확인', variant: 'positive', onClick: handleClickConfirm },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            centered
            draggable
        >
            <Form onSubmit={(e) => e.preventDefault()}>
                <MokaInputLabel label="휴일명" className="mb-2" value={holidayName} onChange={(e) => setHolidayName(e.target.value)} />
                <p className="color-secondary mb-0">※ 휴일명을 입력하시면 사용자 화면에서 입력하신 휴일명이 표기됩니다. (기본: 신청 마감)</p>
            </Form>
        </MokaModal>
    );
};

export default SetHolidayModal;
