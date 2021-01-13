import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaModal, MokaInputLabel } from '@/components';

const FeedRegisterModal = (props) => {
    const { show, onHide, data } = props;

    const [usedYn, setUsedYn] = useState('Y');
    const [feedType, setFeedType] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (data) {
            setUsedYn(data.usedYn);
            setTitle(data.title);
            setContent(data.content);
        }
    }, [data]);

    return (
        <MokaModal
            width={500}
            size="md"
            show={show}
            onHide={onHide}
            title="관리자 피딩 등록"
            headerClassName="justify-content-start"
            buttons={[
                { text: data ? '수정' : '저장', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: onHide },
            ]}
            draggable
        >
            <h3 className="mb-3 color-primary">'Row Title'</h3>
            <Form>
                <MokaInputLabel
                    label="사용여부"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="switch"
                    name="usedYn"
                    inputProps={{ custom: true, checked: usedYn === 'Y' }}
                    value={usedYn}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setUsedYn('Y');
                        } else {
                            setUsedYn('N');
                        }
                    }}
                />
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label="피드타입"
                            labelClassName="d-flex justify-content-end"
                            as="select"
                            name="feedType"
                            value={feedType}
                            onChange={(e) => setFeedType(e.target.value)}
                        >
                            <option value="">단문</option>
                            <option value="I">이미지</option>
                            <option value="M">동영상</option>
                            <option value="A">기사</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <MokaInputLabel label="제목" labelClassName="d-flex justify-content-end" className="mb-2" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <MokaInputLabel
                    label="내용"
                    labelClassName="d-flex justify-content-end"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 3 }}
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </Form>
        </MokaModal>
    );
};

export default FeedRegisterModal;
