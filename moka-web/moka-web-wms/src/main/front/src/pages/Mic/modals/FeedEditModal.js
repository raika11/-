import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaModal, MokaInputLabel } from '@/components';

/**
 * 시민 마이크 피드 편집 모달
 */
const FeedEditModal = (props) => {
    const { show, onHide, data } = props;

    const [usedYn, setUsedYn] = useState('');
    const [feedType, setFeedType] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleHide = () => {
        setUsedYn('N');
        setFeedType('');
        setTitle('');
        setContent('');
        onHide();
    };

    useEffect(() => {
        if (show && data) {
            setUsedYn(data.usedYn);
            setTitle(data.title);
            setContent(data.content);
        }
    }, [show, data]);

    return (
        <MokaModal
            width={500}
            size="md"
            show={show}
            onHide={handleHide}
            title={data ? '관리자 피딩 수정' : '관리자 피딩 등록'}
            buttons={[
                { text: data ? '수정' : '저장', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: handleHide },
            ]}
            draggable
        >
            <h3 className="mb-3 color-primary">'Row Title'</h3>
            <Form>
                <MokaInputLabel
                    label="사용여부"
                    className="mb-2"
                    id="mic-feed-usedYn"
                    as="switch"
                    name="usedYn"
                    inputProps={{ custom: true, checked: usedYn === 'Y' }}
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
                        <MokaInputLabel label="피드타입" as="select" name="feedType" value={feedType} onChange={(e) => setFeedType(e.target.value)}>
                            <option value="">단문</option>
                            <option value="I">이미지</option>
                            <option value="M">동영상</option>
                            <option value="A">기사</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <MokaInputLabel label="제목" className="mb-2" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <MokaInputLabel
                    label="내용"
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

export default FeedEditModal;
