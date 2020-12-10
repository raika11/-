import React from 'react';
import clsx from 'clsx';
import { MokaCard, MokaInputLabel } from '@components';
import { Form, Col } from 'react-bootstrap';

const BulknEdit = () => {
    const tempOnchange = () => {};
    return (
        <>
            <MokaCard
                loading={null}
                title={`네이버 문구 ${true ? '정보' : '등록'}`}
                titleClassName="mb-0"
                width={725}
                className={clsx('p-0', { 'mr-gutter': true, 'mr-1': true })}
                bodyClassName="p-0 overflow-hidden"
            >
                <Form className="mb-gutter">
                    <Form.Row>
                        <Col xs={12}>
                            <MokaInputLabel label="타이틀" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col xs={12}>
                            <MokaInputLabel label="URL" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col xs={12}>
                            <MokaInputLabel label="타이틀" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col xs={12}>
                            <MokaInputLabel label="URL" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col xs={12}>
                            <MokaInputLabel label="타이틀" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col xs={12}>
                            <MokaInputLabel label="URL" onChange={(e) => tempOnchange(e)} labelWidth={87} />
                        </Col>
                    </Form.Row>
                </Form>
            </MokaCard>
        </>
    );
};

export default BulknEdit;
