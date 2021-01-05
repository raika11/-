import React from 'react';
import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import { MokaCard, MokaInput } from '@/components';

const MessageSettings = () => {
    return (
        <>
            <Helmet>
                <title>견학 메세지 설정</title>
                <meta name="description" content="견학 메세지 설정 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard
                width={772}
                titleClassName="mb-0"
                title="견학 메세지 설정"
                footer
                footerButtons={[
                    { text: '저장', variant: 'positive', className: 'mr-2' },
                    { text: '취소', variant: 'negative' },
                ]}
                footerClassName="justify-content-center"
            >
                <Form.Group className="d-flex align-items-start">
                    <Form.Label className="pt-1 mr-2 d-flex flex-column align-items-end" style={{ width: 66 }} htmlFor="none">
                        <p className="mb-0">견학 신청/안내</p>
                        <p className="mb-0">'신청 방법'</p>
                    </Form.Label>
                    <MokaInput
                        as="textarea"
                        className="mb-3 resize-none"
                        inputProps={{ rows: 3 }}
                        // name=""
                        // value={}
                        onChange={(e) => e.target.value}
                        // isInvalid={}
                    />
                </Form.Group>
                <Form.Group className="d-flex align-items-start">
                    <Form.Label className="pt-1 mr-2 d-flex flex-column align-items-end" style={{ width: 66 }} htmlFor="none">
                        <p className="mb-0">견학 신청/안내</p>
                        <p className="mb-0">'견학 신청'</p>
                    </Form.Label>
                    <MokaInput
                        as="textarea"
                        className="mb-3 resize-none"
                        inputProps={{ rows: 3 }}
                        // name=""
                        // value={}
                        onChange={(e) => e.target.value}
                        // isInvalid={}
                    />
                </Form.Group>
                <Form.Group className="d-flex align-items-start">
                    <Form.Label className="pt-1 mr-2 d-flex flex-column align-items-end" style={{ width: 66 }} htmlFor="none">
                        <p className="mb-0">견학 신청/안내</p>
                        <p className="mb-0">'견학 시 유의사항'</p>
                    </Form.Label>
                    <MokaInput
                        as="textarea"
                        className="mb-3 resize-none"
                        inputProps={{ rows: 3 }}
                        // name=""
                        // value={}
                        onChange={(e) => e.target.value}
                        // isInvalid={}
                    />
                </Form.Group>
                <Form.Group className="d-flex align-items-start">
                    <Form.Label className="pt-1 mr-2 d-flex flex-column align-items-end" style={{ width: 66 }} htmlFor="none">
                        <p className="mb-0">견학 신청/안내</p>
                        <p className="mb-0">'관람 및 주차 안내'</p>
                    </Form.Label>
                    <MokaInput
                        as="textarea"
                        className="mb-3 resize-none"
                        inputProps={{ rows: 3 }}
                        // name=""
                        // value={}
                        onChange={(e) => e.target.value}
                        // isInvalid={}
                    />
                </Form.Group>
                <Form.Group className="mb-0 d-flex align-items-start">
                    <Form.Label className="pt-1 mr-2 d-flex flex-column align-items-end" style={{ width: 66 }} htmlFor="none">
                        <p className="mb-0">질의응답</p>
                        <p className="mb-0">'자주 하는 질문'</p>
                    </Form.Label>
                    <MokaInput
                        as="textarea"
                        className="mb-3 resize-none"
                        inputProps={{ rows: 9 }}
                        // name=""
                        // value={}
                        onChange={(e) => e.target.value}
                        // isInvalid={}
                    />
                </Form.Group>
            </MokaCard>
        </>
    );
};

export default MessageSettings;
