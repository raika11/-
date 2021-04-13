import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaIcon, MokaInput, MokaInputLabel } from '@components';
import Button from 'react-bootstrap/Button';
import { initialState } from '@store/issue';
import produce from 'immer';
import commonUtil from '@utils/commonUtil';
import { useSelector } from 'react-redux';

const defaultProps = {
    keyword: initialState.pkg.packageKeywords.reporter.keyword,
};
const ReporterPackageKeywordForm = ({ keyword, onChange }) => {
    const allReporter = useSelector(({ reporter }) => reporter.allReporter);
    const [editKeyword, setEditKeyword] = useState(keyword);
    const [useSearchKeyword, setUseSearchKeyword] = useState([false]);
    const [options, setOptions] = useState([]);

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
        const useSearchKeywords = keyword.reporter.map((data) => {
            return !commonUtil.isEmpty(data.keyword) && data.keyword !== '';
        });

        setUseSearchKeyword(useSearchKeywords);
        setEditKeyword(keyword);
    }, [keyword]);

    useEffect(() => {
        if (allReporter) {
            setOptions([
                { label: '테스트', value: '1000' },
                { label: '테스트2', value: '2000' },
            ]);
            allReporter.map((reporter) => {
                const label = `${reporter.repSeq}:${reporter.repName}`;
                const value = reporter.repSeq;

                return { label, value };
            });
        }
    }, [allReporter]);

    return (
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
            {editKeyword.reporter.map((reporter, idx) => (
                <Form.Row className="mb-3" key={idx}>
                    <Col xs={3} className="p-0 d-flex">
                        <div style={{ width: 30 }} className="d-flex flex-column justify-content-center align-items-center">
                            <p className="mb-0">{idx + 1}</p>
                            <Button variant="white" className="px-05">
                                <MokaIcon iconName="fal-trash-alt" />
                            </Button>
                        </div>
                        <div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="검색 기간" />
                            </div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="기자명" />
                            </div>
                            <MokaInputLabel
                                as="switch"
                                id={`package-reporterSearch-switch${idx + 1}`}
                                name="reporterSearch"
                                label="검색어(N개)"
                                inputProps={{ custom: true, checked: useSearchKeyword[idx] }}
                                onChange={(e) => {
                                    const { checked } = e.target;
                                    setUseSearchKeyword(
                                        produce(useSearchKeyword, (draft) => {
                                            draft[idx] = checked;
                                        }),
                                    );

                                    const editReporter = produce(reporter, (draft) => {
                                        draft['keyword'] = '';
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
                                    name="reporterStartDt"
                                    inputProps={{ timeFormat: null }}
                                    value={reporter.reporterStartDt}
                                    required
                                />
                            </div>
                            <div style={{ width: 80 }} className="pr-1">
                                <MokaInput as="checkbox" inputProps={{ label: '종료', custom: true, checked: false }} />
                            </div>
                            <div style={{ width: 150 }}>
                                <MokaInput as="dateTimePicker" value={reporter.reporterEndDt} inputProps={{ timeFormat: null }} />
                            </div>
                        </div>
                        <MokaInput as="autocomplete" name="reporterName" className="mb-3" value="2000" inputProps={{ options }} />
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
                            disabled={!useSearchKeyword[idx]}
                        />
                    </Col>
                </Form.Row>
            ))}
        </>
    );
};

ReporterPackageKeywordForm.defaultProps = defaultProps;

export default ReporterPackageKeywordForm;
