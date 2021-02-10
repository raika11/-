import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInputLabel } from '@components';
import { previewPage, w3cArticlePage } from '@store/merge';
import { initialState, getPreviewTotalId, existsArtType, changeArticlePage, saveArticlePage, changeInvalidList } from '@store/articlePage';
import toast, { messageBox } from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';
import { invalidListToError } from '@utils/convertUtil';
import { API_BASE_URL, W3C_URL } from '@/constants';

const ArticlePageEdit = ({ onDelete, match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector(
        ({ loading }) =>
            loading['articlePage/GET_ARTICLE_PAGE'] ||
            loading['articlePage/POST_ARTICLE_PAGE'] ||
            loading['articlePage/PUT_ARTICLE_PAGE'] ||
            loading['articlePage/DELETE_ARTICLE_PAGE'] ||
            loading['merge/PREVIEW_PAGE'] ||
            loading['merge/W3C_PAGE'],
    );
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const articleTypeRows = useSelector((store) => store.codeMgt.articleTypeRows);
    const { articlePage, artPageBody, invalidList } = useSelector(({ articlePage }) => articlePage);

    // state
    const [temp, setTemp] = useState(initialState.articlePage);
    const [error, setError] = useState({
        artPageName: false,
        artType: false,
    });
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [previewTotalId, setPreviewTotalId] = useState('');

    /**
     * 입력값 변경
     */
    const handleChangeValue = useCallback(
        ({ target }) => {
            const { name, value } = target;
            if (name === 'artPageName') {
                setTemp({ ...temp, artPageName: value });
                setError({ ...error, artPageName: false });
            } else if (name === 'previewTotalId') {
                setPreviewTotalId(value);
            }
        },
        [error, temp],
    );

    const changeArtType = useCallback(
        (artType) => {
            dispatch(
                getPreviewTotalId({
                    artType: artType,
                    callback: (response) => {
                        if (response.header.success) {
                            if (response.body === null) {
                                toast.error('미리보기용 기사ID가 존재하지 않습니다.');
                            }
                            setPreviewTotalId(response.body);
                        } else {
                            toast.error('미리보기용 기사ID 조회에 실패하였습니다.');
                        }
                    },
                }),
            );
        },
        [dispatch],
    );

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
     * 기사페이지 저장 호출
     * @param {object} tmp 기사페이지
     */
    const saveCallback = useCallback(
        (tmp) => {
            dispatch(
                saveArticlePage({
                    actions: [changeArticlePage(tmp)],
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                            history.push(`${match.path}/${body.artPageSeq}`);
                        } else {
                            if (body?.list) {
                                const bodyChk = body.list.filter((e) => e.field === 'artPageBody');
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
        [dispatch, history, match.path],
    );

    /**
     * 기사페이지 저장
     * @param {object} tmp 기사페이지
     */
    const submitPage = useCallback(
        (tmp) => {
            if (tmp.artPageSeq) {
                saveCallback(tmp);
            } else {
                dispatch(
                    existsArtType({
                        payload: {
                            domainId: latestDomainId,
                            artType: tmp.artType,
                        },
                        callback: (response) => {
                            const { header, body } = response;
                            if (body) {
                                setError({ ...error, artType: true });
                                messageBox.alert(header.message);
                            } else {
                                saveCallback(tmp);
                            }
                        },
                    }),
                );
            }
        },
        [dispatch, error, latestDomainId, saveCallback],
    );

    /**
     * 저장 클릭
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
        if (previewTotalId) {
            const option = {
                content: artPageBody,
                callback: ({ header, body }) => {
                    if (header.success) {
                        const item = {
                            ...produce(articlePage, (draft) => {
                                draft.artPageBody = artPageBody;
                            }),
                            totalId: previewTotalId,
                        };
                        commonUtil.popupPreview(`${API_BASE_URL}/preview/article-page`, item);
                    } else {
                        toast.fail(header.message || '미리보기에 실패하였습니다');
                    }
                },
            };
            dispatch(previewPage(option));
        } else {
            messageBox.alert('기사ID를 입력하세요');
        }
    }, [artPageBody, articlePage, dispatch, previewTotalId]);

    /**
     * HTML검사(W3C) 팝업 : syntax체크 -> 머지결과 -> HTML검사
     */
    const handleClickW3COpen = useCallback(() => {
        if (previewTotalId) {
            const tempPage = produce(articlePage, (draft) => {
                draft.artPageBody = artPageBody;
            });

            const option = {
                content: artPageBody,
                articlePage: tempPage,
                totalId: previewTotalId,
                callback: ({ header, body }) => {
                    if (header.success) {
                        commonUtil.popupPreview(W3C_URL, { fragment: body }, 'multipart/form-data');
                    } else {
                        toast.fail(header.message || 'W3C검사에 실패했습니다');
                    }
                },
            };
            dispatch(w3cArticlePage(option));
        } else {
            messageBox.alert('기사ID를 입력하세요');
        }
    }, [articlePage, artPageBody, dispatch, previewTotalId]);

    /**
     * 취소 버튼
     */
    const handleClickCancle = () => history.push(match.path);

    useEffect(() => {
        if (articlePage.artPageSeq) {
            setBtnDisabled(false);
        } else {
            changeArtType(initialState.articlePage.artType);
            setBtnDisabled(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, articlePage.artPageSeq]);

    useEffect(() => {
        setTemp(articlePage);
        setPreviewTotalId(articlePage.previewTotalId);
    }, [articlePage]);

    useEffect(() => {
        if (invalidList.length > 0) {
            setError(invalidListToError(invalidList));
            messageBox.alert(invalidList.map((element) => element.reason).join('\n'), () => {});
        }
    }, [invalidList]);

    return (
        <MokaCard title={`기사페이지 ${articlePage.artPageSeq ? '수정' : '등록'}`} loading={loading}>
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
                        <Button variant="negative" onClick={handleClickCancle}>
                            취소
                        </Button>
                        {!btnDisabled && (
                            <Button variant="negative" className="ml-05" onClick={(e) => onDelete(articlePage)}>
                                삭제
                            </Button>
                        )}
                    </div>
                </Form.Group>
                {/* 기사페이지ID */}
                {articlePage.artPageSeq && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel
                            label="기사페이지ID"
                            value={temp.artPageSeq}
                            name="artPageSeq"
                            onChange={handleChangeValue}
                            className="w-100"
                            labelWidth={84}
                            placeholder="기사페이지ID를 입력하세요"
                            isInvalid={error.artPageName}
                            inputProps={{ plaintext: true, readOnly: true }}
                            required
                        />
                    </Form.Row>
                )}
                {/* 기사페이지명 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="기사페이지명"
                        value={temp.artPageName}
                        name="artPageName"
                        onChange={handleChangeValue}
                        className="w-100"
                        labelWidth={84}
                        placeholder="기사페이지명을 입력하세요"
                        isInvalid={error.artPageName}
                        inputProps={{ autoComplete: 'off' }}
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
                        className="w-100"
                        labelWidth={84}
                        placeholder="기사타입을 선택하세요."
                        required
                        isInvalid={error.pageServiceName}
                    >
                        {articleTypeRows &&
                            articleTypeRows.map((type) => (
                                <option key={type.dtlCd} value={type.dtlCd}>
                                    {type.cdNm}
                                </option>
                            ))}
                    </MokaInputLabel>
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="기사ID"
                        value={previewTotalId}
                        name="previewTotalId"
                        onChange={handleChangeValue}
                        className="w-100"
                        labelWidth={84}
                        placeholder="기사ID를 입력하세요."
                        inputProps={{ autoComplete: 'off' }}
                    />
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default ArticlePageEdit;
