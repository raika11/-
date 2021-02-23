import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { MokaInputLabel, MokaInput, MokaDateTimePicker } from '@components';

/**
 * 기간 설정
 */
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
        <div>
            <Card.Title className={clsx('mb-2 d-flex', { collapsed: !open, disabled: !available })} aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                <div className="d-flex align-items-center" onClick={handleClickTitle}>
                    <MokaInputLabel className="mb-0" as="none" label="기간설정" />
                </div>
                <MokaInput
                    as="switch"
                    id="period-yn"
                    inputProps={{ checked: component.periodYn === 'Y' }}
                    onChange={(e) => {
                        setComponent({ ...component, periodYn: e.target.checked ? 'Y' : 'N' });
                    }}
                    disabled={!available}
                />
            </Card.Title>
            <Collapse in={open}>
                <div id={controls} className="mt-3">
                    <Form.Row>
                        <Col xs={12} className="d-flex align-items-center p-0 pr-3">
                            {/* 시작일 종료일 */}
                            <div className="mr-2">
                                <MokaInputLabel
                                    as="dateTimePicker"
                                    label="사용기간"
                                    disabled={disabled}
                                    value={component.periodStartDt}
                                    onChange={handleStartDt}
                                    isInvalid={error.periodStartDt}
                                    className="mb-0"
                                    inputProps={{ width: 200 }}
                                />
                            </div>
                            ~
                            <div className="ml-2">
                                <MokaDateTimePicker
                                    disabled={disabled}
                                    value={component.periodEndDt}
                                    onChange={handleEndDt}
                                    isInvalid={error.periodEndDt}
                                    inputProps={{ width: 200 }}
                                />
                            </div>
                        </Col>
                    </Form.Row>
                </div>
            </Collapse>
        </div>
    );
};

export default DetailPeriodForm;
