import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { MokaInputLabel } from '@components';
import { getLang, getServiceType } from '@store/codeMgt';

const DetailSchForm = (props) => {
    const { schServiceType, schLang, schCodeId, setSchServiceType, setSchLang, setSchCodeId } = props;
    const dispatch = useDispatch();
    const controls = `component-collapse-sch-form`;
    const [open, setOpen] = useState(false);

    const { langRows, serviceTypeRows } = useSelector((store) => ({
        langRows: store.codeMgt.langRows,
        serviceTypeRows: store.codeMgt.serviceTypeRows,
    }));

    const handleClickTitle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        dispatch(getLang());
        dispatch(getServiceType());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form className="collapsed-box">
            <Card.Title
                className={clsx('mb-2', 'cursor-pointer', { collapsed: !open })}
                aria-controls={controls}
                aria-expanded={open}
                data-toggle="collapse"
                onClick={handleClickTitle}
            >
                검색설정
            </Card.Title>
            <Collapse in={open} timeout={3000}>
                <div id={controls}>
                    <div className="d-flex justify-content-center">
                        <Col xs={11} className="p-0">
                            <Form.Row className="mb-2">
                                <Col xs={2} className="d-flex p-0 pr-3">
                                    <MokaInputLabel label="검색조건" as="none" className="mb-0" />
                                </Col>
                                {/* 언어 */}
                                <Col xs={4} className="p-0">
                                    <MokaInputLabel
                                        label="언어"
                                        labelWidth={45}
                                        className="mb-0"
                                        as="select"
                                        value={schLang}
                                        onChange={(e) => {
                                            setSchLang(e.target.value);
                                        }}
                                    >
                                        <option value="all">전체</option>
                                        {langRows.map((cd) => (
                                            <option key={cd.dtlCd} value={cd.dtlCd}>
                                                {cd.cdNm}
                                            </option>
                                        ))}
                                    </MokaInputLabel>
                                </Col>
                                {/* 서비스타입 */}
                                <Col xs={6} className="p-0">
                                    <MokaInputLabel
                                        label="서비스타입"
                                        labelWidth={85}
                                        className="mb-0"
                                        as="select"
                                        value={schServiceType}
                                        onChange={(e) => {
                                            setSchServiceType(e.target.value);
                                        }}
                                    >
                                        <option value="all">전체</option>
                                        {serviceTypeRows.map((cd) => (
                                            <option key={cd.dtlCd} value={cd.dtlCd}>
                                                {cd.cdNm}
                                            </option>
                                        ))}
                                    </MokaInputLabel>
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col xs={2} className="d-flex p-0 pr-3">
                                    <MokaInputLabel label="" as="none" className="mb-0" />
                                </Col>
                                {/* 코드타입 */}
                                <Col xs={10} className="p-0">
                                    <MokaInputLabel
                                        label="분류"
                                        labelWidth={45}
                                        className="mb-0"
                                        as="autocomplete"
                                        value={schCodeId}
                                        onChange={setSchCodeId}
                                        inputProps={{ options: [] }}
                                    />
                                </Col>
                            </Form.Row>
                        </Col>
                    </div>
                </div>
            </Collapse>
        </Form>
    );
};

export default DetailSchForm;
