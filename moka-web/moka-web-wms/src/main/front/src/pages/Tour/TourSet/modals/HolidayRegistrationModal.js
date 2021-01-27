import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { DB_DATEFORMAT } from '@/constants';
import { MokaModal, MokaInputLabel } from '@/components';
import { saveTourDeny } from '@/store/tour';
import toast from '@/utils/toastUtil';

/**
 * 휴일 등록, 수정 모달
 */
const HolidayRegistrationModal = (props) => {
    const dispatch = useDispatch();
    const { show, onHide, data } = props;

    const [holidayName, setHolidayName] = useState('');
    const [holiday, setHoliday] = useState(moment().format(DB_DATEFORMAT));

    /**
     * 등록, 수정 버튼
     */
    const hadleSave = () => {
        let today = new Date();
        let saveObj = {
            ...data,
            denyTitle: holidayName,
            denyDate: moment(holiday).startOf('day').format(DB_DATEFORMAT),
            denyYear: today.getFullYear(),
            denyRepeatYn: 'Y',
        };
        dispatch(
            saveTourDeny({
                tourDeny: saveObj,
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        handleHide();
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 취소 버튼
     */
    const handleHide = () => {
        setHolidayName('');
        setHoliday(moment().format(DB_DATEFORMAT));
        onHide();
    };

    useEffect(() => {
        if (data && show) {
            setHolidayName(data.denyTitle);
            setHoliday(data.denyDate);
        }
    }, [data, show]);

    return (
        <MokaModal
            title={data ? '휴일 수정' : '휴일 등록'}
            size="md"
            width={400}
            show={show}
            onHide={handleHide}
            centered
            buttons={
                data
                    ? [
                          { text: '수정', variant: 'positive', onClick: hadleSave },
                          { text: '취소', variant: 'negative', onClick: handleHide },
                      ]
                    : [
                          { text: '등록', variant: 'positive', onClick: hadleSave },
                          { text: '취소', variant: 'negative', onClick: handleHide },
                      ]
            }
            draggable
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            label="휴일명"
                            labelClassName="mr-3"
                            className="mb-0"
                            name="holidayName"
                            value={holidayName}
                            onChange={(e) => setHolidayName(e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3">
                    <Col xs={10}>
                        <MokaInputLabel
                            label="날짜"
                            labelClassName="mr-3"
                            as="dateTimePicker"
                            value={holiday}
                            inputProps={{ timeFormat: null }}
                            className="mb-0"
                            name="holiday"
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setHoliday(date);
                                } else {
                                    setHoliday(null);
                                }
                            }}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </MokaModal>
    );
};

export default HolidayRegistrationModal;
