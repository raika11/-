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
import util from '@utils/commonUtil';
import { invalidListToError } from '@utils/convertUtil';
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
    const [temp, setTemp] = useState(initialState.page);
    const [error, setError] = useState({});
    const [isRoot, setIsRoot] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [moveModalShow, setMoveModalShow] = useState(false);

    /**
     * pageUrl 처리
     */
    const makePageUrl = useCallback(
        (name, value) => {
            let pageUrl = '';
            if (name === 'pageServiceName') {
                pageUrl = `${page.pageUrl}${value}`;
                if (!util.isEmpty(temp.urlParam)) pageUrl = [pageUrl, pageUrl.slice(-1) === '/' ? '' : '/', '*'].join('');
                if (util.isEmpty(pageUrl)) pageUrl = '/';
            } else if (name === 'urlParam') {
                pageUrl = `${page.pageUrl}${temp.pageServiceName}`;
                if (!util.isEmpty(value)) pageUrl = [pageUrl, pageUrl.slice(-1) === '/' ? '' : '/', '*'].join('');
                if (util.isEmpty(pageUrl)) pageUrl = '/';
            } else {
                pageUrl = temp.pageUrl;
            }
            return pageUrl;
        },
        [page, temp],
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
                const pageUrl = makePageUrl(name, value);
                setTemp({
                    ...temp,
                    pageUrl,
                    pageServiceName: value,
                });
                setError({ ...error, pageServiceName: false });
            } else if (name === 'moveYn') {
                setTemp({ ...temp, moveYn: checked ? 'Y' : 'N' });
            } else if (name === 'fileYn') {
                setTemp({ ...temp, fileYn: checked ? 'Y' : 'N' });
            } else if (name === 'urlParam') {
                const pageUrl = makePageUrl(name, value);
                setTemp({
                    ...temp,
                    pageUrl,
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

            // 페이지명 체크
            if (util.isEmpty(page.pageName)) {
                errList.push({ field: 'pageName', reason: '페이지명을 입력하세요' });
                isInvalid = isInvalid | true;
            }

            // 서비스명 혹은 경로파라미터가 있는지 확인
            if (!isRoot && util.isEmpty(page.pageServiceName) && util.isEmpty(page.urlParam)) {
                errList.push({ field: 'pageServiceName', reason: '서비스명 혹은 경로 파라미터를 입력하세요' });
                isInvalid = isInvalid | true;
            }

            // 서비스명이 있는 경우 입력값에 대한 검증
            if (!isRoot && !util.isEmpty(page.pageServiceName)) {
                if (!/^[a-zA-Z0-9_-]+$/.test(page.pageServiceName)) {
                    errList.push({ field: 'pageServiceName', reason: '서비스명은 영문, 숫자, _, -만 입력할 수 있습니다' });
                    isInvalid = isInvalid | true;
                } else if (EXCLUDE_PAGE_SERVICE_NAME_LIST.includes(page.pageServiceName)) {
                    errList.push({ field: 'pageServiceName', reason: '서비스명으로 등록할 수 없는 문자열입니다' });
                    isInvalid = isInvalid | true;
                }
            }

            // 경로파라미터가 있는 경우 입력값에 대한 검증
            if (!isRoot && !util.isEmpty(page.urlParam)) {
                if (!isRoot && !/^[a-zA-Z0-9_-]*$/.test(page.urlParam)) {
                    errList.push({ field: 'urlParam', reason: '경로 파라미터는 영문, 숫자, _, -만 입력할 수 있습니다' });
                    isInvalid = isInvalid | true;
                }
            }

            // 페이지순서 체크
            if (util.isEmpty(page.pageOrd)) {
                errList.push({ field: 'pageOrd', reason: '페이지순서를 입력하세요' });
                isInvalid = isInvalid | true;
            } else if (!/^[\d]+$/.test(page.pageOrd)) {
                // 페이지순서 체크
                errList.push({ field: 'pageOrd', reason: '페이지순서를 숫자로 입력하세요' });
                isInvalid = isInvalid | true;
            }

            // 이동URL 체크
            if (page.moveYn === 'Y' && util.isEmpty(page.moveUrl)) {
                errList.push({ field: 'moveUrl', reason: '이동URL을 입력하세요' });
                isInvalid = isInvalid | true;
            }

            dispatch(changeInvalidList(errList));
            return !isInvalid;
        },
        [EXCLUDE_PAGE_SERVICE_NAME_LIST, isRoot, dispatch],
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
     * 저장
     * @param {object} e 이벤트
     */
    const handleClickSave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let saveObj = { ...page, ...temp };
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
                callback: ({ header }) => {
                    if (header.success) {
                        const item = produce(temp, (draft) => {
                            draft.pageBody = pageBody;
                        });
                        util.newTabPreview(`${API_BASE_URL}/preview/page`, item);
                    } else {
                        toast.fail(header.message || '미리보기에 실패하였습니다');
                    }
                },
            }),
        );
    }, [dispatch, temp, pageBody]);

    /**
     * HTML검사(W3C) 팝업 : syntax체크 -> 머지결과 -> HTML검사
     */
    const handleClickW3COpen = useCallback(() => {
        const tempPage = produce(temp, (draft) => {
            draft.pageBody = pageBody;
        });

        const option = {
            content: pageBody,
            page: tempPage,
            callback: ({ header, body }) => {
                if (header.success) {
                    util.newTabPreview(W3C_URL, { fragment: body }, 'multipart/form-data');
                } else {
                    toast.fail(header.message || 'W3C검사에 실패했습니다');
                }
            },
        };
        dispatch(w3cPage(option));
    }, [dispatch, temp, pageBody]);

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
        setTemp({ ...page, pageType: page.pageType || PAGE_TYPE_HTML });
        setIsRoot(!(page.parent && page.parent.pageSeq));
    }, [PAGE_TYPE_HTML, page]);

    useEffect(() => {
        // 위치 그룹 데이터가 없을 경우 0번째 데이터 셋팅
        if (temp.pageType === '' && pageTypeRows?.length > 0) {
            setTemp({ ...temp, pageType: pageTypeRows[0].dtlCd });
        }
    }, [temp, pageTypeRows]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
        invalidList.filter((a) => !util.isEmpty(a.reason)).forEach((a) => toast.warning(a.reason));
    }, [invalidList]);

    return (
        <MokaCard title={`페이지 ${page.pageSeq ? '수정' : '등록'}`} loading={loading}>
            <Form>
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

                <Form.Row className="mb-2">
                    <Col xs={6} className="px-0">
                        <MokaInputLabel label="페이지 ID" className="mb-0" placeholder="ID" value={page.pageSeq} inputProps={{ plaintext: true, readOnly: true }} />
                    </Col>
                    <Col xs={6} className="px-0">
                        <MokaInputLabel as="switch" label="사용여부" id="usedYn" name="usedYn" inputProps={{ checked: temp.usedYn === 'Y' }} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <MokaInputLabel label="URL" as="none" />
                    <p className="mb-0 d-flex align-items-center cursor-pointer hover-underline" onClick={handleClickOpenService}>
                        <span>{temp.pageUrl}</span>
                    </p>
                </Form.Row>

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

                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="서비스명"
                        value={temp.pageServiceName}
                        name="pageServiceName"
                        onChange={handleChangeValue}
                        className="mb-0 w-100"
                        placeholder="서비스할 Path를 입력하세요"
                        isInvalid={error.pageServiceName}
                        disabled={!btnDisabled || isRoot}
                    />
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={8} className="px-0">
                        <MokaInputLabel
                            label="표출명"
                            value={temp.pageDisplayName}
                            name="pageDisplayName"
                            onChange={handleChangeValue}
                            placeholder="표출명을 입력하세요"
                            isInvalid={error.pageDisplayName}
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
                        <PageListModal title="이동페이지 검색" show={moveModalShow} onHide={() => setMoveModalShow(false)} onClickSave={handleClickMoveSave} />
                    </Col>
                    <Col xs={8} className="px-0">
                        <MokaSearchInput
                            className="pl-2"
                            value={temp.moveUrl}
                            placeholder="이동시킬 페이지 선택"
                            onSearch={() => setMoveModalShow(true)}
                            inputProps={{ readOnly: true }}
                            disabled={temp.moveYn === 'N'}
                            isInvalid={error.moveUrl}
                        />
                    </Col>
                </Form.Row>

                {/* 파일저장(사용X) */}
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

                <MokaInputLabel className="mb-2" label="키워드" value={temp.kwd} name="kwd" onChange={handleChangeValue} placeholder="메타로 사용할 키워드를 입력하세요" />

                <MokaInputLabel
                    className="mb-2"
                    as="textarea"
                    label="설명"
                    value={temp.description}
                    name="description"
                    onChange={handleChangeValue}
                    inputProps={{ rows: 3 }}
                    placeholder="메타로 사용할 설명을 입력하세요"
                />

                <MokaInputLabel
                    className="mb-2"
                    label="경로\n파라미터"
                    value={temp.urlParam}
                    name="urlParam"
                    onChange={handleChangeValue}
                    placeholder="경로 파라미터(PathVariable)를 입력하세요"
                    isInvalid={error.urlParam}
                    disabled={!btnDisabled || isRoot}
                />

                <MokaInputLabel
                    className="mb-2"
                    label="카테고리"
                    value={temp.category}
                    name="category"
                    onChange={handleChangeValue}
                    placeholder="카테고리를 입력하세요"
                    isInvalid={error.category}
                />

                <MokaInputLabel className="mb-2" label="CLOC" value={temp.cloc} name="cloc" onChange={handleChangeValue} placeholder="CLOC를 입력하세요" isInvalid={error.cloc} />
            </Form>
        </MokaCard>
    );
};

export default PageEdit;
