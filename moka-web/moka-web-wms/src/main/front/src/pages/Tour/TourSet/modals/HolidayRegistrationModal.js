import React, { useState, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { DB_DATEFORMAT } from '@/constants';
import { MokaModal, MokaInputLabel } from '@/components';

/**
 * 휴일 등록, 수정 모달
 */
const HolidayRegistrationModal = forwardRef((props, ref) => {
    const { show, onHide } = props;

    const [holidayName, setHolidayName] = useState('');
    const [holiday, setHoliday] = useState(moment().format(DB_DATEFORMAT));

    useImperativeHandle(ref, () => ({}), []);

    return (
        <MokaModal
            title="휴일 등록"
            size="md"
            width={400}
            show={show}
            onHide={onHide}
            centered
            buttons={[
                { text: '등록', variant: 'primary' },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            draggable
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col xs={10}>
                        <MokaInputLabel
                            label="휴일명"
                            labelClassName="mr-3"
                            className="mb-0"
                            name="holidayName"
                            value={holidayName}
                            onChange={
                                (e) => setHolidayName(e.target.value)
                                // handleChangeValue
                            }
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
                                // handleChangeValue
                            }}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </MokaModal>
    );
});

export default HolidayRegistrationModal;
