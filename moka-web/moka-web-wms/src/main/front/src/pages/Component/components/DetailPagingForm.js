import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { MokaInputLabel, MokaInput } from '@components';

/**
 * 컴포넌트 > 리스트 노출건수, 페이징 사용여부, 이전다음/더보기 선택
 * @desc 이전/다음 => 최대 페이지수, 표출 페이지수,
 * @desc 더보기 => 호출 건수
 */
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
        <div>
            <Card.Title className={clsx('mb-2 d-flex', { collapsed: !open, disabled: !available })} aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                <div className="d-flex align-items-center" onClick={handleClickTitle}>
                    <MokaInputLabel className="mb-0" as="none" label="목록설정" />
                </div>
                <div style={{ width: 220 }} className="mr-40">
                    {/* 리스트 노출건수 */}
                    <MokaInputLabel
                        label="리스트 노출건수"
                        labelClassName="ml-0 font-weight-normal"
                        className="mb-0"
                        type="number"
                        value={component.perPageCount}
                        onChange={(e) => setComponent({ ...component, perPageCount: e.target.value })}
                        // 최초로 편집 데이터셋을 연결했거나, 자동 데이터셋인 컴포넌트를 제외하고 수정 불가!
                        disabled={!available || (component.prevDeskDataset && component.componentSeq && component.dataType !== 'AUTO')}
                    />
                </div>

                {/* 페이징 사용여부 */}
                <MokaInputLabel
                    label="페이징 사용여부"
                    labelClassName="ml-0 font-weight-normal"
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
                    disabled={!available}
                />
            </Card.Title>
            <Collapse in={open} timeout={3000}>
                <div id={controls} className="mt-2">
                    {component.pagingYn === 'Y' && (
                        <Form.Row>
                            {/* 이전 다음 */}
                            <div className="d-flex flex-shrink-0 mr-32">
                                <MokaInput
                                    className="mr-3"
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
                            </div>
                            {/* 최대 페이지수 / 표출 페이지수 */}
                            {component.pagingType === 'N' && (
                                <div className="d-flex">
                                    <MokaInputLabel
                                        className="mr-40"
                                        label="최대 페이지수"
                                        type="number"
                                        value={component.maxPageCount}
                                        onChange={(e) => setComponent({ ...component, maxPageCount: e.target.value })}
                                    />
                                    <MokaInputLabel
                                        className="mb-0"
                                        label="표출 페이지수"
                                        type="number"
                                        value={component.dispPageCount}
                                        onChange={(e) => setComponent({ ...component, dispPageCount: e.target.value })}
                                    />
                                </div>
                            )}
                            {/* 호출 건수 (더보기 건수) */}
                            {component.pagingType === 'M' && (
                                <div>
                                    <MokaInputLabel
                                        label="호출 건수"
                                        type="number"
                                        value={component.moreCount}
                                        onChange={(e) => setComponent({ ...component, moreCount: e.target.value })}
                                    />
                                </div>
                            )}
                        </Form.Row>
                    )}
                </div>
            </Collapse>
        </div>
    );
};

export default DetailPagingForm;
