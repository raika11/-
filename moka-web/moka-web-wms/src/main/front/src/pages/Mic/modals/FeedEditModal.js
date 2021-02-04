import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaModal, MokaInputLabel } from '@/components';

/**
 * 시민 마이크 피드 편집 모달
 */
const FeedEditModal = (props) => {
    const { show, onHide, agenda, feed, onChange } = props;

    const handleHide = () => {
        onHide();
    };

    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'usedYn') {
            onChange({ key: name, value: checked ? 'Y' : 'N' });
        } else {
            onChange({ key: name, value });
        }
    };

    return (
        <MokaModal
            width={500}
            size="md"
            show={show}
            onHide={handleHide}
            title={`❛${agenda.agndKwd}❜ 관리자 피드 ${feed.answSeq ? '수정' : '등록'}`}
            buttons={[
                { text: '저장', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: handleHide },
            ]}
            centered
        >
            <h3 className="mb-3 color-primary">'Row Title'</h3>
            <Form>
                <MokaInputLabel
                    label="사용여부"
                    className="mb-2"
                    id="mic-feed-usedYn"
                    as="switch"
                    name="usedYn"
                    inputProps={{ custom: true, checked: feed.usedYn === 'Y' }}
                    onChange={handleChangeValue}
                />
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel label="피드타입" as="select" name="feedType" value={feed.feedType} onChange={handleChangeValue}>
                            <option value="">단문</option>
                            <option value="I">이미지</option>
                            <option value="M">동영상</option>
                            <option value="A">기사</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <MokaInputLabel label="제목" className="mb-2" name="title" value={feed.title} onChange={handleChangeValue} />
                <MokaInputLabel label="내용" as="textarea" inputClassName="resize-none" inputProps={{ rows: 3 }} name="content" value={feed.content} onChange={handleChangeValue} />
            </Form>
        </MokaModal>
    );
};

export default FeedEditModal;
