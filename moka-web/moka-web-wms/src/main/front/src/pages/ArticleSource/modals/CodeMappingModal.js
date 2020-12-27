import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaModal } from '@/components';
import AgGrid from '../components/CodeMappingAgGrid';
import Edit from '../components/CodeMappingEdit';

const CodeMappingModal = (props) => {
    const { show, onHide, data } = props;

    const [showEdit, setShowEdit] = useState(false);

    const handleClickAdd = (e) => {
        setShowEdit(true);
    };

    return (
        <MokaModal
            show={show}
            onHide={() => onHide()}
            size="xl"
            headerClassName="p-3 border border-top-0 border-left-0 border-right-0"
            bodyClassName="p-2"
            titleAs={
                <div className="w-100 d-flex align-items-center">
                    <p className="mb-0 mr-3 ft-12">매체 코드 : {data.sourceCode}</p>
                    <p className="mb-0 mr-3 ft-12">매체명 : {data.sourceName}</p>
                </div>
            }
            width={900}
            height={600}
            draggable
        >
            <Container fluid>
                <Row>
                    <Col xs={5}>
                        <AgGrid data={data} handleClickAdd={handleClickAdd} />
                    </Col>
                    <Col xs={7}>{showEdit && <Edit />}</Col>
                </Row>
            </Container>
        </MokaModal>
    );
};

export default CodeMappingModal;
