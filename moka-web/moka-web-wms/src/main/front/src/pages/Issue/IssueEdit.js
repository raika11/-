import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel, MokaIcon } from '@/components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getIssue, getIssueList, initialState, saveIssue } from '@store/issue';
import DefaultPackageKeywordComponent from '@pages/Issue/components/DefaultPackageKeywordComponent';
import ReporterPackageKeywordForm from '@pages/Issue/components/RepoterPackageKeywordComponent';
import SectionPackageKeywordComponent from '@pages/Issue/components/SectionPackageKeywordComponent';
import useDebounce from '@hooks/useDebounce';
import ServiceCodeSelector from '@pages/Issue/components/Desking/ServiceCodeSelector';
import { CAT_DIV } from '@store/issue/issueSaga';
import { messageBox } from '@utils/toastUtil';
import IssueCommonEdit from '@pages/Issue/components/IssueCommonEdit';

const options = [
    { value: 'test1', label: '대통령 사면론' },
    { value: 'test2', label: '이명박' },
    { value: 'test3', label: '박근혜' },
];

const rnOptions = [
    { value: 'test1', label: '김이나' },
    { value: 'test2', label: '박수진' },
    { value: 'test3', label: '최우영' },
];

/**
 * 패키지 상세 정보
 */
const IssueEdit = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { pkg, search } = useSelector(({ issue }) => issue, shallowEqual);

    const { pkgSeq } = useParams();
    const [edit, setEdit] = useState(initialState.pkg);

    const [reporterList, setReporterList] = useState([]);

    const handleClickCancel = () => {
        history.push('/package');
    };

    /**
     * input value
     */
    const handleChangeValue = ({ name, value }) => {
        setEdit({ ...edit, [name]: value });
    };

    const handleChangeArrayObjectValue = ({ target, subTarget, name, value, togetherHandlers }) => {
        setEdit(
            produce(edit, (draft) => {
                draft[target][subTarget][name] = value;

                if (togetherHandlers instanceof Array) {
                    togetherHandlers.forEach((handler) => {
                        draft[target][subTarget][handler.name] = handler.value;
                    });
                }
            }),
        );
    };

    const handleChangeDebounceValue = useDebounce(handleChangeValue, 500);
    const handleChangeArrayObjectDebounceValue = useDebounce(handleChangeArrayObjectValue, 500);
    const handleChangeEdit = useDebounce((value) => {
        setEdit(value);
    }, 500);

    /**
     * 기자 검색 조건 추가
     */
    const handleClickAddReporter = () => {
        setReporterList(
            produce(reporterList, (draft) => {
                draft.push({
                    reporterSearch: reporterList[0].reporterSearch,
                    reporterStartDt: reporterList[0].reporterStartDt,
                    reporterOptions: reporterList[0].reporterOptions,
                    reporterEndDt: reporterList[0].reporterEndDt,
                });
            }),
        );
    };

    const handleClickSave = () => {
        dispatch(
            saveIssue({
                pkg: edit,
                callback: (response) => {
                    dispatch(getIssue({ pkgSeq }));
                    dispatch(getIssueList({ search }));
                },
            }),
        );
        //console.log(edit);
    };

    useEffect(() => {
        dispatch(getIssue({ pkgSeq }));
    }, [pkgSeq]);

    useEffect(() => {
        setEdit(pkg);
    }, [pkg]);

    return (
        <MokaCard
            title={pkgSeq ? '패키지 수정' : '패키지 생성'}
            className="w-100"
            footerClassName="justify-content-center"
            footer
            footerButtons={[
                { text: '종료', variant: 'negative', className: 'mr-1' },
                { text: pkgSeq ? '수정' : '생성', variant: 'positive', className: 'mr-1', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickCancel },
            ]}
        >
            <p className="mb-2">* 표시는 필수 입력 정보입니다.</p>
            <Form>
                <IssueCommonEdit data={edit} onChange={handleChangeEdit} />
                {edit.packageKeywords.search.isUsed && (
                    <DefaultPackageKeywordComponent
                        keyword={{ ...edit.packageKeywords.search.keyword, catDiv: CAT_DIV.SEARCH_KEYWORD }}
                        target="search"
                        onChange={(value) => {
                            handleChangeArrayObjectDebounceValue({ target: 'packageKeywords', subTarget: 'search', name: 'keyword', value });
                        }}
                    />
                )}
                <Form.Row className="mb-3">
                    <Col xs={12} className="p-0 d-flex justify-content-between">
                        <MokaInputLabel
                            as="switch"
                            label="기자"
                            id="package-reporterYn-switch"
                            name="isUsed"
                            inputProps={{ custom: true, checked: edit.packageKeywords.reporter.isUsed }}
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                handleChangeArrayObjectValue({ target: 'packageKeywords', subTarget: 'reporter', name, value: checked });
                            }}
                        />
                        <Button variant="positive" onClick={handleClickAddReporter}>
                            추가
                        </Button>
                    </Col>
                </Form.Row>
                {edit.packageKeywords.reporter.isUsed && (
                    <ReporterPackageKeywordForm keyword={edit.packageKeywords.reporter.keyword} />
                    /*<>
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
                                        id="package-reporterTitle-checkbox"
                                        inputProps={{ label: '제목', custom: true, checked: edit.reporterOptions['title'] || false }}
                                        onChange={(e) => setEdit({ ...edit, reporterOptions: { ...edit.reporterOptions, title: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 80 }}>
                                    <MokaInput
                                        as="checkbox"
                                        id="package-reporterTag-checkbox"
                                        inputProps={{ label: '태그', custom: true, checked: edit.reporterOptions['tag'] }}
                                        onChange={(e) => setEdit({ ...edit, reporterOptions: { ...edit.reporterOptions, tag: e.target.checked } })}
                                    />
                                </div>
                            </Col>
                        </Form.Row>
                        {reporterList.map(({ reporterSearch, reporterStartDt, reporterOptions, reporterEndDt }, idx) => (
                            <Form.Row className="mb-3" key={idx}>
                                <Col xs={3} className="p-0 d-flex">
                                    <div style={{ width: 30 }} className="d-flex flex-column justify-content-center align-items-center">
                                        <p className="mb-0">{idx + 1}</p>
                                        <Button variant="white" className="px-05" onClick={handleClickDeleteReporter}>
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
                                            inputProps={{ custom: true, checked: reporterSearch === 'Y' }}
                                            onChange={(e) => handleReporterList(e, idx)}
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
                                                value={reporterStartDt}
                                                onChange={(date) => {
                                                    if (typeof date === 'object') {
                                                        produce(reporterList, (draft) => {
                                                            draft[idx].reporterStartDt = date;
                                                        });
                                                    } else if (date === '') {
                                                        produce(reporterList, (draft) => {
                                                            draft[idx].reporterStartDt = null;
                                                        });
                                                    }
                                                }}
                                                required
                                            />
                                        </div>
                                        <div style={{ width: 80 }} className="pr-1">
                                            <MokaInput
                                                as="checkbox"
                                                inputProps={{ label: '종료', custom: true, checked: reporterOptions['reporterEndYn'] || false }}
                                                onChange={(e) => {
                                                    produce(reporterList, (draft) => {
                                                        draft[idx].reporterOptions.reporterEndYn = e.target.checked;
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: 150 }}>
                                            <MokaInput
                                                as="dateTimePicker"
                                                value={reporterEndDt}
                                                inputProps={{ timeFormat: null }}
                                                onChange={(date) => {
                                                    if (typeof date === 'object') {
                                                        produce(reporterList, (draft) => {
                                                            draft[idx].reporterEndDt = date;
                                                        });
                                                    } else if (date === '') {
                                                        produce(reporterList, (draft) => {
                                                            draft[idx].reporterEndDt = null;
                                                        });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <MokaInput
                                        as="autocomplete"
                                        name="reporterName"
                                        className="mb-3"
                                        value={reporterName}
                                        inputProps={{ options: rnOptions, isMulti: false, maxMenuHeight: 150 }}
                                        onChange={(rn) => setReporterName(rn)}
                                    />
                                    <MokaInput
                                        as="autocomplete"
                                        name="keywords"
                                        value={keywordValue}
                                        inputProps={{ options: options, isMulti: true, maxMenuHeight: 150 }}
                                        onChange={(ct) => {
                                            let result = [];
                                            if (ct) {
                                                result = ct.map((ct) => ct.value);
                                            }
                                            setKeywordList(result);
                                        }}
                                    />
                                </Col>
                            </Form.Row>
                        ))}
                    </>*/
                )}
                {/* 섹션 */}
                <Form.Row className="mb-3">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            label="섹션"
                            id="package-sectionYn-switch"
                            name="isUsed"
                            inputProps={{ custom: true, checked: edit.packageKeywords.section.isUsed }}
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                handleChangeArrayObjectValue({ target: 'packageKeywords', subTarget: 'section', name, value: checked });
                            }}
                        />
                    </Col>
                </Form.Row>
                {edit.packageKeywords.section.isUsed && (
                    <SectionPackageKeywordComponent />
                    /*<Form.Row className="mb-3">
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
                                id="package-sectionSearch-switch"
                                name="sectionSearch"
                                label="검색어(N개)"
                                inputProps={{ custom: true, checked: edit.sectionSearch === 'Y' }}
                                onChange={handleChangeSwitch}
                            />
                        </Col>
                        <Col xs={9} className="p-0">
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <div style={{ width: 80 }} className="pr-3">
                                    <MokaInput
                                        as="checkbox"
                                        id="package-sectionTitle-checkbox"
                                        inputProps={{ label: '제목', custom: true, checked: edit.sectionOptions['title'] || false }}
                                        onChange={(e) => setEdit({ ...edit, sectionOptions: { ...edit.sectionOptions, title: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 80 }}>
                                    <MokaInput
                                        as="checkbox"
                                        id="package-sectionTag-checkbox"
                                        inputProps={{ label: '태그', custom: true, checked: edit.sectionOptions['tag'] }}
                                        onChange={(e) => setEdit({ ...edit, sectionOptions: { ...edit.sectionOptions, tag: e.target.checked } })}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 d-flex align-items-center">
                                <div style={{ width: 228 }} className="pr-3 d-flex align-items-center">
                                    <MokaInputLabel
                                        as="dateTimePicker"
                                        label="시작"
                                        name="sectionStartDt"
                                        inputProps={{ timeFormat: null }}
                                        value={edit.sectionStartDt}
                                        onChange={(date) => {
                                            if (typeof date === 'object') {
                                                setEdit({ ...edit, sectionStartDt: date });
                                            } else if (date === '') {
                                                setEdit({ ...edit, sectionStartDt: null });
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                <div style={{ width: 80 }} className="pr-1">
                                    <MokaInput
                                        as="checkbox"
                                        inputProps={{ label: '종료', custom: true, checked: edit.sectionOptions['sectionEndYn'] || false }}
                                        onChange={(e) => setEdit({ ...edit, sectionOptions: { ...edit.sectionOptions, sectionEndYn: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 150 }}>
                                    <MokaInput
                                        as="dateTimePicker"
                                        name="sectionEndDt"
                                        value={edit.sectionEndDt}
                                        inputProps={{ timeFormat: null }}
                                        onChange={(date) => {
                                            if (typeof date === 'object') {
                                                setEdit({ ...edit, sectionEndDt: date });
                                            } else if (date === '') {
                                                setEdit({ ...edit, sectionEndDt: null });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <Button variant="outline-neutral">섹션 선택</Button>
                            </div>
                            <MokaInput
                                as="autocomplete"
                                name="keywords"
                                value={sectionValue}
                                inputProps={{ options: options, isMulti: true, maxMenuHeight: 150 }}
                                onChange={(ct) => {
                                    let result = [];
                                    if (ct) {
                                        result = ct.map((ct) => ct.value);
                                    }
                                    setSectionkeywordList(result);
                                }}
                            />
                        </Col>
                    </Form.Row>*/
                )}
                {/* 디지털 스페셜 */}
                <Form.Row className="mb-3">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            label="디지털 스페셜"
                            id="package-specialYn-switch"
                            name="isUsed"
                            inputProps={{ custom: true, checked: edit.packageKeywords.digitalSpecial.isUsed }}
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                handleChangeArrayObjectValue({ target: 'packageKeywords', subTarget: 'digitalSpecial', name, value: checked });
                            }}
                        />
                    </Col>
                </Form.Row>
                {edit.packageKeywords.digitalSpecial.isUsed && (
                    <DefaultPackageKeywordComponent
                        keyword={{ ...edit.packageKeywords.digitalSpecial.keyword, catDiv: CAT_DIV.DIGITAL_SPECIAL }}
                        target="digitalSpecial"
                        onChange={(value) => {
                            handleChangeArrayObjectDebounceValue({ target: 'packageKeywords', subTarget: 'digitalSpecial', name: 'keyword', value });
                        }}
                    />
                )}
                {/* 영상 OVP */}
                <Form.Row className="mb-3">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            label="영상(OVP)"
                            id="package-ovpYn-switch"
                            name="isUsed"
                            inputProps={{ custom: true, checked: edit.packageKeywords.ovp.isUsed }}
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                handleChangeArrayObjectValue({ target: 'packageKeywords', subTarget: 'ovp', name, value: checked });
                            }}
                        />
                    </Col>
                </Form.Row>
                {edit.packageKeywords.ovp.isUsed && (
                    <DefaultPackageKeywordComponent
                        keyword={{ ...edit.packageKeywords.ovp.keyword, catDiv: CAT_DIV.OVP }}
                        target="ovp"
                        onChange={(value) => {
                            handleChangeArrayObjectDebounceValue({ target: 'packageKeywords', subTarget: 'ovp', name: 'keyword', value });
                        }}
                    />
                )}
            </Form>
        </MokaCard>
    );
};

export default React.memo(IssueEdit);
