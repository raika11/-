import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { MokaInputLabel } from '@components';

const DetailSchForm = (props) => {
    const { component, setComponent, available } = props;
    const controls = `component-collapse-sch-form`;
    const [open, setOpen] = useState(false);

    const handleClickTitle = () => {
        if (available) {
            setOpen(!open);
        }
    };

    useEffect(() => {
        setOpen(available);
    }, [available]);

    return (
        <Form className="collapsed-box">
            <Card.Title className={clsx('mb-2', { collapsed: !open, disabled: !available })} aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                <p className="mb-0 d-inline cursor-pointer" onClick={handleClickTitle}>
                    검색설정
                </p>
            </Card.Title>
            <Collapse in={open} timeout={3000}>
                <div id={controls} className="mt-3">
                    <div className="d-flex justify-content-center">
                        <Col xs={11} className="p-0">
                            <Form.Row className="mb-2">
                                <Col xs={2} className="d-flex p-0 pr-3">
                                    <MokaInputLabel label="검색조건" as="none" className="mb-0" />
                                </Col>
                                {/* 코드타입 */}
                                <Col xs={10} className="p-0">
                                    <MokaInputLabel
                                        label="분류"
                                        labelWidth={45}
                                        className="mb-0"
                                        as="autocomplete"
                                        value={component.schCodeId}
                                        onChange={(value) => setComponent({ ...component, schCodeId: value })}
                                        inputProps={{ options: [] }}
                                    />
                                </Col>
                            </Form.Row>
                        </Col>
                    </div>
                </div>
            </Collapse>
        </Form>
    );
};

export default DetailSchForm;
