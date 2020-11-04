import React, { useState } from 'react';
import { MokaCard, MokaInputLabel } from '@components';
import { Col, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

const GroupEdit = (props) => {
    const [grpCd, setGrpCd] = useState('');
    const [grpName, setGrpName] = useState('');
    const [grpNameKor, setGrpNameKor] = useState('');

    const handleClickSave = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleClickDelete = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleChangeValue = ({ target }) => {
        const { name, value } = target;
        switch (name) {
            case 'grpCd':
                setGrpCd(value);
                break;
            case 'grpName':
                setGrpName(value);
                break;
            case 'grpNameKor':
                setGrpNameKor(value);
                break;
            default:
                break;
        }
    };

    return (
        <MokaCard title="그룹정보" width={1000}>
            <Form noValidate>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel label="그룹코드(G01, G02형식)" required labelWidth={160} name="grpCd" value={grpCd} onChange={handleChangeValue} />
                    </Col>
                    <Col xs={6}>* 한번입력하면 변경하실 수 없습니다. 신중히 입력하시기 바랍니다.</Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel label="그룹명" required labelWidth={160} name="grpName" value={grpName} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel label="그룹 한글명" required labelWidth={160} name="grpNameKor" value={grpNameKor} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel label="등록자" required labelWidth={160} disabled={true} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel label="등록일시" required labelWidth={160} disabled={true} />
                    </Col>
                </Form.Row>
                <Form.Group as={Row} className="d-flex pt-20 justify-content-center">
                    <Button variant="primary" className="float-left mr-10 pr-20 pl-20" onClick={handleClickSave}>
                        저장
                    </Button>
                    <Button className="float-left mr-0 pr-20 pl-20" variant="gray150" onClick={handleClickDelete}>
                        삭제
                    </Button>
                </Form.Group>
            </Form>
        </MokaCard>
    );
};

export default GroupEdit;
