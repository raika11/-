import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaSearchInput, MokaCard, MokaInputLabel } from '@components';
import { getPageType } from '@store/codeMgt';
import { previewPage, w3cPage } from '@store/merge';
import { initialState, getPage, changePage, savePage, changeInvalidList } from '@store/page';
import toast from '@utils/toastUtil';
import { API_BASE_URL, W3C_URL } from '@/constants';
import { PageListModal } from '@pages/Page/modals';

const PageEdit = ({ onDelete }) => {
    const { pageSeq: paramPageSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { page, pageBody, loading, pageTypeRows, latestDomainId, invalidList, PAGE_TYPE_HTML, EXCLUDE_PAGE_SERVICE_NAME_LIST } = useSelector(
        (store) => ({
            page: store.page.page,
            pageBody: store.page.pageBody,
            loading:
                store.loading['page/GET_PAGE'] ||
                store.loading['page/POST_PAGE'] ||
                store.loading['page/PUT_PAGE'] ||
                store.loading['page/DELETE_PAGE'] ||
                store.loading['merge/PREVIEW_PAGE'] ||
                store.loading['merge/W3C_PAGE'],
            pageTypeRows: store.codeMgt.pageTypeRows,
            latestDomainId: store.auth.latestDomainId,
            invalidList: store.page.invalidList,
            PAGE_TYPE_HTML: store.app.PAGE_TYPE_HTML,
            EXCLUDE_PAGE_SERVICE_NAME_LIST: store.app.EXCLUDE_PAGE_SERVICE_NAME_LIST,
        }),
        [shallowEqual],
    );

    // state
    const [temp, setTemp] = useState(initialState.page);
    const [error, setError] = useState({
        pageName: false,
        pageServiceName: false,
        pageDisplayName: false,
        pageType: false,
        pageOrd: false,
        moveUrl: false,
    });
    const [btnDisabled, setBtnDisabled] = useState(true);

    // modal state
    const [moveModalShow, setMoveModalShow] = useState(false);

    useEffect(() => {
        if (!pageTypeRows) dispatch(getPageType());

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
    }, [pageTypeRows]);

    useEffect(() => {
        if (paramPageSeq) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [dispatch, paramPageSeq]);

    useEffect(() => {
        setTemp({
            ...page,
            pageType: page.pageType || PAGE_TYPE_HTML,
        });
    }, [PAGE_TYPE_HTML, page]);

    useEffect(() => {
        // 위치 그룹 데이터가 없을 경우 0번째 데이터 셋팅
        if (temp.pageType === '' && pageTypeRows?.length > 0) {
            setTemp({ ...temp, pageType: pageTypeRows[0].dtlCd });
        }
    }, [temp, pageTypeRows]);

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            setError(
                invalidList.reduce(
                    (all, c) => ({
                        ...all,
                        [c.field]: true,
                    }),
                    {},
                ),
            );
        }
    }, [invalidList]);

    const makePageUrl = useCallback(
        (name, value) => {
            let url = '';
            if (name === 'pageServiceName') {
                url = `${temp.parent.pageUrl === '/' ? '' : temp.parent.pageUrl}/${value}`;
                if (/[^\s\t\n]+/.test(temp.urlParam)) {
                    url = `${url}/*`;
                }
            } else if (name === 'urlParam') {
                url = `${temp.parent.pageUrl === '/' ? '' : temp.parent.pageUrl}/${temp.pageServiceName}`;
                if (/[^\s\t\n]+/.test(value)) {
                    url = `${url}/*`;
                }
            } else {
                url = temp.pageUrl;
            }
            return url;
        },
        [temp],
    );

    /**
     * 각 항목별 값 변경
     */
    const handleChangeValue = useCallback(
        ({ target }) => {
            const { name, value, checked } = target;

            if (name === 'usedYn') {
                setTemp({ ...temp, usedYn: checked ? 'Y' : 'N' });
            } else if (name === 'pageName') {
                setTemp({ ...temp, pageName: value });
                if (/[^\s\t\n]+/.test(value)) {
                    setError({ ...error, pageName: false });
                }
            } else if (name === 'pageServiceName') {
                const url = makePageUrl(name, value);
                setTemp({
                    ...temp,
                    pageUrl: url,
                    pageServiceName: value,
                });
            } else if (name === 'pageType') {
                setTemp({ ...temp, pageType: value });
            } else if (name === 'pageDisplayName') {
                setTemp({ ...temp, pageDisplayName: value });
            } else if (name === 'pageOrd') {
                setTemp({ ...temp, pageOrd: value });

                if (/^[\d]+$/.test(value)) {
                    setError({ ...error, pageOrd: false });
                }
            } else if (name === 'moveYn') {
                setTemp({ ...temp, moveYn: checked ? 'Y' : 'N' });
            } else if (name === 'fileYn') {
                setTemp({ ...temp, fileYn: checked ? 'Y' : 'N' });
            } else if (name === 'kwd') {
                setTemp({ ...temp, kwd: value });
            } else if (name === 'description') {
                setTemp({ ...temp, description: value });
            } else if (name === 'urlParam') {
                const url = makePageUrl(name, value);
                setTemp({
                    ...temp,
                    pageUrl: url,
                    urlParam: value,
                });
            } else if (name === 'category') {
                setTemp({ ...temp, category: value });
            }
        },
        [error, makePageUrl, temp],
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
            if (!bRoot && !/[a-zA-Z0-9_-]*$/.test(page.pageServiceName)) {
                errList.push({
                    field: 'pageServiceName',
                    reason: '서비스명에 가능한 문자는 [영문,숫자,_,-]입니다',
                });
                isInvalid = isInvalid | true;
            }

            // 서비스명 불가 문자체크
            if (!bRoot && EXCLUDE_PAGE_SERVICE_NAME_LIST.includes(page.pageServiceName)) {
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

            // 경로파라미터 문자체크
            if (!bRoot && !/[a-zA-Z0-9_-]*$/.test(page.urlParam)) {
                errList.push({
                    field: 'urlParam',
                    reason: '경로파라미터명에 가능한 문자는 [영문,숫자,_,-]입니다',
                });
                isInvalid = isInvalid | true;
            }

            if (isInvalid) {
                console.error(errList);
            }

            dispatch(changeInvalidList(errList));
            return !isInvalid;
        },
        [EXCLUDE_PAGE_SERVICE_NAME_LIST, dispatch],
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
                            toast.success(header.message);
                            history.push(`/page/${body.pageSeq}`);
                        } else {
                            toast.fail(header.message);
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
    const handleClickSave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let saveObj = {
            ...page,
            ...temp,
        };

        if (validate(saveObj)) {
            if (!page.pageSeq || page.pageSeq === '') {
                // 새 페이지 저장 시에 도메인ID 셋팅
                saveObj.domain = { domainId: latestDomainId };
            }
            submitPage(saveObj);
        }
    };

    /**
     * 이동URL 팝업 저장 시
     * @param {object} data data
     */
    const handleClickMoveSave = (data) => {
        setTemp({ ...temp, moveUrl: data.pageUrl });
    };

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
                    toast.fail(header.message || '미리보기에 실패하였습니다');
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
                    toast.fail(header.message || 'W3C검사에 실패했습니다');
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

    /**
     * page url 클릭
     */
    const handleClickOpenService = (e) => {
        if (!loading && temp.pageUrl) {
            let url = `//${temp.domain.domainUrl}${temp.pageUrl}`;
            window.open(url);
        }
    };

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title={`페이지 ${page.pageSeq ? '정보' : '등록'}`} loading={loading}>
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3 d-flex justify-content-between">
                    <div className="d-flex">
                        <Button variant="outline-neutral" className="mr-05" disabled={btnDisabled} onClick={handleClickW3COpen}>
                            W3C
                        </Button>
                        <Button variant="outline-neutral" className="mr-05" disabled={btnDisabled} onClick={handleClickPreviewOpen}>
                            미리보기
                        </Button>
                    </div>
                    <div className="d-flex">
                        <Button variant="positive" className="mr-05" onClick={handleClickSave}>
                            전송
                        </Button>
                        <Button variant="negative" disabled={btnDisabled} onClick={(e) => onDelete(page)}>
                            삭제
                        </Button>
                    </div>
                </Form.Group>
                {/* 사용여부,페이지 ID */}
                <Form.Row className="mb-2">
                    {/* 페이지 ID */}
                    <Col xs={6} className="px-0">
                        <MokaInputLabel label="페이지 ID" className="mb-0" placeholder="ID" value={paramPageSeq} inputProps={{ plaintext: true, readOnly: true }} />
                    </Col>
                    {/* 사용여부 */}
                    <Col xs={6} className="px-0">
                        <MokaInputLabel
                            as="switch"
                            className="mb-2"
                            label="사용여부"
                            id="usedYn"
                            name="usedYn"
                            inputProps={{ checked: temp.usedYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                {/* 페이지 URL */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="URL"
                        className="mb-0 w-100"
                        value={temp.pageUrl}
                        inputProps={{
                            plaintext: true,
                            readOnly: true,
                            onClick: handleClickOpenService,
                        }}
                    />
                </Form.Row>
                {/* 페이지명 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="페이지명"
                        value={temp.pageName}
                        name="pageName"
                        onChange={handleChangeValue}
                        className="mb-0 w-100"
                        placeholder="페이지명을 입력하세요"
                        isInvalid={error.pageName}
                        required
                    />
                </Form.Row>
                {/* 서비스명, 서비스타입 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="서비스명"
                        value={temp.pageServiceName}
                        name="pageServiceName"
                        onChange={handleChangeValue}
                        className="mb-0 w-100"
                        placeholder="서비스명을 입력하세요"
                        required
                        isInvalid={error.pageServiceName}
                        disabled={!btnDisabled || (temp.parent && temp.parent.pageSeq === null)}
                    />
                </Form.Row>
                {/* 표출명, 순서 */}
                <Form.Row className="mb-2">
                    <Col xs={8} className="px-0">
                        <MokaInputLabel
                            label="표출명"
                            value={temp.pageDisplayName}
                            name="pageDisplayName"
                            onChange={handleChangeValue}
                            className="mb-0"
                            placeholder="표출명을 입력하세요"
                            isInvalid={error.pageDisplayName}
                        />
                    </Col>
                    <Col xs={4} className="px-0">
                        <MokaInputLabel
                            label="순서"
                            labelWidth={43}
                            className="mb-0"
                            value={temp.pageOrd}
                            name="pageOrd"
                            onChange={handleChangeValue}
                            required
                            isInvalid={error.pageOrd}
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
                            inputProps={{ checked: temp.moveYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={8} className="px-0">
                        <MokaSearchInput
                            className="pl-2"
                            value={temp.moveUrl}
                            placeholder="이동할 페이지를 선택하세요"
                            onSearch={() => setMoveModalShow(true)}
                            inputProps={{ readOnly: true }}
                            disabled={temp.moveYn === 'N'}
                            isInvalid={error.moveUrl}
                        />
                    </Col>
                </Form.Row>
                {/* 파일저장 => 주석처리 */}
                {/* <Form.Row className="mb-2">
                    <Col xs={4} className="px-0">
                        <MokaInputLabel
                            as="switch"
                            className="mb-0 h-100"
                            id="fileYn"
                            name="fileYn"
                            label="파일저장"
                            inputProps={{ checked: temp.fileYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row> */}
                {/* 키워드 */}
                <MokaInputLabel className="mb-2" label="키워드" value={temp.kwd} name="kwd" onChange={handleChangeValue} placeholder="키워드를 입력하세요" />
                {/* 설명 */}
                <MokaInputLabel
                    className="mb-2"
                    inputClassName="resize-none"
                    as="textarea"
                    label="설명"
                    value={temp.description}
                    name="description"
                    onChange={handleChangeValue}
                    inputProps={{ rows: 10 }}
                    placeholder="설명을 입력하세요"
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
                    value={temp.urlParam}
                    name="urlParam"
                    onChange={handleChangeValue}
                    placeholder="파라미터명을 입력하세요"
                    isInvalid={error.urlParam}
                />
                {/* 카테고리 */}
                <MokaInputLabel
                    className="mb-2"
                    label="카테고리"
                    value={temp.category}
                    name="category"
                    onChange={handleChangeValue}
                    placeholder="카테고리를 입력하세요"
                    isInvalid={error.category}
                />
            </Form>

            <PageListModal title="이동페이지 검색" show={moveModalShow} onHide={() => setMoveModalShow(false)} onClickSave={handleClickMoveSave} />
        </MokaCard>
    );
};

export default PageEdit;
