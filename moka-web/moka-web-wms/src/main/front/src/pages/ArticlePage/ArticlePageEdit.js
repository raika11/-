import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInputLabel } from '@components';
import { checkSyntax, w3cArticlePage } from '@store/merge';
import {
    initialState,
    getPreviewTotalId,
    existsArtType,
    changeArticlePage,
    saveArticlePage,
    changeInvalidList,
    GET_ARTICLE_PAGE,
    SAVE_ARTICLE_PAGE,
    DELETE_ARTICLE_PAGE,
} from '@store/articlePage';
import toast, { messageBox } from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';
import { invalidListToError } from '@utils/convertUtil';
import { API_BASE_URL, W3C_URL } from '@/constants';

/**
 * 기사페이지 등록/수정
 */
const ArticlePageEdit = ({ onDelete, match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector(({ loading }) => loading[GET_ARTICLE_PAGE] || loading[SAVE_ARTICLE_PAGE] || loading[DELETE_ARTICLE_PAGE]);
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const articleTypeRows = useSelector((store) => store.codeMgt.articleTypeRows);
    const { articlePage, artPageBody, invalidList } = useSelector(({ articlePage }) => articlePage);
    const [temp, setTemp] = useState(initialState.articlePage); // 입력값 state
    const [error, setError] = useState({}); // 에러 state
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [previewTotalId, setPreviewTotalId] = useState(''); // 미리보기용 기사ID

    /**
     * 기사타입별 최신 totalId 조회
     */
    const getTotalId = useCallback(
        (artType) => {
            dispatch(
                getPreviewTotalId({
                    artType: artType,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            !body && toast.warning('미리보기용 기사ID가 존재하지 않습니다.');
                            setPreviewTotalId(body || '');
                        } else {
                            messageBox.alert('미리보기용 기사ID 조회에 실패하였습니다.');
                        }
                    },
                }),
            );
        },
        [dispatch],
    );

    /**
     * 입력값 변경
     */
    const handleChangeValue = useCallback(
        ({ target }) => {
            const { name, value } = target;
            if (name === 'artPageName') {
                setTemp({ ...temp, artPageName: value });
            } else if (name === 'previewTotalId') {
                setPreviewTotalId(value);
            } else if (name === 'artType') {
                setTemp({ ...temp, artType: value });
                getTotalId(value);
            }

            if (error[name]) {
                setError({ ...error, [name]: false });
            }
        },
        [error, temp, getTotalId],
    );

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
     * 저장 콜백
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
                        domainId: latestDomainId,
                        artType: tmp.artType,
                        callback: ({ header, body }) => {
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
            dispatch(
                checkSyntax({
                    content: artPageBody,
                    callback: ({ header }) => {
                        if (header.success) {
                            commonUtil.popupPreview(`${API_BASE_URL}/preview/article-page`, {
                                ...articlePage,
                                artPageBody,
                                totalId: previewTotalId,
                            });
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            messageBox.alert('기사ID를 입력하세요');
        }
    }, [artPageBody, articlePage, dispatch, previewTotalId]);

    /**
     * w3c 검사
     */
    const handleClickW3C = useCallback(() => {
        if (previewTotalId) {
            dispatch(
                w3cArticlePage({
                    content: artPageBody,
                    articlePage: { ...articlePage, artPageBody },
                    totalId: previewTotalId,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            commonUtil.popupPreview(W3C_URL, { fragment: body }, true);
                        } else {
                            messageBox.alert(header.message || 'W3C검사에 실패했습니다');
                        }
                    },
                }),
            );
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
            getTotalId(initialState.articlePage.artType);
            setBtnDisabled(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, articlePage.artPageSeq]);

    useEffect(() => {
        setTemp(articlePage);
        setPreviewTotalId(articlePage.previewTotalId);
        setError({});
    }, [articlePage]);

    useEffect(() => {
        if (invalidList.length > 0) {
            setError(invalidListToError(invalidList));
            messageBox.alert(invalidList.map((element) => element.reason).join('\n'), () => {});
        }
    }, [invalidList]);

    return (
        <MokaCard title={`기사페이지 ${articlePage.artPageSeq ? '수정' : '등록'}`} loading={loading}>
            {/* 버튼 그룹 */}
            <div className="mb-2 d-flex justify-content-between">
                <div className="d-flex">
                    <Button variant="outline-neutral" className="mr-1" disabled={btnDisabled} onClick={handleClickW3C}>
                        W3C
                    </Button>
                    <Button variant="outline-neutral" disabled={btnDisabled} onClick={handleClickPreviewOpen}>
                        미리보기
                    </Button>
                </div>
                <div className="d-flex">
                    <Button variant="positive" className="mr-1" onClick={handleClickSave}>
                        {articlePage.artPageSeq ? '수정' : '저장'}
                    </Button>
                    {!btnDisabled && (
                        <Button variant="negative" className="mr-1" onClick={(e) => onDelete(articlePage)}>
                            삭제
                        </Button>
                    )}
                    <Button variant="negative" onClick={handleClickCancle}>
                        취소
                    </Button>
                </div>
            </div>

            {/* 기사페이지ID */}
            {articlePage.artPageSeq && (
                <MokaInputLabel
                    label="기사페이지ID"
                    value={temp.artPageSeq}
                    name="artPageSeq"
                    onChange={handleChangeValue}
                    className="mb-2"
                    placeholder="기사페이지ID를 입력하세요"
                    isInvalid={error.artPageName}
                    inputProps={{ plaintext: true, readOnly: true }}
                    required
                />
            )}

            {/* 기사페이지명 */}
            <MokaInputLabel
                label="기사페이지명"
                value={temp.artPageName}
                name="artPageName"
                onChange={handleChangeValue}
                className="mb-2"
                placeholder="기사페이지명을 입력하세요"
                isInvalid={error.artPageName}
                inputProps={{ autoComplete: 'off' }}
                required
            />

            {/* 기사타입 */}
            <MokaInputLabel
                as="select"
                label="기사타입"
                value={temp.artType}
                name="artType"
                isInvalid={error.artType}
                onChange={handleChangeValue}
                className="mb-2"
                placeholder="기사타입을 선택하세요"
                required
            >
                {articleTypeRows &&
                    articleTypeRows.map((type) => (
                        <option key={type.dtlCd} value={type.dtlCd}>
                            {type.cdNm}
                        </option>
                    ))}
            </MokaInputLabel>

            {/* 미리보기용 기사ID */}
            <MokaInputLabel
                label="기사ID"
                value={previewTotalId}
                name="previewTotalId"
                onChange={handleChangeValue}
                className="mb-2"
                placeholder="미리보기용 기사ID를 입력하세요"
                inputProps={{ autoComplete: 'off' }}
            />
        </MokaCard>
    );
};

export default ArticlePageEdit;
