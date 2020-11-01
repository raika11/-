import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaSearchInput, MokaCard, MokaInput, MokaInputLabel } from '@components';
import MovePageListModal from './modals/MovePageListModal';
import { getPageType } from '@store/codeMgt';
import { previewPage, w3cPage } from '@store/merge';
import { initialState, getPage, changePage, savePage, changeInvalidList } from '@store/page';
import { notification } from '@utils/toastUtil';
import { API_BASE_URL, W3C_URL } from '@/constants';

const PageEdit = ({ onDelete }) => {
    const { pageSeq: paramPageSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { page, pageBody, loading, pageTypeRows, latestDomainId, invalidList, PAGE_TYPE_HTML } = useSelector((store) => ({
        page: store.page.page,
        pageBody: store.page.pageBody,
        loading: store.loading['page/GET_PAGE'] || store.loading['page/POST_PAGE'] || store.loading['page/PUT_PAGE'] || store.loading['page/DELETE_PAGE'] || store.loading['merge/PREVIEW_PAGE'] || store.loading['merge/W3C_PAGE'],
        pageTypeRows: store.codeMgt.pageTypeRows,
        latestDomainId: store.auth.latestDomainId,
        invalidList: store.page.invalidList,
        PAGE_TYPE_HTML: store.app.PAGE_TYPE_HTML,
    }));

    // state
    const [pageName, setPageName] = useState(initialState.pageName);
    const [pageServiceName, setPageServiceName] = useState(initialState.pageServiceName);
    const [pageDisplayName, setPageDisplayName] = useState(initialState.pageDisplayName);
    const [parent, setParent] = useState(initialState.parent);
    const [pageType, setPageType] = useState(initialState.pageType || PAGE_TYPE_HTML);
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
    // const [parentError, setParentError] = useState(false);
    const [pageTypeError, setPagTypeError] = useState(false);
    // const [pageUrlError, setPagUrlError] = useState(false);
    const [pageOrdError, setPageOrdError] = useState(false);
    // const [urlParamError, setUrlParamError] = useState(false);
    // const [kwdError, setKwdError] = useState(false);
    // const [descriptionError, setDescriptionError] = useState(false);
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
        if (!pageTypeRows || pageTypeRows.length <= 0) {
            dispatch(getPageType());
        }

        // url로 다이렉트로 페이지 조회하는 경우
        if (paramPageSeq && paramPageSeq !== page.pageSeq) {
            const option = {
                pageSeq: paramPageSeq,
                callback: (result) => {
                    if (!result.header.success) {
                        history.push(`/page`);
                    }
                },
            };
            dispatch(getPage(option));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (paramPageSeq) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [dispatch, paramPageSeq]);

    useEffect(() => {
        // 스토어에서 가져온 페이지 데이터 셋팅
        setPageName(page.pageName);
        setPageServiceName(page.pageServiceName);
        setPageDisplayName(page.pageDisplayName);
        setParent(page.parent);
        setPageType(page.pageType || PAGE_TYPE_HTML);
        setPageUrl(page.pageUrl);
        setPageOrd(page.pageOrd);
        setUrlParam(page.urlParam);
        setUseYn(page.useYn);
        setFileYn(page.fileYn);
        setKwd(page.kwd);
        setDescription(page.description);
        setMoveYn(page.moveYn);
        setMoveUrl(page.MoveUrl);
    }, [PAGE_TYPE_HTML, page]);

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
                // if (i.field === 'parent') {
                //     setParentError(true);
                // }
                if (i.field === 'pageType') {
                    setPagTypeError(true);
                }
                // if (i.field === 'pageUrl') {
                //     setPagUrlError(true);
                // }
                if (i.field === 'pagOrd') {
                    setPageOrdError(true);
                }
                // if (i.field === 'urlParam') {
                //     setUrlParamError(true);
                // }
                // if (i.field === 'kwd') {
                //     setKwdError(true);
                // }
                // if (i.field === 'description') {
                //     setDescriptionError(true);
                // }
                if (i.field === 'moveUrl') {
                    setMoveUrlError(true);
                }
            });
        }
    }, [invalidList]);

    /**
     * 각 항목별 값 변경
     */
    const handleChangeValue = useCallback(
        ({ target }) => {
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
                const url = `${parent.pageUrl === '/' ? '' : parent.pageUrl}/${value}`;
                setPageUrl(url);
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
        },
        [parent],
    );

    /**
     * 유효성 검사
     * @param {object} page 페이지데이터
     */
    const validate = useCallback(
        (page) => {
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
        },
        [dispatch],
    );

    /**
     * 페이지 등록
     * @param {object} tmp 페이지
     */
    const submitPage = useCallback(
        (tmp) => {
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
        },
        [dispatch, history],
    );

    /**
     * 저장 이벤트
     * @param {object} e 이벤트
     */
    const handleClickSave = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();

            let temp = {
                ...page,
                pageName,
                pageServiceName,
                pageDisplayName,
                parent,
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
        },
        [
            description,
            fileYn,
            kwd,
            latestDomainId,
            moveUrl,
            moveYn,
            page,
            pageDisplayName,
            pageName,
            pageOrd,
            pageServiceName,
            pageType,
            pageUrl,
            parent,
            submitPage,
            urlParam,
            useYn,
            validate,
        ],
    );

    /**
     * 미리보기 팝업
     */
    const handleClickPreviewOpen = useCallback(() => {
        const option = {
            content: pageBody,
            callback: ({ header, body }) => {
                if (header.success) {
                    const item = produce(page, (draft) => {
                        draft.pageBody = pageBody;
                    });
                    popupPreview('/preview/page', item);
                } else {
                    notification('warning', header.message || '미리보기에 실패하였습니다');
                }
            },
        };
        dispatch(previewPage(option));
    }, [dispatch, page, pageBody]);

    /**
     * 미리보기 팝업띄움.
     */
    const popupPreview = (url, item) => {
        const targetUrl = `${API_BASE_URL}${url}`;

        // 폼 생성
        const f = document.createElement('form');
        f.setAttribute('method', 'post');
        f.setAttribute('action', targetUrl);
        f.setAttribute('target', '_blank');

        // eslint-disable-next-line no-restricted-syntax
        for (const propName in item) {
            if (typeof item[propName] === 'object') {
                const subObject = item[propName];
                // eslint-disable-next-line no-restricted-syntax
                for (const inPropName in subObject) {
                    if (Object.prototype.hasOwnProperty.call(subObject, inPropName)) {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = `${propName}.${inPropName}`;
                        input.value = item[propName][inPropName];
                        f.appendChild(input);
                    }
                }
            } else if (Object.prototype.hasOwnProperty.call(item, propName)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = propName;
                input.value = item[propName];
                f.appendChild(input);
            }
        }

        document.getElementsByTagName('body')[0].appendChild(f);
        f.submit();
        f.remove();
    };
    
    /**
     * HTML검사(W3C) 팝업 : syntax체크 -> 머지결과 -> HTML검사
     */
    const handleClickW3COpen = useCallback(() => {
        const tempPage = produce(page, (draft) => {
            draft.pageBody = pageBody;
        });

        const option = {
            content: pageBody,
            page: tempPage,
            callback: ({ header, body }) => {
                if (header.success) {
                    popupW3C(body);
                } else {
                    notification('warning', header.message || 'W3C검사에 실패했습니다');
                }
            },
        };
        dispatch(w3cPage(option));
    }, [dispatch, page, pageBody]);

    /**
     * W3C 팝업띄움.
     */
    const popupW3C = (body) => {
        const targetUrl = W3C_URL;
    
        // 폼 생성
        const f = document.createElement('form');
        f.setAttribute('method', 'post');
        f.setAttribute('action', targetUrl);
        f.setAttribute('target', '_blank');
        f.setAttribute('enctype', 'multipart/form-data');
    
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'fragment';
        input.value = body;
        f.appendChild(input);
        document.getElementsByTagName('body')[0].appendChild(f);
        f.submit();
        f.remove();
    };

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title="사이트 정보" loading={loading}>
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3 d-flex justify-content-between">
                    <div className="d-flex">
                        <Button variant="dark" className="mr-05" disabled={btnDisabled} onClick={handleClickW3COpen}>
                            W3C
                        </Button>
                        <Button variant="dark" className="mr-05" disabled={btnDisabled} onClick={handleClickPreviewOpen}>
                            미리보기
                        </Button>
                    </div>
                    <div className="d-flex">
                        <Button variant="primary" className="mr-05" onClick={handleClickSave}>
                            전송
                        </Button>
                        <Button variant="danger" disabled={btnDisabled} onClick={(e) => onDelete(page)}>
                            삭제
                        </Button>
                    </div>
                </Form.Group>
                {/* 사용여부 */}
                <MokaInputLabel as="switch" className="mb-2" label="사용여부" id="useYn" name="useYn" inputProps={{ checked: useYn === 'Y' }} onChange={handleChangeValue} />
                {/* 페이지 ID, URL */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="px-0">
                        <MokaInputLabel label="페이지 ID" className="mb-0" placeholder="ID" value={paramPageSeq || ''} inputProps={{ plaintext: true, readOnly: true }} />
                    </Col>
                    <Col xs={6} className="px-0">
                        <MokaInputLabel label="URL" labelWidth={47} className="mb-0" value={pageUrl || ''} inputProps={{ plaintext: true, readOnly: true }} />
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
                            inputProps={{ checked: moveYn === 'Y' }}
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
                            inputProps={{ checked: fileYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                {/* 키워드 */}
                <MokaInputLabel className="mb-2" label="키워드" value={kwd} name="kwd" onChange={handleChangeValue} placeholder="키워드를 입력하세요" />
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
