import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel } from '@components';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { initialState } from '@store/issue';
import produce from 'immer';
import commonUtil from '@utils/commonUtil';
import { CodeListModal } from '@pages/commons';

const SectionPackageKeywordComponent = ({ keyword, onChange, target }) => {
    const [editKeyword, setEditKeyword] = useState(initialState.initialPkgKeyword);
    const [useEndDate, setUseEndDate] = useState(false);
    const [codeModalShow, setCodeModalShow] = useState(false);

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
        setEditKeyword(keyword);
        if (!commonUtil.isEmpty(keyword.edate)) {
            setUseEndDate(true);
        } else {
            setUseEndDate(false);
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
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <MokaInputLabel as="none" label="대상 섹션" />
                </div>
                <MokaInputLabel
                    as="switch"
                    id={`package-useSearchKeyword-switch-${target}`}
                    label="검색어(N개)"
                    name="andOr"
                    inputProps={{ custom: true, checked: editKeyword.andOr === 'A' }}
                    onChange={(e) => {
                        const { name } = e.target;
                        let value = 'A';
                        if (editKeyword.andOr === 'A') {
                            value = 'O';
                        }

                        handleChangeValue({ name, value });
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
                            className="right"
                            inputProps={{ timeFormat: null }}
                            value={keyword.edate}
                            disabled={!useEndDate}
                            onChange={(date) => {
                                handleChangeValue({ name: 'edate', value: date });
                            }}
                        />
                    </div>
                </div>
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <Button
                        variant="outline-neutral"
                        onClick={() => {
                            setCodeModalShow(true);
                        }}
                    >
                        섹션 선택
                    </Button>
                    <CodeListModal
                        max={4}
                        show={codeModalShow}
                        onHide={() => setCodeModalShow(false)}
                        value={`${editKeyword.repMaster}`}
                        selection="single"
                        onSave={(data) => {
                            let value = null;
                            if (!commonUtil.isEmpty(data)) {
                                value = data.masterCode;
                            }

                            handleChangeValue({ name: 'repMaster', value });
                        }}
                        selectable={['content']}
                    />
                </div>
                <MokaInput
                    name="keyword"
                    value={editKeyword.keyword}
                    onChange={(e) => {
                        handleChangeValue(e.target);
                    }}
                />
            </Col>
        </Form.Row>
    );
};

export default SectionPackageKeywordComponent;
