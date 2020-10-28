import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaSearchInput, MokaCard, MokaInput, MokaInputLabel } from '@components';
import MovePageListModal from './modals/MovePageListModal';
import { getPageType } from '@store/codeMgt';
import { initialState, changePage, savePage, hasRelationList, changeInvalidList, deletePage } from '@store/page';
import { notification, toastr } from '@utils/toastUtil';

const PageEdit = () => {
    const { pageSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { page, pageTypeRows, latestDomainId, invalidList } = useSelector((store) => ({
        page: store.page.page,
        pageTypeRows: store.codeMgt.pageTypeRows,
        latestDomainId: store.auth.latestDomainId,
        invalidList: store.page.invalidList,
    }));

    // state
    const [pageName, setPageName] = useState(initialState.pageName);
    const [pageServiceName, setPageServiceName] = useState(initialState.pageServiceName);
    const [pageDisplayName, setPageDisplayName] = useState(initialState.pageDisplayName);
    const [parent, setParent] = useState(initialState.parent);
    const [pageType, setPageType] = useState(initialState.pageType);
    const [pageUrl, setPageUrl] = useState(initialState.pageUrl);
    const [pageOrd, setPageOrd] = useState(initialState.pageOrd);
    const [urlParam, setUrlParam] = useState(initialState.urlParam);
    const [useYn, setUseYn] = useState(initialState.useYn);
    const [fileYn, setFileYn] = useState(initialState.fileYn);
    const [kwd, setKwd] = useState(initialState.kwd);
    const [description, setDescription] = useState(initialState.description);
    const [moveYn, setMoveYn] = useState(initialState.moveYn);
    const [moveUrl, setMoveUrl] = useState(initialState.moveUrl);
    const [btnDisabled, setBtnDisabled] = useState(true);

    // error
    const [pageNameError, setPageNameError] = useState(false);
    const [pageServiceNameError, setPageServiceNameError] = useState(false);
    const [pageDisplayNameError, setPageDisplayNameError] = useState(false);
    const [parentError, setParentError] = useState(false);
    const [pageTypeError, setPagTypeError] = useState(false);
    const [pageUrlError, setPagUrlError] = useState(false);
    const [pageOrdError, setPageOrdError] = useState(false);
    const [urlParamError, setUrlParamError] = useState(false);
    const [kwdError, setKwdError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [moveUrlError, setMoveUrlError] = useState(false);

    // modal state
    const [moveModalShow, setMoveModalShow] = useState(false);

    useEffect(() => {
        // 위치 그룹 데이터가 없을 경우 0번째 데이터 셋팅
        if (pageType === '' && pageTypeRows.length > 0) {
            setPageType(pageTypeRows[0].dtlCd);
        }
    }, [pageType, pageTypeRows]);

    useEffect(() => {
        // 코드 조회
        dispatch(getPageType());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (pageSeq) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [dispatch, pageSeq]);

    useEffect(() => {
        // 스토어에서 가져온 템플릿 데이터 셋팅
        setPageName(page.pageName);
        setPageServiceName(page.pageServiceName);
        setPageDisplayName(page.pageDisplayName);
        setPageType(page.pageType);
        setPageUrl(page.pageUrl);
        setPageOrd(page.pageOrd);
        setUrlParam(page.pageUrlParam);
        setUseYn(page.useYn);
        setFileYn(page.pageFileYn);
        setKwd(page.pageKwd);
        setDescription(page.pageDescription);
        setMoveYn(page.MoveYn);
        setMoveUrl(page.MoveUrl);
    }, [page]);

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'pageName') {
                    setPageNameError(true);
                }
                if (i.field === 'pageServiceName') {
                    setPageServiceNameError(true);
                }
                if (i.field === 'pageDisplayName') {
                    setPageDisplayNameError(true);
                }
                if (i.field === 'parent') {
                    setParentError(true);
                }
                if (i.field === 'pageType') {
                    setPagTypeError(true);
                }
                if (i.field === 'pageUrl') {
                    setPagUrlError(true);
                }
                if (i.field === 'pagOrd') {
                    setPageOrdError(true);
                }
                if (i.field === 'urlParam') {
                    setUrlParamError(true);
                }
                if (i.field === 'kwd') {
                    setKwdError(true);
                }
                if (i.field === 'description') {
                    setDescriptionError(true);
                }
                if (i.field === 'moveUrl') {
                    setMoveUrlError(true);
                }
            });
        }
    }, [invalidList]);

    /**
     * 각 항목별 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value, checked } = target;

        if (name === 'useYn') {
            setUseYn(checked ? 'Y' : 'N');
        } else if (name === 'pageName') {
            setPageName(value);
            const regex = /[^\s\t\n]+/;
            if (regex.test(value)) {
                setPageNameError(false);
            } else {
                setPageNameError(true);
            }
        } else if (name === 'pageServiceName') {
            setPageServiceName(value);
        } else if (name === 'pageType') {
            setPageType(value);
        } else if (name === 'pageDisplayName') {
            setPageDisplayName(value);
        } else if (name === 'pageOrd') {
            setPageOrd(value);
            const regex = /^[\d]+$/;
            if (regex.test(value)) {
                setPageOrdError(false);
            } else {
                setPageOrdError(true);
            }
        } else if (name === 'moveYn') {
            setMoveYn(checked ? 'Y' : 'N');
        } else if (name === 'fileYn') {
            setFileYn(checked ? 'Y' : 'N');
        } else if (name === 'kwd') {
            setKwd(value);
        } else if (name === 'description') {
            setDescription(value);
        } else if (name === 'urlParam') {
            setUrlParam(value);
        }
    };

    /**
     * 유효성 검사
     * @param {object} page 페이지데이터
     */
    const validate = (page) => {
        let isInvalid = false;
        let errList = [];
        const bRoot = !(page.parent && page.parent.pageSeq);

        // 페이지명 체크
        if (!/[^\s\t\n]+/.test(page.pageName)) {
            errList.push({
                field: 'pageName',
                reason: '페이지명을 입력하세요',
            });
            isInvalid = isInvalid | true;
        }

        // 서비스명 입력체크
        if (!bRoot && !/[^\s\t\n]+/.test(page.pageServiceName)) {
            errList.push({
                field: 'pageServiceName',
                reason: '서비스명을 입력하세요.',
            });
            isInvalid = isInvalid | true;
        }

        // 서비스명 문자체크
        if (!bRoot && !/[a-zA-Z_-]*$/.test(page.pageServiceName)) {
            errList.push({
                field: 'pageServiceName',
                reason: '서비스명에 가능한 문자는 [영문_-]입니다',
            });
            isInvalid = isInvalid | true;
        }

        // 서비스명 불가 문자체크
        if (!bRoot && page.pageServiceName === 'command') {
            errList.push({
                field: 'pageServiceName',
                reason: '등록할 수 없는 서비스명입니다',
            });
            isInvalid = isInvalid | true;
        }

        // 페이지순서 체크
        if (!/[^\s\t\n]+/.test(page.pageOrd)) {
            errList.push({
                field: 'pageOrd',
                reason: '페이지순서를 입력하세요',
            });
            isInvalid = isInvalid | true;
        }

        // 페이지순서 체크
        if (!/^[\d]+$/.test(page.pageOrd)) {
            errList.push({
                field: 'pageOrd',
                reason: '페이지순서를 숫자로 입력하세요',
            });
            isInvalid = isInvalid | true;
        }

        // 페이지순서 체크
        if (page.moveYn === 'Y' && !/[^\s\t\n]+/.test(page.moveUrl)) {
            errList.push({
                field: 'moveUrl',
                reason: '이동URL을 입력하세요',
            });
            isInvalid = isInvalid | true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 페이지 등록
     * @param {object} tmp 페이지
     */
    const submitPage = (tmp) => {
        dispatch(
            savePage({
                actions: [changePage(tmp)],
                callback: ({ header, body }) => {
                    if (header.success) {
                        notification('success', header.message);
                        history.push(`/page/${body.pageSeq}`);
                    } else {
                        notification('warning', header.message || '실패하였습니다');
                    }
                },
            }),
        );
    };

    /**
     * 저장 이벤트
     * @param {object} e 이벤트
     */
    const handleClickSave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let temp = {
            ...page,
            pageName,
            pageServiceName,
            pageDisplayName,
            pageType,
            pageUrl,
            pageOrd,
            urlParam,
            useYn,
            fileYn,
            kwd,
            description,
            moveYn,
            moveUrl,
        };

        if (validate(temp)) {
            if (!page.pageSeq || page.pageSeq === '') {
                // 새 페이지 저장 시에 도메인ID 셋팅
                temp.domain = { domainId: latestDomainId };
            }
            submitPage(temp);
        }
    };

    /**
     * 템플릿 삭제
     * @param {object} response response
     */
    const deleteCallback = (response) => {
        if (response.header.success) {
            dispatch(
                deletePage({
                    pageSeq: page.pageSeq,
                    callback: (response) => {
                        if (response.header.success) {
                            notification('success', response.header.message);
                            history.push('/page');
                        } else {
                            notification('warning', response.header.message);
                        }
                    },
                }),
            );
        } else {
            notification('warning', response.header.message);
        }
    };

    /**
     * 삭제 이벤트
     */
    const handleClickDelete = () => {
        toastr.confirm('정말 삭제하시겠습니까?', {
            onOk: () => {
                dispatch(
                    hasRelationList({
                        pageSeq: page.pageSeq,
                        callback: deleteCallback,
                    }),
                );
            },
            onCancle: () => {},
        });
    };

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title="사이트 정보">
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3">
                    <Button variant="dark" className="mr-05">
                        W3C
                    </Button>
                    <Button variant="dark" className="mr-05">
                        미리보기
                    </Button>
                    <Button variant="secondary" className="mr-05" onClick={handleClickSave}>
                        전송
                    </Button>
                    <Button variant="secondary" className="mr-05" disabled={btnDisabled} onClick={handleClickDelete}>
                        삭제
                    </Button>
                </Form.Group>
                {/* 사용여부 */}
                <MokaInputLabel as="switch" className="mb-2" label="사용여부" id="useYn" name="useYn" inputProps={{ checked: useYn === 'Y' }} onChange={handleChangeValue} />
                {/* 페이지 ID, URL */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="px-0">
                        <MokaInputLabel label="페이지 ID" className="mb-0" placeholder="ID" value={pageSeq || ''} inputProps={{ plaintext: true, readOnly: true }} />
                    </Col>
                    <Col xs={6} className="px-0">
                        <MokaInputLabel label="URL" labelWidth={47} className="mb-0" value={pageUrl || ''} inputProps={{ plaintext: true }} />
                    </Col>
                </Form.Row>
                {/* 페이지명 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="페이지명"
                        value={pageName}
                        name="pageName"
                        onChange={handleChangeValue}
                        className="mb-0 w-100"
                        placeholder="페이지명을 입력하세요"
                        isInvalid={pageNameError}
                        required
                    />
                </Form.Row>
                {/* 서비스명, 서비스타입 */}
                <Form.Row className="mb-2">
                    <Col xs={8} className="px-0">
                        <MokaInputLabel
                            label="서비스명"
                            value={pageServiceName}
                            name="pageServiceName"
                            onChange={handleChangeValue}
                            className="mb-0"
                            placeholder="서비스명을 입력하세요"
                            isInvalid={pageServiceNameError}
                        />
                    </Col>
                    <Col xs={4} className="px-0 pl-2">
                        {/* 페이지유형 */}
                        <MokaInput as="select" className="mb-0" value={pageType} onChange={handleChangeValue} name="pageType" isInvalid={pageTypeError}>
                            {pageTypeRows.map((cd) => (
                                <option key={cd.dtlCd} value={cd.dtlCd}>
                                    {cd.cdNm}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                </Form.Row>
                {/* 표출명, 순서 */}
                <Form.Row className="mb-2">
                    <Col xs={8} className="px-0">
                        <MokaInputLabel
                            label="표출명"
                            value={pageDisplayName}
                            name="pageDisplayName"
                            onChange={handleChangeValue}
                            className="mb-0"
                            placeholder="표출명을 입력하세요"
                            isInvalid={pageDisplayNameError}
                        />
                    </Col>
                    <Col xs={4} className="px-0">
                        <MokaInputLabel
                            label="순서"
                            labelWidth={43}
                            className="mb-0"
                            value={pageOrd}
                            name="pageOrd"
                            onChange={handleChangeValue}
                            required
                            isInvalid={pageOrdError}
                        />
                    </Col>
                </Form.Row>
                {/* 이동URL */}
                <Form.Row className="mb-2">
                    <Col xs={4} className="px-0">
                        <MokaInputLabel
                            as="switch"
                            className="mb-0 h-100"
                            id="moveYn"
                            name="moveYn"
                            label="이동URL"
                            isInvalid={moveUrlError}
                            inputProps={{ label: '', checked: moveYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={8} className="px-0">
                        <MokaSearchInput className="pl-2" onSearch={() => setMoveModalShow(true)} disabled />
                    </Col>
                </Form.Row>
                {/* 파일저장 */}
                <Form.Row className="mb-2">
                    <Col xs={4} className="px-0">
                        <MokaInputLabel
                            as="switch"
                            className="mb-0 h-100"
                            id="fileYn"
                            name="fileYn"
                            label="파일저장"
                            inputProps={{ label: '', checked: fileYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                {/* 키워드 */}
                <MokaInputLabel className="mb-2" label="키워드" value={kwd} name="kwd" onChange={handleChangeValue} placeholder="키워드를 입력하세요" isInvalid={kwdError} />
                {/* 설명 */}
                <MokaInputLabel
                    className="mb-2"
                    inputClassName="resize-none"
                    as="textarea"
                    label="설명"
                    value={description}
                    name="description"
                    onChange={handleChangeValue}
                    inputProps={{ rows: 10 }}
                    isInvalid={descriptionError}
                />
                {/* 경로 파라미터명 */}
                <MokaInputLabel
                    className="mb-2"
                    label={
                        <>
                            경로
                            <br />
                            파라미터명
                        </>
                    }
                    value={urlParam}
                    name="urlParam"
                    onChange={handleChangeValue}
                />
            </Form>

            <MovePageListModal show={moveModalShow} onHide={() => setMoveModalShow(false)} />
        </MokaCard>
    );
};

export default PageEdit;
