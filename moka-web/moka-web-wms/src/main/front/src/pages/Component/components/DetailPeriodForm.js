import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { MokaInputLabel, MokaDateTimePicker } from '@components';

const DetailPeriodForm = (props) => {
    const { periodYn, periodStartDt, periodEndDt, setPeriodYn, setPeriodStartDt, setPeriodEndDt, available } = props;
    const [disabled, setDisabled] = useState(true);
    const [open, setOpen] = useState(false);
    const controls = `component-collapse-period-form`;

    const handleClickTitle = () => {
        if (available) {
            setOpen(!open);
        }
    };

    /**
     * 시작일 변경
     * @param {object} date moment object
     */
    const handleStartDt = (date) => {
        if (typeof date === 'object') {
            setPeriodStartDt(date);
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleEndDt = (date) => {
        if (typeof date === 'object') {
            setPeriodEndDt(date);
        }
    };

    useEffect(() => {
        if (periodYn === 'Y') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [periodYn]);

    useEffect(() => {
        setOpen(available);
    }, [available]);

    return (
        <Form className="collapsed-box">
            <Card.Title className={clsx('mb-2', { collapsed: !open, disabled: !available })} aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                <p className="mb-0 d-inline cursor-pointer" onClick={handleClickTitle}>
                    기간설정
                </p>
            </Card.Title>
            <Collapse in={open}>
                <div id={controls} className="mt-3">
                    <div className="d-flex justify-content-center">
                        <Col xs={11} className="p-0">
                            <Form.Row>
                                <Col xs={3} className="d-flex p-0 pr-3">
                                    <MokaInputLabel
                                        label="사용기간"
                                        as="switch"
                                        id="period-yn"
                                        className="mb-0 h-100"
                                        inputProps={{ checked: periodYn === 'Y' }}
                                        onChange={(e) => {
                                            if (!e.target.checked) {
                                                setPeriodYn('N');
                                            } else {
                                                setPeriodYn('Y');
                                            }
                                        }}
                                    />
                                </Col>
                                {/* 시작일 종료일 */}
                                <Col xs={9} className="d-flex align-items-center p-0">
                                    <MokaDateTimePicker className="flex-grow-0 mx-2" disabled={disabled} value={periodStartDt} onChange={handleStartDt} />
                                    ~
                                    <MokaDateTimePicker className="flex-grow-0 mx-2" disabled={disabled} value={periodEndDt} onChange={handleEndDt} />
                                </Col>
                            </Form.Row>
                        </Col>
                    </div>
                </div>
            </Collapse>
        </Form>
    );
};

export default DetailPeriodForm;
