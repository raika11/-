import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel } from '@components';
import Form from 'react-bootstrap/Form';
import commonUtil from '@utils/commonUtil';
import { initialState } from '@store/issue';
import produce from 'immer';

const defaultProps = { keyword: initialState.initialPkgKeyword };
const DefaultPackageKeywordComponent = ({ keyword, onChange, target }) => {
    const [editKeyword, setEditKeyword] = useState(initialState.initialPkgKeyword);
    const [useSearchKeyword, setUseSearchKeyword] = useState(false);
    const [useEndDate, setUseEndDate] = useState(false);

    const handleChangeValue = ({ name, value }) => {
        const pkg = { ...editKeyword, [name]: value };
        setEditKeyword(pkg);
        if (onChange instanceof Function) {
            onChange(pkg);
        }
    };

    const handleChangeArrayObjectValue = ({ target, subTarget, value }) => {
        const pkg = produce(editKeyword, (draft) => {
            draft[target][subTarget] = value;
        });

        setEditKeyword(pkg);
        if (onChange instanceof Function) {
            onChange(pkg);
        }
    };

    useEffect(() => {
        console.log('keyword', keyword);
        setEditKeyword(keyword);
        if (!commonUtil.isEmpty(keyword.edate)) {
            setUseEndDate(true);
        } else {
            setUseEndDate(false);
        }

        if (!commonUtil.isEmpty(keyword.keyword) && keyword.keyword !== '') {
            setUseSearchKeyword(true);
        } else {
            setUseSearchKeyword(false);
        }
    }, [keyword]);

    return (
        <Form.Row className="mb-3">
            <Col xs={3} className="p-0">
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <MokaInputLabel as="none" label="검색 범위" />
                </div>
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <MokaInputLabel as="none" label="검색 기간" />
                </div>
                <MokaInputLabel
                    as="switch"
                    id={`package-useSearchKeyword-switch-${target}`}
                    label="검색어(N개)"
                    name="kwSearch"
                    inputProps={{ custom: true, checked: useSearchKeyword }}
                    onChange={() => {
                        setUseSearchKeyword(!useSearchKeyword);
                        if (useSearchKeyword) {
                            handleChangeValue({ name: 'keyword', value: '' });
                        }
                    }}
                />
            </Col>
            <Col xs={9} className="p-0">
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <div style={{ width: 80 }} className="pr-3">
                        <MokaInput
                            as="checkbox"
                            name="title"
                            id={`package-title-checkbox-${target}`}
                            inputProps={{ label: '제목', custom: true, checked: editKeyword.schCondi.title }}
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                handleChangeArrayObjectValue({ target: 'schCondi', subTarget: name, value: checked });
                            }}
                        />
                    </div>
                    <div style={{ width: 80 }}>
                        <MokaInput
                            as="checkbox"
                            name="keyword"
                            id={`package-keyword-checkbox-${target}`}
                            inputProps={{ label: '태그', custom: true, checked: editKeyword.schCondi.keyword }}
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                handleChangeArrayObjectValue({ target: 'schCondi', subTarget: name, value: checked });
                            }}
                        />
                    </div>
                </div>
                <div className="mb-3 d-flex align-items-center">
                    <div style={{ width: 228 }} className="pr-3">
                        <MokaInputLabel
                            as="dateTimePicker"
                            label="시작"
                            name="sdate"
                            inputProps={{ timeFormat: null }}
                            value={editKeyword.sdate}
                            required
                            onChange={(date) => {
                                handleChangeValue({ name: 'sdate', value: date });
                            }}
                        />
                    </div>
                    <div style={{ width: 80 }} className="pr-1">
                        <MokaInput
                            as="checkbox"
                            id={`package-kwEndYn-checkbox-${target}`}
                            inputProps={{ label: '종료', custom: true, checked: useEndDate }}
                            onChange={() => {
                                setUseEndDate(!useEndDate);
                                if (useEndDate) {
                                    handleChangeValue({ name: 'edate', value: null });
                                }
                            }}
                        />
                    </div>
                    <div style={{ width: 150 }}>
                        <MokaInput
                            as="dateTimePicker"
                            name="edate"
                            inputProps={{ timeFormat: null }}
                            value={keyword.edate}
                            disabled={!useEndDate}
                            onChange={(date) => {
                                handleChangeValue({ name: 'edate', value: date });
                            }}
                        />
                    </div>
                </div>
                <MokaInput
                    name="keyword"
                    value={editKeyword.keyword}
                    onChange={(e) => {
                        handleChangeValue(e.target);
                    }}
                    disabled={!useSearchKeyword}
                />
            </Col>
        </Form.Row>
    );
};

DefaultPackageKeywordComponent.defaultProps = defaultProps;
export default DefaultPackageKeywordComponent;
