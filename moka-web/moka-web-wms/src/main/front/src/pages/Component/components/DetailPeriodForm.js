import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { MokaInput, MokaInputLabel, MokaInputGroup, MokaIcon, MokaDateTimePicker } from '@components';

const DetailPeriodForm = (props) => {
    const { periodYn, periodStartDt, periodEndDt, setPeriodYn, setPeriodStartDt, setPeriodEndDt } = props;
    const [disabled, setDisabled] = useState(true);
    const [open, setOpen] = useState(false);
    const controls = `component-collapse-period-form`;

    const handleClickTitle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        if (periodYn === 'Y') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [periodYn]);

    return (
        <Form className="collapsed-box">
            <Card.Title
                className={clsx('mb-2', 'cursor-pointer', { collapsed: !open })}
                aria-controls={controls}
                aria-expanded={open}
                data-toggle="collapse"
                onClick={handleClickTitle}
            >
                사용 기간
            </Card.Title>
            <Collapse in={open} timeout={3000}>
                <div id={controls}>
                    <div className="d-flex justify-content-center">
                        <Col xs={11} className="p-0">
                            <Form.Row>
                                <Col xs={3} className="d-flex p-0 pr-3">
                                    <MokaInputLabel
                                        label="사용기간"
                                        as="switch"
                                        className="mb-0 h-100"
                                        inputProps={{
                                            id: 'period-yn',
                                            checked: periodYn === 'Y',
                                        }}
                                        onChange={(e) => {
                                            if (!e.target.checked) {
                                                setPeriodYn('N');
                                            } else {
                                                setPeriodYn('Y');
                                            }
                                        }}
                                    />
                                </Col>
                                <Col xs={9} className="d-flex p-0">
                                    <MokaDateTimePicker
                                        className="flex-grow-0 mr-1"
                                        timeFormat={null}
                                        disabled={disabled}
                                        value={periodStartDt}
                                        onChange={(e) => {
                                            console.log(e);
                                        }}
                                    />
                                    <MokaDateTimePicker className="flex-grow-0 mr-1" dateFormat={null} disabled={disabled} value={periodStartDt} />
                                    ~
                                    <MokaDateTimePicker className="flex-grow-0 mr-1" disabled={disabled} timeFormat={null} value={periodEndDt} />
                                    <MokaDateTimePicker className="flex-grow-0 mr-1" disabled={disabled} dateFormat={null} value={periodEndDt} />
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
