import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { MokaInputLabel, MokaInput } from '@components';

const DetailPagingForm = (props) => {
    const { component, setComponent, available } = props;

    const [open, setOpen] = useState(false);
    const controls = `component-collapse-period-form`;

    const handleClickTitle = () => {
        if (available) {
            setOpen(!open);
        }
    };

    useEffect(() => {
        setOpen(available);
    }, [available]);

    return (
        <Form className="collapsed-box">
            <Card.Title className={clsx('mb-2', { collapsed: !open, disabled: !available })} aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                <p className="mb-0 d-inline cursor-pointer" onClick={handleClickTitle}>
                    목록설정
                </p>
            </Card.Title>
            <Collapse in={open} timeout={3000}>
                <div id={controls} className="mt-3">
                    <div className="d-flex justify-content-center">
                        <Col xs={11} className="p-0">
                            <Form.Row className="mb-2">
                                {/* 리스트 노출건수 */}
                                <Col xs={5} className="d-flex p-0 pr-3">
                                    <MokaInputLabel
                                        label="리스트노출건수"
                                        labelWidth={112}
                                        className="mb-0"
                                        type="number"
                                        value={component.perPageCount}
                                        onChange={(e) => setComponent({ ...component, perPageCount: e.target.value })}
                                    />
                                </Col>
                                {/* 페이징사용여부 */}
                                <Col xs={5} className="d-flex align-items-center p-0">
                                    <MokaInputLabel
                                        label="페이징사용여부"
                                        labelWidth={112}
                                        className="mb-0"
                                        id="paging-yn"
                                        as="switch"
                                        inputProps={{ checked: component.pagingYn === 'Y' }}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setComponent({ ...component, pagingYn: 'Y', pagingType: 'N' });
                                            } else {
                                                setComponent({ ...component, pagingYn: 'N' });
                                            }
                                        }}
                                    />
                                </Col>
                            </Form.Row>
                            {component.pagingYn === 'Y' && (
                                <Form.Row>
                                    {/* 이전 다음 */}
                                    <Col xs={4} className="d-flex p-0 pl-3 align-items-center">
                                        <MokaInput
                                            as="radio"
                                            id="paging-type-n"
                                            name="pagingType"
                                            value="N"
                                            inputProps={{ label: '이전/다음', custom: true, checked: component.pagingType === 'N' }}
                                            onChange={(e) => setComponent({ ...component, pagingType: e.target.value })}
                                        />
                                        <MokaInput
                                            as="radio"
                                            id="paging-type-m"
                                            name="pagingType"
                                            value="M"
                                            inputProps={{ label: '더보기', custom: true, checked: component.pagingType === 'M' }}
                                            onChange={(e) => setComponent({ ...component, pagingType: e.target.value })}
                                        />
                                    </Col>
                                    {/* 최대 페이지수 / 표출 페이지수 */}
                                    {component.pagingType === 'N' && (
                                        <>
                                            <Col xs={4} className="d-flex p-0 pr-2">
                                                <MokaInputLabel
                                                    className="mb-0"
                                                    label="최대 페이지수"
                                                    labelWidth={96}
                                                    type="number"
                                                    value={component.maxPageCount}
                                                    onChange={(e) => setComponent({ ...component, maxPageCount: e.target.value })}
                                                />
                                            </Col>
                                            <Col xs={4} className="d-flex p-0">
                                                <MokaInputLabel
                                                    className="mb-0"
                                                    label="표출 페이지수"
                                                    labelWidth={96}
                                                    type="number"
                                                    value={component.dispPageCount}
                                                    onChange={(e) => setComponent({ ...component, dispPageCount: e.target.value })}
                                                />
                                            </Col>
                                        </>
                                    )}
                                    {/* 호출 건수 (더보기 건수) */}
                                    {component.pagingType === 'M' && (
                                        <Col xs={4} className="d-flex p-0">
                                            <MokaInputLabel
                                                className="mb-0"
                                                label="호출 건수"
                                                labelWidth={80}
                                                type="number"
                                                value={component.moreCount}
                                                onChange={(e) => setComponent({ ...component, moreCount: e.target.value })}
                                            />
                                        </Col>
                                    )}
                                </Form.Row>
                            )}
                        </Col>
                    </div>
                </div>
            </Collapse>
        </Form>
    );
};

export default DetailPagingForm;
