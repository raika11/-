import React, { useState } from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { MokaInputLabel, MokaInput } from '@components';

const DetailPagingForm = (props) => {
    const {
        perPageCount,
        pagingYn,
        pagingType,
        maxPageCount,
        dispPageCount,
        moreCount,
        setPerPageCount,
        setPagingYn,
        setPagingType,
        setMaxPageCount,
        setDispPageCount,
        setMoreCount,
    } = props;
    const [open, setOpen] = useState(false);
    const controls = `component-collapse-period-form`;

    const handleClickTitle = () => {
        setOpen(!open);
    };

    return (
        <Form className="collapsed-box">
            <Card.Title
                className={clsx('mb-2', 'cursor-pointer', { collapsed: !open })}
                aria-controls={controls}
                aria-expanded={open}
                data-toggle="collapse"
                onClick={handleClickTitle}
            >
                목록설정
            </Card.Title>
            <Collapse in={open} timeout={3000}>
                <div id={controls}>
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
                                        value={perPageCount}
                                        onChange={(e) => {
                                            setPerPageCount(e.target.value);
                                        }}
                                    />
                                </Col>
                                {/* 페이징사용여부 */}
                                <Col xs={5} className="d-flex align-items-center p-0">
                                    <MokaInputLabel
                                        label="페이징사용여부"
                                        labelWidth={112}
                                        className="mb-0"
                                        as="switch"
                                        inputProps={{ id: 'pageingyn', checked: pagingYn === 'Y' }}
                                        onChange={(e) => {
                                            if (!e.target.checked) {
                                                setPagingYn('N');
                                            } else {
                                                setPagingYn('Y');
                                            }
                                        }}
                                    />
                                </Col>
                            </Form.Row>
                            {pagingYn === 'Y' && (
                                <Form.Row>
                                    {/* 이전 다음 */}
                                    <Col xs={4} className="d-flex p-0 pl-3 align-items-center">
                                        <MokaInput
                                            as="radio"
                                            name="pagingType"
                                            value="N"
                                            inputProps={{ label: '이전/다음', id: 'paging-type-n', custom: true, checked: pagingType === 'N' }}
                                            onChange={(e) => {
                                                setPagingType(e.target.value);
                                            }}
                                        />
                                        <MokaInput
                                            as="radio"
                                            name="pagingType"
                                            value="M"
                                            inputProps={{ label: '더보기', id: 'paging-type-m', custom: true, checked: pagingType === 'M' }}
                                            onChange={(e) => {
                                                setPagingType(e.target.value);
                                            }}
                                        />
                                    </Col>
                                    {/* 최대 페이지수 / 표출 페이지수 */}
                                    {pagingType === 'N' && (
                                        <>
                                            <Col xs={4} className="d-flex p-0 pr-2">
                                                <MokaInputLabel
                                                    className="mb-0"
                                                    label="최대 페이지수"
                                                    labelWidth={96}
                                                    type="number"
                                                    value={maxPageCount}
                                                    onChange={(e) => {
                                                        setMaxPageCount(e.target.value);
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={4} className="d-flex p-0">
                                                <MokaInputLabel
                                                    className="mb-0"
                                                    label="표출 페이지수"
                                                    labelWidth={96}
                                                    type="number"
                                                    value={dispPageCount}
                                                    onChange={(e) => {
                                                        setDispPageCount(e.target.value);
                                                    }}
                                                />
                                            </Col>
                                        </>
                                    )}
                                    {/* 호출 건수 (더보기 건수) */}
                                    {pagingType === 'M' && (
                                        <Col xs={4} className="d-flex p-0">
                                            <MokaInputLabel
                                                className="mb-0"
                                                label="호출 건수"
                                                labelWidth={80}
                                                type="number"
                                                value={moreCount}
                                                onChange={(e) => {
                                                    setMoreCount(e.target.value);
                                                }}
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
