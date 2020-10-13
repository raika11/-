/**
 * <pre>
 *
 * 2020-10-08 thkim 최초생성
 * </pre>
 *
 * @since 2020-10-08 오후 2:00
 * @author thkim
 */
import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const DomainEdit = () => {
    const [domainId, setDomainId] = useState('');
    const [domainName, setDomainName] = useState('');
    const [domainUrl, setDomainUrl] = useState('');
    const [useYN, setUseYN] = useState('N');
    const [servicePlatform, setServicePlatform] = useState('P');
    const [lang, setLang] = useState('KR');
    const [apiPath, setApiPath] = useState('');
    const [apiHost, setApiHost] = useState('');
    const [description, setDescription] = useState('');

    const onChangeValue = ({ target }) => {
        const { name, value, checked, selectedOptions } = target;
        if (name === 'domainId') {
            setDomainId(value);
        } else if (name === 'servicePlatform') {
            setServicePlatform(value);
        } else if (name === 'lang') {
            setLang(value);
        } else if (name === 'domainName') {
            setDomainName(value);
        } else if (name === 'domainUrl') {
            setDomainUrl(value);
        } else if (name === 'description') {
            setDescription(value);
        } else if (name === 'api') {
            setApiHost(value);
        } else if (name === 'useYN') {
            const usedValue = checked ? 'Y' : 'N';
            setUseYN(usedValue);
        }
    };

    return (
        <div className="d-flex justify-content-center mb-20">
            <Form>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        <span className="required-text">*</span>도메인 ID
                    </Form.Label>
                    <Col md={3} className="px-0">
                        <Form.Control type="text" placeholder="ID" onChange={onChangeValue} value={domainId} name="domainId" />
                    </Col>
                    <Form.Label column md={6} className="px-0 pl-4">
                        숫자 4자리로 입력하세요
                    </Form.Label>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        <span className="required-text">*</span>도메인 명
                    </Form.Label>
                    <Col md={9} className="px-0">
                        <Form.Control type="text" placeholder="도메인 명을 입력하세요" onChange={onChangeValue} value={domainName} name="domainName" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        <span className="required-text">*</span>도메인 주소
                    </Form.Label>
                    <Col md={9} className="px-0">
                        <Form.Control type="text" placeholder="도메인 주소에서 http(s)://를 빼고 입력하세요" onChange={onChangeValue} value={domainUrl} name="domainUrl" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        <span className="required-text">*</span>사용여부
                    </Form.Label>
                    <Col md={10} className="px-0 my-auto">
                        <Form.Check type="switch" id="custom-switch1" label="" name="useYN" onChange={onChangeValue} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        <span className="required-text">*</span>플랫폼
                    </Form.Label>
                    <Col md={2} className="px-0">
                        <Form.Check type="radio" label="PC" value="P" name="servicePlatform" onChange={onChangeValue} />
                    </Col>
                    <Col md={2} className="px-0">
                        <Form.Check type="radio" label="Mobile" value="M" name="servicePlatform" onChange={onChangeValue} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        언어
                    </Form.Label>
                    <Col md={4} className="pl-0 ml-0 pr-0 pl-0">
                        <Form.Control as="select" custom>
                            <option>국문</option>
                            <option>영문</option>
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        API Host
                    </Form.Label>
                    <Col md={9} className="px-0">
                        <Form.Control type="text" onChange={onChangeValue} value={apiHost} name="api" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        API 경로
                    </Form.Label>
                    <Col md={9} className="pl-0 ml-0 pr-0 pl-0">
                        <Form.Control as="select" custom>
                            <option>demo.api</option>
                            <option>demo.api2</option>
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column md={3} className="px-0">
                        메모
                    </Form.Label>
                    <Col md={9} className="pl-0 ml-0 pr-0 pl-0">
                        <Form.Control as="textarea" rows="3" onChange={onChangeValue} value={description} name="description" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} style={{ textAlign: 'center' }}>
                    <Button variant="dark" className="mr-10 pr-20 pl-20">
                        저장
                    </Button>
                    <Button variant="secondary" className="mr-10 pr-20 pl-20">
                        취소
                    </Button>
                </Form.Group>
            </Form>
        </div>
    );
};

export default DomainEdit;
