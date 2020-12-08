import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { MokaInputLabel, MokaDateTimePicker } from '@components';

const DetailPeriodForm = (props) => {
    const { component, setComponent, available, error, setError } = props;
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
            setComponent({ ...component, periodStartDt: date });
            setError({ ...error, periodStartDt: false });
        } else if (date === '') {
            setComponent({ ...component, periodStartDt: null });
            setError({ ...error, periodStartDt: false });
        } else {
            setError({ ...error, periodStartDt: true });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleEndDt = (date) => {
        if (typeof date === 'object') {
            setComponent({ ...component, periodEndDt: date });
            setError({ ...error, periodEndDt: false });
        } else if (date === '') {
            setComponent({ ...component, periodEndDt: null });
            setError({ ...error, periodEndDt: false });
        } else {
            setError({ ...error, periodEndDt: true });
        }
    };

    useEffect(() => {
        if (component.periodYn === 'Y') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [component.periodYn]);

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
                                        inputProps={{ checked: component.periodYn === 'Y' }}
                                        onChange={(e) => {
                                            setComponent({ ...component, periodYn: e.target.checked ? 'Y' : 'N' });
                                        }}
                                    />
                                </Col>
                                {/* 시작일 종료일 */}
                                <Col xs={9} className="d-flex align-items-center p-0">
                                    <div style={{ width: 185 }} className="mr-2">
                                        <MokaDateTimePicker disabled={disabled} value={component.periodStartDt} onChange={handleStartDt} isInvalid={error.periodStartDt} />
                                    </div>
                                    ~
                                    <div style={{ width: 185 }} className="ml-2">
                                        <MokaDateTimePicker disabled={disabled} value={component.periodEndDt} onChange={handleEndDt} isInvalid={error.periodEndDt} />
                                    </div>
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
