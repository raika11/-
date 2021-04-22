import React from 'react';
import Form from 'react-bootstrap/Form';
import { MokaInputLabel, MokaModal } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 목록 > 히스토리(변경 내용) 모달
 */
const NewsLetterHistoryModal = ({ show, onHide }) => {
    return (
        <MokaModal
            size="md"
            width={600}
            height={800}
            show={show}
            onHide={onHide}
            bodyClassName="d-flex flex-column"
            title="변경 내용"
            buttons={[{ text: '확인', variant: 'positive', onClick: () => onHide() }]}
            draggable
        >
            <hr className="divider" />
            <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
                <MokaInputLabel as="none" className="mb-2" label="발송 방법" disabled />
                <MokaInputLabel as="none" className="mb-2" label="유형" disabled />
                <MokaInputLabel as="none" className="mb-2" label="발송 콘텐츠" disabled />
                <MokaInputLabel as="none" className="mb-2" label="뉴스레터 명" disabled />
                <MokaInputLabel as="none" className="mb-2" label="설명" disabled />
                <MokaInputLabel as="none" className="mb-2" label="일정" disabled />
                <MokaInputLabel as="none" className="mb-2" label="발송자 명" disabled />
                <MokaInputLabel as="none" className="mb-2" label="발송 시작일" disabled />
                <MokaInputLabel as="none" className="mb-2" label="상단 이미지" disabled />
                <MokaInputLabel as="none" className="mb-2" label="레이아웃" disabled />
                <MokaInputLabel as="none" label="제목" disabled />
            </Form>
        </MokaModal>
    );
};

export default NewsLetterHistoryModal;
