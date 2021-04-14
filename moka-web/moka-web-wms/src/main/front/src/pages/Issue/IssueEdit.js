import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInputLabel } from '@/components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { CAT_DIV, clearIssue, existsIssueTitle, getIssue, getIssueList, initialState, saveIssue } from '@store/issue';
import DefaultPackageKeywordComponent from '@pages/Issue/components/DefaultPackageKeywordComponent';
import ReporterPackageKeywordForm from '@pages/Issue/components/RepoterPackageKeywordComponent';
import SectionPackageKeywordComponent from '@pages/Issue/components/SectionPackageKeywordComponent';
import useDebounce from '@hooks/useDebounce';

import IssueCommonEdit from '@pages/Issue/components/IssueCommonEdit';
import ReporterListModal from '@pages/Reporter/modals/ReporterListModal';
import toast, { messageBox } from '@utils/toastUtil';

/**
 * 패키지 상세 정보
 */
const IssueEdit = ({ reporters }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [showReporterModal, setShowReporterModal] = useState(false);
    const [isDuplicatedTitle, setIsDuplicatedTitle] = useState(false);
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

    const handleClickDuplicateCheck = () => {
        dispatch(
            existsIssueTitle({
                pkgTitle: edit.pkgTitle,
                callback: (response) => {
                    const { header, body } = response;
                    if (header.success) {
                        setIsDuplicatedTitle(body);
                        if (body) {
                            messageBox.alert('중복된 패키지명이 존재합니다.');
                        } else {
                            toast.success('패키지명 중복 검사를 완료하였습니다.');
                        }
                    }
                },
            }),
        );
    };

    const handleChangeDebounceValue = useDebounce(handleChangeValue, 500);
    const handleChangeArrayObjectDebounceValue = useDebounce(handleChangeArrayObjectValue, 500);
    const handleChangeEdit = useDebounce((value) => {
        setEdit(value);
    }, 500);

    const handleClickSave = () => {
        if (isDuplicatedTitle) {
            messageBox.alert('패키지명 중복 검사를 진행해주세요.');
        } else {
            dispatch(
                saveIssue({
                    pkg: edit,
                    callback: (response) => {
                        dispatch(getIssue({ pkgSeq }));
                        dispatch(getIssueList({ search }));
                    },
                }),
            );
        }
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
        if (pkg.pkgSeq) {
            setIsDuplicatedTitle(false);
        } else {
            setIsDuplicatedTitle(true);
        }
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
                <IssueCommonEdit
                    data={edit}
                    onChange={handleChangeEdit}
                    onDuplicateCheck={handleClickDuplicateCheck}
                    isDuplicatedTitle={isDuplicatedTitle}
                    setIsDuplicatedTitle={setIsDuplicatedTitle}
                />
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
