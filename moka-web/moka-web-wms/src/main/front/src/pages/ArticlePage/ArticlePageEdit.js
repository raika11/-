import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaInputLabel } from '@components';
import { changeLatestDomainId } from '@store/auth/authAction';
import { previewPage, w3cPage } from '@store/merge';
import { initialState, getArticlePage, getPreviewTotalId, existsArtType, changeArticlePage, saveArticlePage, changeInvalidList } from '@store/articlePage';
import toast, { messageBox } from '@utils/toastUtil';
import { API_BASE_URL, W3C_URL } from '@/constants';

const ArticlePageEdit = ({ onDelete }) => {
    const { artPageSeq: paramId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { articlePage, artPageBody, loading, articleTypeRows, latestDomainId, invalidList } = useSelector(
        (store) => ({
            articlePage: store.articlePage.articlePage,
            artPageBody: store.articlePage.artPageBody,
            loading:
                store.loading['articlePage/GET_ARTICLE_PAGE'] ||
                store.loading['articlePage/POST_ARTICLE_PAGE'] ||
                store.loading['articlePage/PUT_ARTICLE_PAGE'] ||
                store.loading['articlePage/DELETE_ARTICLE_PAGE'] ||
                store.loading['merge/PREVIEW_PAGE'] ||
                store.loading['merge/W3C_PAGE'],
            articleTypeRows: store.codeMgt.articleTypeRows,
            latestDomainId: store.auth.latestDomainId,
            invalidList: store.page.invalidList,
        }),
        [shallowEqual],
    );

    // state
    const [temp, setTemp] = useState(initialState.articlePage);
    const [error, setError] = useState({
        artPageName: false,
        artType: false,
    });
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [previewTotalId, setPreviewTotalId] = useState('');

    useEffect(() => {
        // url로 다이렉트로 페이지 조회하는 경우
        if (!articlePage.artPageSeq) {
            changeArtType(initialState.articlePage.artType);
        } else if (paramId && paramId !== articlePage.artPageSeq) {
            const option = {
                artPageSeq: paramId,
                callback: (result) => {
                    if (!result.header.success) {
                        history.push(`/article-page`);
                    }
                },
            };

            if (Object.prototype.hasOwnProperty.call(articlePage, 'domain')) {
                const domainId = articlePage.domain.domainId;
                if (latestDomainId !== domainId) {
                    dispatch(changeLatestDomainId(domainId));
                }
            }
            dispatch(getArticlePage(option));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [articlePage, articlePage.artPageSeq, dispatch, history, latestDomainId, paramId]);

    useEffect(() => {
        if (articlePage.artPageSeq) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [dispatch, articlePage.artPageSeq]);

    useEffect(() => {
        setTemp({
            ...articlePage,
        });
        setPreviewTotalId(articlePage.previewTotalId);
        console.log(articlePage);
    }, [articlePage]);
    /*
    useEffect(() => {
        // 위치 그룹 데이터가 없을 경우 0번째 데이터 셋팅
        if (temp.pageType === '' && pageTypeRows.length > 0) {
            setTemp({ ...temp, pageType: pageTypeRows[0].dtlCd });
        }
    }, [temp]);
*/
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
            messageBox.alert(invalidList.map((element) => element.reason).join('\n'), () => {});
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
            const { name, value } = target;

            if (name === 'artPageName') {
                setTemp({ ...temp, artPageName: value });
                setError({ ...error, artPageName: false });
            }
        },
        [error, temp],
    );

    const changeArtType = (artType) => {
        console.log(artType);
        dispatch(
            getPreviewTotalId({
                artType: artType,
                callback: (response) => {
                    if (response.header.success) {
                        if (response.body === null) {
                            toast.warning('미리보기용 기사ID가 존재하지 않습니다.');
                        }
                        setPreviewTotalId(response.body);
                        console.log(response.body);
                    } else {
                        toast.error('미리보기용 기사ID 조회에 실패하였습니다.');
                    }
                },
            }),
        );
    };

    const handleChangeArtType = ({ target }) => {
        const { value } = target;
        setTemp({ ...temp, artType: value });
        setError({ ...error, artType: false });
        changeArtType(value);
    };

    /**
     * 유효성 검사
     * @param {object} page 페이지데이터
     */
    const validate = useCallback(
        (articlePage) => {
            let isInvalid = false;
            let errList = [];
            // 기사페이지명 체크
            if (/^[\s\t\n]+/.test(articlePage.artPageName)) {
                errList.push({
                    field: 'artPageName',
                    reason: '기사페이지명이 잘못되었습니다.',
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
            if (tmp.artPageSeq) {
                dispatch(
                    saveArticlePage({
                        actions: [changeArticlePage(tmp)],
                        callback: ({ header, body }) => {
                            if (header.success) {
                                toast.success(header.message);
                                history.push(`/article-page/${body.artPageSeq}`);
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            } else {
                dispatch(
                    existsArtType({
                        payload: {
                            domainId: latestDomainId,
                            artType: tmp.artType,
                        },
                        callback: (response) => {
                            console.log(response);
                            const { header, body } = response;
                            if (body) {
                                setError({ ...error, artType: true });
                                messageBox.alert(header.message);
                            } else {
                                dispatch(
                                    saveArticlePage({
                                        actions: [changeArticlePage(tmp)],
                                        callback: ({ header, body }) => {
                                            if (header.success) {
                                                toast.success(header.message);
                                                history.push(`/article-page/${body.artPageSeq}`);
                                            } else {
                                                messageBox.alert(header.message);
                                            }
                                        },
                                    }),
                                );
                            }
                        },
                    }),
                );
            }
        },
        [dispatch, error, history, latestDomainId],
    );

    /**
     * 저장 이벤트
     * @param {object} e 이벤트
     */
    const handleClickSave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let saveObj = {
            ...articlePage,
            ...temp,
        };

        if (validate(saveObj)) {
            if (!articlePage.artPageSeq || articlePage.artPageSeq === '') {
                // 새 페이지 저장 시에 도메인ID 셋팅
                saveObj.domain = { domainId: latestDomainId };
            }
            submitPage(saveObj);
        }
    };

    /**
     * 미리보기 팝업
     */
    const handleClickPreviewOpen = useCallback(() => {
        const option = {
            content: artPageBody,
            callback: ({ header, body }) => {
                if (header.success) {
                    const item = produce(articlePage, (draft) => {
                        draft.artPageBody = artPageBody;
                    });
                    popupPreview('/preview/article-page', item);
                } else {
                    toast.fail(header.message || '미리보기에 실패하였습니다');
                }
            },
        };
        dispatch(previewPage(option));
    }, [articlePage, artPageBody, dispatch]);

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
        const tempPage = produce(articlePage, (draft) => {
            draft.artPageBody = artPageBody;
        });

        const option = {
            content: artPageBody,
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
    }, [articlePage, artPageBody, dispatch]);

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
        <MokaCard titleClassName="h-100 mb-0 pb-0" title={`페이지 ${articlePage.artPageSeq ? '정보' : '등록'}`} loading={loading}>
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
                        <Button variant="negative" disabled={btnDisabled} onClick={(e) => onDelete(articlePage)}>
                            삭제
                        </Button>
                    </div>
                </Form.Group>
                {/* 기사페이지ID */}
                {paramId ? (
                    <Form.Row className="mb-2">
                        <MokaInputLabel
                            label="기사페이지ID"
                            value={temp.artPageSeq}
                            name="artPageSeq"
                            onChange={handleChangeValue}
                            className="mb-0 w-100"
                            labelWidth={84}
                            placeholder="기사페이지명을 입력하세요"
                            isInvalid={error.artPageName}
                            required
                        />
                    </Form.Row>
                ) : (
                    ''
                )}
                {/* 기사페이지명 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="기사페이지명"
                        value={temp.artPageName}
                        name="artPageName"
                        onChange={handleChangeValue}
                        className="mb-0 w-100"
                        labelWidth={84}
                        placeholder="기사페이지명을 입력하세요"
                        isInvalid={error.artPageName}
                        required
                    />
                </Form.Row>
                {/* 기사타입 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        as="select"
                        label="기사타입"
                        value={temp.artType}
                        name="artType"
                        onChange={handleChangeArtType}
                        className="mb-0 w-100"
                        labelWidth={84}
                        placeholder="기사타입을 선택하세요."
                        required
                        isInvalid={error.pageServiceName}
                    >
                        {articleTypeRows
                            ? articleTypeRows.map((type) => (
                                  <option key={type.dtlCd} value={type.dtlCd}>
                                      {type.cdNm}
                                  </option>
                              ))
                            : ''}
                    </MokaInputLabel>
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="기사ID"
                        value={previewTotalId}
                        name="articleId"
                        onChange={handleChangeValue}
                        className="mb-0 w-100"
                        labelWidth={84}
                        placeholder="기사ID를 입력하세요."
                        required
                    />
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default ArticlePageEdit;
