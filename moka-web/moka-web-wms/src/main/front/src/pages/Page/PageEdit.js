import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaSearchInput, MokaCard, MokaInputLabel } from '@components';
import { getPageType } from '@store/codeMgt';
import { checkSyntax, w3cPage, CHECK_SYNTAX, W3C_PAGE } from '@store/merge';
import { initialState, changePage, savePage, GET_PAGE, DELETE_PAGE, SAVE_PAGE, changeInvalidList } from '@store/page';
import toast, { messageBox } from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';
import { invalidListToError } from '@utils/convertUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { API_BASE_URL, W3C_URL } from '@/constants';
import { PageListModal } from '@pages/Page/modals';

/**
 * 페이지 정보
 */
const PageEdit = ({ onDelete }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector(({ loading }) => loading[GET_PAGE] || loading[SAVE_PAGE] || loading[DELETE_PAGE] || loading[CHECK_SYNTAX] || loading[W3C_PAGE]);
    const { PAGE_TYPE_HTML, EXCLUDE_PAGE_SERVICE_NAME_LIST } = useSelector(({ app }) => app);
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const pageTypeRows = useSelector(({ codeMgt }) => codeMgt.pageTypeRows);
    const { page, pageBody, invalidList } = useSelector(({ page }) => page);

    // state
    const [temp, setTemp] = useState(initialState.page);
    const [error, setError] = useState({});
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [moveModalShow, setMoveModalShow] = useState(false);

    const makePageUrl = useCallback(
        (name, value) => {
            let url = '';
            if (name === 'pageServiceName') {
                url = `${temp.parent.pageUrl === '/' ? '' : temp.parent.pageUrl}/${value}`;
                if (REQUIRED_REGEX.test(temp.urlParam)) {
                    url = `${url}/*`;
                }
            } else if (name === 'urlParam') {
                url = `${temp.parent.pageUrl === '/' ? '' : temp.parent.pageUrl}/${temp.pageServiceName}`;
                if (REQUIRED_REGEX.test(value)) {
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
     * 입력값 변경
     */
    const handleChangeValue = useCallback(
        ({ target }) => {
            const { name, value, checked } = target;

            if (name === 'usedYn') {
                setTemp({ ...temp, usedYn: checked ? 'Y' : 'N' });
            } else if (name === 'pageServiceName') {
                const url = makePageUrl(name, value);
                setTemp({
                    ...temp,
                    pageUrl: url,
                    pageServiceName: value,
                });
                setError({ ...error, pageServiceName: false });
            } else if (name === 'moveYn') {
                setTemp({ ...temp, moveYn: checked ? 'Y' : 'N' });
            } else if (name === 'fileYn') {
                setTemp({ ...temp, fileYn: checked ? 'Y' : 'N' });
            } else if (name === 'urlParam') {
                const url = makePageUrl(name, value);
                setTemp({
                    ...temp,
                    pageUrl: url,
                    urlParam: value,
                });
                setError({ ...error, urlParam: false });
            } else {
                setTemp({ ...temp, [name]: value });
                setError({ ...error, [name]: false });
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
            if (!REQUIRED_REGEX.test(page.pageName)) {
                errList.push({
                    field: 'pageName',
                    reason: '페이지명을 입력하세요',
                });
                isInvalid = isInvalid | true;
            }

            // 서비스명 입력체크
            if (!bRoot && !REQUIRED_REGEX.test(page.pageServiceName)) {
                errList.push({
                    field: 'pageServiceName',
                    reason: '서비스명을 입력하세요.',
                });
                isInvalid = isInvalid | true;
            } else if (!bRoot && !/^[a-zA-Z0-9_-]+$/.test(page.pageServiceName)) {
                // 서비스명 문자체크
                errList.push({
                    field: 'pageServiceName',
                    reason: '영문, 숫자, _, -만 입력할 수 있습니다',
                });
                isInvalid = isInvalid | true;
            } else if (!bRoot && EXCLUDE_PAGE_SERVICE_NAME_LIST.includes(page.pageServiceName)) {
                // 서비스명 불가 문자체크
                errList.push({
                    field: 'pageServiceName',
                    reason: '서비스명으로 등록할 수 없는 문자열입니다',
                });
                isInvalid = isInvalid | true;
            }

            // 페이지순서 체크
            if (!REQUIRED_REGEX.test(page.pageOrd)) {
                errList.push({
                    field: 'pageOrd',
                    reason: '페이지순서를 입력하세요',
                });
                isInvalid = isInvalid | true;
            } else if (!/^[\d]+$/.test(page.pageOrd)) {
                // 페이지순서 체크
                errList.push({
                    field: 'pageOrd',
                    reason: '페이지순서를 숫자로 입력하세요',
                });
                isInvalid = isInvalid | true;
            }

            // 이동URL 체크
            if (page.moveYn === 'Y' && !REQUIRED_REGEX.test(page.moveUrl)) {
                errList.push({
                    field: 'moveUrl',
                    reason: '이동URL을 입력하세요',
                });
                isInvalid = isInvalid | true;
            }

            // 경로파라미터 문자체크
            if (!bRoot && !/^[a-zA-Z0-9_-]*$/.test(page.urlParam)) {
                errList.push({
                    field: 'urlParam',
                    reason: '영문, 숫자, _, -만 입력할 수 있습니다',
                });
                isInvalid = isInvalid | true;
            }

            dispatch(changeInvalidList(errList));
            return !isInvalid;
        },
        [EXCLUDE_PAGE_SERVICE_NAME_LIST, dispatch],
    );

    /**
     * 페이지 저장
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
                            if (body?.list) {
                                const bodyChk = body.list.filter((e) => e.field === 'pageBody');
                                if (bodyChk.length > 0) {
                                    messageBox.alert('Tems 문법 사용이 비정상적으로 사용되었습니다\n수정 확인후 다시 저장해 주세요', () => {});
                                    return;
                                }
                            }
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch, history],
    );

    /**
     * 저장 클릭
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
        setMoveModalShow(false);
    };

    /**
     * 미리보기 팝업
     */
    const handleClickPreviewOpen = useCallback(() => {
        dispatch(
            checkSyntax({
                content: pageBody,
                callback: ({ header, body }) => {
                    if (header.success) {
                        const item = produce(page, (draft) => {
                            draft.pageBody = pageBody;
                        });
                        commonUtil.newTabPreview(`${API_BASE_URL}/preview/page`, item);
                    } else {
                        toast.fail(header.message || '미리보기에 실패하였습니다');
                    }
                },
            }),
        );
    }, [dispatch, page, pageBody]);

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
                    commonUtil.newTabPreview(W3C_URL, { fragment: body }, 'multipart/form-data');
                } else {
                    toast.fail(header.message || 'W3C검사에 실패했습니다');
                }
            },
        };
        dispatch(w3cPage(option));
    }, [dispatch, page, pageBody]);

    /**
     * page url 클릭
     */
    const handleClickOpenService = (e) => {
        if (!loading && temp.pageUrl) {
            let url = `//${temp.domain.domainUrl}${temp.pageUrl}`;
            window.open(url);
        }
    };

    useEffect(() => {
        if (!pageTypeRows) dispatch(getPageType());
    }, [dispatch, pageTypeRows]);

    useEffect(() => {
        page.pageSeq ? setBtnDisabled(false) : setBtnDisabled(true);
    }, [page.pageSeq]);

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
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    return (
        <MokaCard titleClassName="h-100" title={`페이지 ${page.pageSeq ? '수정' : '등록'}`} loading={loading}>
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3 d-flex justify-content-between">
                    <div className="d-flex">
                        <Button variant="outline-neutral" className="mr-1" disabled={btnDisabled} onClick={handleClickW3COpen}>
                            W3C
                        </Button>
                        <Button variant="outline-neutral" className="mr-1" disabled={btnDisabled} onClick={handleClickPreviewOpen}>
                            미리보기
                        </Button>
                    </div>
                    <div className="d-flex">
                        <Button variant="positive" className="mr-1" onClick={handleClickSave}>
                            전송
                        </Button>
                        {page.pageSeq && (
                            <Button variant="negative" onClick={(e) => onDelete(page)}>
                                삭제
                            </Button>
                        )}
                    </div>
                </Form.Group>

                {/* 사용여부,페이지 ID */}
                <Form.Row className="mb-2">
                    {/* 페이지 ID */}
                    <Col xs={6} className="px-0">
                        <MokaInputLabel label="페이지 ID" className="mb-0" placeholder="ID" value={page.pageSeq} inputProps={{ plaintext: true, readOnly: true }} />
                    </Col>
                    {/* 사용여부 */}
                    <Col xs={6} className="px-0">
                        <MokaInputLabel as="switch" label="사용여부" id="usedYn" name="usedYn" inputProps={{ checked: temp.usedYn === 'Y' }} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>

                {/* 페이지 URL */}
                <Form.Row className="mb-2">
                    <MokaInputLabel label="URL" as="none" />
                    <p className="mb-0 d-flex align-items-center cursor-pointer hover-underline ft-14" onClick={handleClickOpenService}>
                        <span>{temp.pageUrl}</span>
                    </p>
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
                        invalidMessage={error.pageServiceNameMessage}
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
                            placeholder="표출명을 입력하세요"
                            isInvalid={error.pageDisplayName}
                            invalidMessage={error.pageDisplayNameMessage}
                        />
                    </Col>
                    <Col xs={4} className="px-0 pl-20">
                        <MokaInputLabel
                            label="순서"
                            labelWidth={27}
                            value={temp.pageOrd}
                            name="pageOrd"
                            onChange={handleChangeValue}
                            type="number"
                            isInvalid={error.pageOrd}
                            required
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
                            placeholder="이동 페이지 선택"
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
                    label="경로\n파라미터명"
                    value={temp.urlParam}
                    name="urlParam"
                    onChange={handleChangeValue}
                    placeholder="파라미터명을 입력하세요"
                    isInvalid={error.urlParam}
                    invalidMessage={error.urlParamMessage}
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
