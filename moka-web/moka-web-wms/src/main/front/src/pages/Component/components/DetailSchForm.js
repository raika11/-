import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { MokaInputLabel } from '@components';
import { CodeAutocomplete } from '@pages/commons';

const DetailSchForm = (props) => {
    const { component, setComponent, available } = props;
    const controls = `component-collapse-sch-form`;
    const [open, setOpen] = useState(false);

    const handleClickTitle = () => {
        if (available) {
            setOpen(!open);
        }
    };

    const handleChangeValue = (value) => {
        setComponent({ ...component, schCodeId: value });
    };

    useEffect(() => {
        setOpen(available);
    }, [available]);

    return (
        <div>
            <Card.Title className={clsx('mb-2 d-flex', { collapsed: !open, disabled: !available })} aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                <div className="d-flex align-items-center" onClick={handleClickTitle}>
                    <MokaInputLabel as="none" className="mb-0" label="검색설정" />
                </div>
                <MokaInputLabel as="none" className="mb-0" labelClassName="font-weight-normal ft-13 ml-0" label="분류" />
            </Card.Title>
            <Collapse in={open} timeout={3000}>
                <Form.Row className="mb-2">
                    <Col xs={12} className="d-flex p-0 pr-3">
                        <MokaInputLabel label="검색조건" as="none" className="mb-0" />
                        {/* 코드타입 */}
                        <div style={{ width: 300 }}>
                            <CodeAutocomplete className="mb-0" value={component.schCodeId} onChange={handleChangeValue} maxMenuHeight={150} />
                        </div>
                    </Col>
                </Form.Row>
            </Collapse>
        </div>
    );
};

export default DetailSchForm;
