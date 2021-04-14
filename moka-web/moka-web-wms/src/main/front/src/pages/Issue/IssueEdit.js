import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel, MokaIcon } from '@/components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { CAT_DIV, clearIssue, getIssue, getIssueList, initialState, saveIssue } from '@store/issue';
import DefaultPackageKeywordComponent from '@pages/Issue/components/DefaultPackageKeywordComponent';
import ReporterPackageKeywordForm from '@pages/Issue/components/RepoterPackageKeywordComponent';
import SectionPackageKeywordComponent from '@pages/Issue/components/SectionPackageKeywordComponent';
import useDebounce from '@hooks/useDebounce';

import IssueCommonEdit from '@pages/Issue/components/IssueCommonEdit';
import ReporterListModal from '@pages/Reporter/modals/ReporterListModal';

/**
 * 패키지 상세 정보
 */
const IssueEdit = ({ reporters }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [showReporterModal, setShowReporterModal] = useState(false);
    const { pkg, search } = useSelector(({ issue }) => issue, shallowEqual);

    const { pkgSeq } = useParams();
    const [edit, setEdit] = useState(initialState.pkg);

    const handleClickCancel = () => {
        history.push('/issue');
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
        if (pkgSeq) {
            dispatch(getIssue({ pkgSeq }));
        } else {
            dispatch(clearIssue());
        }
    }, [pkgSeq]);

    useEffect(() => {
        setEdit(pkg);
    }, [pkg]);

    useEffect(() => {
        console.log(edit);
    }, [edit]);

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
                {/* 공통 검색어 */}
                <Form.Row className="mb-3">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="isUsed"
                            id="package-keywordYn-switch"
                            label="검색어"
                            inputProps={{ custom: true, checked: edit.packageKeywords.search.isUsed }}
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                let togetherHandlers = [];
                                if (!checked) {
                                    togetherHandlers = [{ name: 'keyword', value: initialState.pkg.packageKeywords.search.keyword }];
                                }
                                handleChangeArrayObjectValue({
                                    target: 'packageKeywords',
                                    subTarget: 'search',
                                    name,
                                    value: checked,
                                    togetherHandlers,
                                });
                            }}
                        />
                    </Col>
                </Form.Row>
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
                                let togetherHandlers = [];
                                if (!checked) {
                                    togetherHandlers = [{ name: 'keyword', value: initialState.pkg.packageKeywords.reporter.keyword }];
                                }
                                handleChangeArrayObjectValue({ target: 'packageKeywords', subTarget: 'reporter', name, value: checked, togetherHandlers });
                            }}
                        />
                        <Button
                            variant="positive"
                            onClick={() => {
                                setShowReporterModal(true);
                            }}
                        >
                            추가
                        </Button>
                        <ReporterListModal
                            show={showReporterModal}
                            onHide={() => setShowReporterModal(false)}
                            onRowClicked={(data) => {
                                const { repSeq } = data;
                                const keyword = edit.packageKeywords.reporter.keyword;

                                const reporter = [...keyword.reporter];
                                reporter.push({
                                    ordNo: 1,
                                    reporterId: repSeq,
                                    keyword: '',
                                    sdate: null,
                                    edate: null,
                                    andOr: 'A',
                                });

                                handleChangeArrayObjectValue({
                                    target: 'packageKeywords',
                                    subTarget: 'reporter',
                                    name: 'keyword',
                                    value: { ...keyword, reporter },
                                    togetherHandlers: [{ name: 'isUsed', value: true }],
                                });
                            }}
                        />
                    </Col>
                </Form.Row>
                {edit.packageKeywords.reporter.isUsed && edit.packageKeywords.reporter.keyword.reporter.length > 0 && (
                    <ReporterPackageKeywordForm
                        keyword={{ ...edit.packageKeywords.reporter.keyword, catDiv: CAT_DIV.REPORTER }}
                        reporters={reporters}
                        onChange={(value) => {
                            handleChangeArrayObjectDebounceValue({ target: 'packageKeywords', subTarget: 'reporter', name: 'keyword', value });
                        }}
                    />
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
                                let togetherHandlers = [];
                                if (!checked) {
                                    togetherHandlers = [{ name: 'keyword', value: initialState.pkg.packageKeywords.section.keyword }];
                                }
                                handleChangeArrayObjectValue({ target: 'packageKeywords', subTarget: 'section', name, value: checked, togetherHandlers });
                            }}
                        />
                    </Col>
                </Form.Row>
                {edit.packageKeywords.section.isUsed && (
                    <SectionPackageKeywordComponent
                        keyword={{ ...edit.packageKeywords.section.keyword, catDiv: CAT_DIV.SECTION }}
                        target="section"
                        onChange={(value) => {
                            handleChangeArrayObjectDebounceValue({ target: 'packageKeywords', subTarget: 'section', name: 'keyword', value });
                        }}
                    />
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
                                let togetherHandlers = [];
                                if (!checked) {
                                    togetherHandlers = [{ name: 'keyword', value: initialState.pkg.packageKeywords.digitalSpecial.keyword }];
                                }
                                handleChangeArrayObjectValue({ target: 'packageKeywords', subTarget: 'digitalSpecial', name, value: checked, togetherHandlers });
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
                                let togetherHandlers = [];
                                if (!checked) {
                                    togetherHandlers = [{ name: 'keyword', value: initialState.pkg.packageKeywords.ovp.keyword }];
                                }
                                handleChangeArrayObjectValue({ target: 'packageKeywords', subTarget: 'ovp', name, value: checked, togetherHandlers });
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
