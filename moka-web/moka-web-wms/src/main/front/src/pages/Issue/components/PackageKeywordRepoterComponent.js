import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaIcon, MokaInput, MokaInputLabel } from '@components';
import Button from 'react-bootstrap/Button';
import { initialState } from '@store/issue';
import produce from 'immer';
import commonUtil from '@utils/commonUtil';

const defaultProps = {
    keyword: initialState.pkg.packageKeywords.reporter.keyword,
    reporters: [],
};
const PackageKeywordReporterComponent = ({ keyword, onChange, reporters }) => {
    const [editKeyword, setEditKeyword] = useState(keyword);
    const [useEndDate, setUseEndDate] = useState(keyword.reporter.map((data) => !commonUtil.isEmpty(data.edate) && data.edate !== ''));

    const handleChangeArrayObjectValue = ({ target, subTarget, value }) => {
        const pkg = produce(editKeyword, (draft) => {
            draft[target][subTarget] = value;
        });

        setEditKeyword(pkg);
        if (onChange instanceof Function) {
            onChange(pkg);
        }
    };

    const handleClickDeleteReporter = (idx) => {
        const reporter = [...editKeyword.reporter].filter((data, index) => index !== idx);
        const pkg = { ...editKeyword, reporter };

        setEditKeyword(pkg);
        if (onChange instanceof Function) {
            onChange(pkg);
        }
    };

    useEffect(() => {
        const usedEdate = [];
        const reporter = keyword.reporter.map((data) => {
            let reporterName = '';
            if (reporters) {
                const reporterInfo = reporters.filter((reporter) => {
                    return reporter.repSeq === `${data.reporterId}`;
                })[0];
                reporterName = reporterInfo.repName;
            }
            usedEdate.push(!commonUtil.isEmpty(data.edate) && data.edate !== '');

            return { ...data, reporterName };
        });

        setUseEndDate(usedEdate);
        setEditKeyword({ ...keyword, reporter });
    }, [keyword, reporters]);

    return (
        <>
            {editKeyword.reporter.length > 0 && (
                <>
                    <Form.Row className="mb-3">
                        <Col xs={3} className="p-0 d-flex align-items-center">
                            <MokaInputLabel as="none" label="검색 범위" />
                        </Col>
                        <Col xs={9} className="p-0 d-flex align-items-center">
                            <p style={{ width: 130 }} className="mb-0 pr-3">
                                기자명(default)
                            </p>
                            <div style={{ width: 80 }} className="pr-3">
                                <MokaInput
                                    as="checkbox"
                                    name="title"
                                    id="package-title-checkbox-reporter"
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
                                    id="package-keyword-checkbox-reporter"
                                    inputProps={{ label: '태그', custom: true, checked: editKeyword.schCondi.keyword }}
                                    onChange={(e) => {
                                        const { name, checked } = e.target;
                                        handleChangeArrayObjectValue({ target: 'schCondi', subTarget: name, value: checked });
                                    }}
                                />
                            </div>
                        </Col>
                    </Form.Row>
                    {editKeyword.reporter.map((reporter, idx) => {
                        return (
                            <Form.Row className="mb-3" key={idx}>
                                <Col xs={3} className="p-0 d-flex">
                                    <div style={{ width: 30 }} className="d-flex flex-column justify-content-center align-items-center">
                                        <p className="mb-0">{idx + 1}</p>
                                        <Button variant="white" className="px-05">
                                            <MokaIcon
                                                iconName="fal-trash-alt"
                                                onClick={() => {
                                                    handleClickDeleteReporter(idx);
                                                }}
                                            />
                                        </Button>
                                    </div>
                                    <div>
                                        <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                            <MokaInputLabel as="none" label="검색 기간" />
                                        </div>
                                        <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                            <MokaInputLabel as="none" label="기자명" />
                                        </div>
                                        <div style={{ height: 31 }} className="d-flex align-items-center">
                                            <MokaInputLabel as="none" label="검색어(N개)" />
                                        </div>
                                        <MokaInput
                                            as="radio"
                                            id={`reporter-keyword-and-radio-${idx + 1}`}
                                            name={`reporter-keyword-andOr-${idx + 1}`}
                                            value="A"
                                            inputProps={{ label: 'AND', custom: true, checked: reporter.andOr === 'A' }}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                const name = 'andOr';

                                                const editReporter = produce(reporter, (draft) => {
                                                    draft[name] = value;
                                                });

                                                handleChangeArrayObjectValue({ target: 'reporter', subTarget: idx, value: editReporter });
                                            }}
                                        />
                                        <MokaInput
                                            as="radio"
                                            id={`reporter-keyword-or-radio-${idx + 1}`}
                                            name={`reporter-keyword-andOr-${idx + 1}`}
                                            value="O"
                                            inputProps={{ label: 'OR', custom: true, checked: reporter.andOr === 'O' }}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                const name = 'andOr';

                                                const editReporter = produce(reporter, (draft) => {
                                                    draft[name] = value;
                                                });

                                                handleChangeArrayObjectValue({ target: 'reporter', subTarget: idx, value: editReporter });
                                            }}
                                        />
                                    </div>
                                </Col>
                                <Col xs={9} className="p-0">
                                    <div className="mb-3 d-flex align-items-center">
                                        <div style={{ width: 228 }} className="pr-3 d-flex align-items-center">
                                            <MokaInputLabel
                                                as="dateTimePicker"
                                                label="시작"
                                                name="sdate"
                                                labelWidth={50}
                                                inputProps={{ timeFormat: null }}
                                                value={reporter.sdate}
                                                required
                                                onChange={(date) => {
                                                    const editReporter = produce(reporter, (draft) => {
                                                        draft['sdate'] = date;
                                                    });

                                                    handleChangeArrayObjectValue({ target: 'reporter', subTarget: idx, value: editReporter });
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: 80 }} className="pr-1">
                                            <MokaInput
                                                as="checkbox"
                                                id={`package-reporter-edate-${idx}`}
                                                inputProps={{ label: '종료', custom: true, checked: useEndDate[idx] }}
                                                onChange={(e) => {
                                                    const { checked } = e.target;
                                                    setUseEndDate(
                                                        produce(useEndDate, (draft) => {
                                                            draft[idx] = checked;
                                                        }),
                                                    );
                                                    if (!checked) {
                                                        const editReporter = produce(reporter, (draft) => {
                                                            draft['edate'] = null;
                                                        });

                                                        handleChangeArrayObjectValue({ target: 'reporter', subTarget: idx, value: editReporter });
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: 150 }}>
                                            <MokaInput
                                                as="dateTimePicker"
                                                className="right"
                                                value={reporter.edate}
                                                inputProps={{ timeFormat: null }}
                                                onChange={(date) => {
                                                    const editReporter = produce(reporter, (draft) => {
                                                        draft['edate'] = date;
                                                    });

                                                    handleChangeArrayObjectValue({ target: 'reporter', subTarget: idx, value: editReporter });
                                                }}
                                                disabled={!useEndDate[idx]}
                                            />
                                        </div>
                                    </div>
                                    <MokaInput name="reporterName" className="mb-3" value="2000" value={reporter.reporterName} disabled={true} />
                                    <MokaInput
                                        name="keyword"
                                        value={reporter.keyword}
                                        onChange={(e) => {
                                            const { name, value } = e.target;
                                            const editReporter = produce(reporter, (draft) => {
                                                draft[name] = value;
                                            });
                                            handleChangeArrayObjectValue({ target: 'reporter', subTarget: idx, value: editReporter });
                                        }}
                                    />
                                </Col>
                            </Form.Row>
                        );
                    })}
                </>
            )}
        </>
    );
};

PackageKeywordReporterComponent.defaultProps = defaultProps;
export default PackageKeywordReporterComponent;
