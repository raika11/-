import React from 'react';
import { MokaModal, MokaSearchInput, MokaInputLabel } from '@components';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * 자동 데이터셋 검색 모달
 * @param {boolean} props.show show
 * @param {func} props.onHide 닫기 함수
 */
const AutoDatasetListModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            title="자동 데이터셋 검색"
            buttons={[
                {
                    text: '등록',
                    variant: 'primary',
                    onClick: onHide,
                },
                {
                    text: '취소',
                    variant: 'gray150',
                    onClick: onHide,
                },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                {/* 검색 */}
                <Form.Group as={Row}>
                    <Col xs={4} className="px-0 my-auto pr-2">
                        <MokaInputLabel label="구분" as="select" labelWidth={33} className="mb-0">
                            <option>전체</option>
                        </MokaInputLabel>
                    </Col>
                    <Col xs={8} className="px-0 my-auto">
                        <MokaSearchInput />
                    </Col>
                </Form.Group>
            </Form>
            {/* 리스트 */}
            <div>AgGrid 영역</div>
        </MokaModal>
    );
};

export default AutoDatasetListModal;
