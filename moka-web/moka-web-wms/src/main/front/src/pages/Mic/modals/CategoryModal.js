import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaSearchInput } from '@/components';

const CategoryModal = (props) => {
    const { show, onHide } = props;
    const [search, setSearch] = useState('');

    return (
        <MokaModal
            title="카테고리 관리"
            show={show}
            onHide={onHide}
            size="md"
            headerClassName="justify-content-start"
            buttons={[
                { text: '수정', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            draggable
        >
            <Container className="p-0" fluid>
                <Row>
                    <Col xs={12} className="p-0" style={{ minWidth: 500 }}>
                        <div className="d-flex">
                            <MokaSearchInput placeholder="카테고리명을 입력하세요" className="mr-2 flex-fill" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button variant="positive">등록</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </MokaModal>
    );
};

export default CategoryModal;
