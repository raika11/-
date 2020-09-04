import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import produce from 'immer';
import { WmsButton } from '~/components';
import style from '~/assets/jss/pages/Page/PageInfoStyle';
import { PageForm, DeleteDialog } from './components';
import { defaultError } from '~/stores/@common/defaultError';
import { getPageType } from '~/stores/etccodeType/etccodeTypeStore';
import { previewPage, w3cPage } from '~/stores/page/mergeStore';
import {
    defaultPage,
    getPage,
    putPage,
    postPage,
    getPurge,
    getPageTree
} from '~/stores/page/pageStore';

/**
 * PageInfoContainer Style
 */
const useStyle = makeStyles(style);

const PageInfoContainer = ({ history, match }) => {
    const paramSeq = Number(match.params.pageSeq);
    const dispatch = useDispatch();
    const classes = useStyle();
    const { orgPage, orgError, loading, pageTypeRows, latestMediaId, latestDomainId } = useSelector(
        ({ pageStore, loadingStore, etccodeTypeStore, authStore, mergeStore }) => ({
            orgPage: pageStore.page,
            orgError: pageStore.pageError || mergeStore.error,
            loading:
                loadingStore['pageStore/GET_PAGE'] ||
                loadingStore['pageStore/POST_PAGE'] ||
                loadingStore['pageStore/PUT_PAGE'] ||
                loadingStore['pageStore/DELETE_PAGE'],
            pageTypeRows: etccodeTypeStore.pageTypeRows,
            latestMediaId: authStore.latestMediaId,
            latestDomainId: authStore.latestDomainId
        })
    );
    const [page, setPage] = useState(defaultPage);
    const [error, setError] = useState(defaultError);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        if (!pageTypeRows || pageTypeRows.length <= 0) {
            dispatch(getPageType());
        }

        // url로 다이렉트로 페이지 조회하는 경우
        if (paramSeq && paramSeq !== orgPage.pageSeq) {
            const option = {
                pageSeq: paramSeq,
                direct: true,
                callback: (result) => {
                    if (!result) history.push('/page');
                }
            };
            dispatch(getPage(option));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 페이지 state 초기화
    useEffect(() => {
        if (pageTypeRows.length > 0 && !orgPage.pageType) {
            setPage(
                produce(orgPage, (draft) => {
                    draft.pageType = pageTypeRows[0].name;
                })
            );
        } else {
            setPage(orgPage);
        }

        if (orgError) {
            setError(orgError);
        } else {
            setError(defaultError); // 페이지 초기화될 때, 특별한 에러가 없을 경우 초기화한다.
        }
    }, [orgPage, orgError, pageTypeRows]);

    // 에러 추가
    const insertError = useCallback(
        (err) => {
            // console.error(err);
            setError(
                produce(error, (draft) => {
                    draft.header.success = false;
                    const index =
                        draft.body.list &&
                        draft.body.list.findIndex(
                            (item) => item.field === err.field && item.reason === err.reason
                        );
                    if (index < 0) {
                        draft.body.list.push(err);
                        draft.body.totalCnt++;
                    }
                })
            );
        },
        [error]
    );

    // 에러 삭제
    const deleteError = useCallback(
        (err) => {
            setError(
                produce(error, (draft) => {
                    const index =
                        draft.body.list &&
                        draft.body.list.findIndex(
                            (item) => item.field === err.field && item.reason === err.reason
                        );
                    if (index >= 0) {
                        draft.body.totalCnt--;
                        if (draft.body.totalCnt === 0) {
                            draft.header.success = true;
                        }
                        draft.body.list.splice(index, 1);
                    }
                })
            );
        },
        [error]
    );

    // 유효성 검사. key 없으면 전체검사
    const validate = useCallback(
        (key, value) => {
            let valid = true;
            let inputValue = value;

            if (!key || key === 'pageServiceName') {
                const err = {
                    field: 'pageServiceName',
                    reason: '서비스이름을 입력하세요.'
                };
                inputValue = key ? value : page.pageServiceName;
                const bRoot = !(page.parent && page.parent.pageSeq);
                if (!bRoot && (!inputValue || inputValue === '')) {
                    insertError(err);
                    valid = false;
                } else {
                    deleteError(err);
                }
            }

            if (!key || key === 'pageServiceName') {
                const err = {
                    field: 'pageServiceName',
                    reason: '가능한 문자는 [영문_-]입니다.'
                };
                inputValue = key ? value : page.pageServiceName;
                const bRoot = !(page.parent && page.parent.pageSeq);
                if (!bRoot && inputValue && /[a-zA-Z_-]*$/.test(inputValue) === false) {
                    // 루트는 제외
                    insertError(err);
                    valid = false;
                } else {
                    deleteError(err);
                }
            }

            if (!key || key === 'pageServiceName') {
                const err = {
                    field: 'pageServiceName',
                    reason: '등록할 수 없는 서비스 이름입니다.'
                };
                inputValue = key ? value : page.pageServiceName;
                if (inputValue === 'command') {
                    insertError(err);
                    valid = false;
                } else {
                    deleteError(err);
                }
            }

            if (!key || key === 'pageName') {
                const err = {
                    field: 'pageName',
                    reason: '화면상의 이름을 입력하세요.'
                };
                inputValue = key ? value : page.pageName;
                if (!inputValue || inputValue === '') {
                    insertError(err);
                    valid = false;
                } else {
                    deleteError(err);
                }
            }

            // if (!key || key === 'pageDisplayName') {
            //     const err = {
            //         field: 'pageDisplayName',
            //         reason: '표출 이름을 입력하세요.'
            //     };
            //     inputValue = key ? value : page.pageDisplayName;
            //     if (!inputValue || inputValue === '') {
            //         insertError(err);
            //         valid = false;
            //     } else {
            //         deleteError(err);
            //     }
            // }

            if (!key || key === 'pageOrder') {
                const err = {
                    field: 'pageOrder',
                    reason: '순서를 입력하세요.'
                };
                inputValue = key ? value : page.pageOrder;
                if (!inputValue || inputValue === '') {
                    insertError(err);
                    valid = false;
                } else {
                    deleteError(err);
                }
            }

            if (!key || key === 'keyword') {
                const err = {
                    field: 'keyword',
                    reason: '키워드를 200자리 이하로 입력하세요.'
                };
                inputValue = key ? value : page.keyword;
                if (inputValue && inputValue.length > 128) {
                    insertError(err);
                    valid = false;
                } else {
                    deleteError(err);
                }
            }

            if (!key || key === 'description') {
                const err = {
                    field: 'description',
                    reason: '코멘트를 4000자리 이하로 입력하세요.'
                };
                inputValue = key ? value : page.description;
                if (inputValue && inputValue.length > 4000) {
                    insertError(err);
                    valid = false;
                } else {
                    deleteError(err);
                }
            }

            if (!key || key === 'moveUrl') {
                const err = {
                    field: 'moveUrl',
                    reason: '이동URL을 입력하세요.'
                };
                inputValue = key ? value : page.moveUrl;
                if (page.moveYn === 'Y' && (!inputValue || inputValue.length <= 0)) {
                    insertError(err);
                    valid = false;
                } else {
                    deleteError(err);
                }
            }

            return valid;
        },
        [page, insertError, deleteError]
    );

    // 정보 수정
    const handleChangeField = useCallback(
        ({ key, value }) => {
            if (key === 'pageServiceName') {
                const pageUrl = `${
                    page.parent.pageUrl === '/' ? '' : page.parent.pageUrl
                }/${value}`;
                setPage({
                    ...page,
                    [key]: value,
                    pageUrl
                });
            } else {
                setPage({
                    ...page,
                    [key]: value
                });
            }
            validate(key, value);
        },
        [setPage, page, validate]
    );

    // 수정모드
    const updateMode = !!(page && page.pageSeq);

    // 루트여부
    const bRoot = !(page && page.parent && page.parent.pageSeq);

    // 수정 또는 저장
    const handleClickSave = useCallback(() => {
        if (!validate()) return;

        const option = {
            page,
            callback: (result) => {
                if (result) {
                    dispatch(getPageTree());
                    history.push(`/page/${result.pageSeq}`);
                }
            }
        };
        dispatch(paramSeq ? putPage(option) : postPage(option));
    }, [dispatch, paramSeq, page, history, validate]);

    // 페이지 삭제
    const handelDelete = useCallback(() => {
        if (paramSeq === page.pageSeq) {
            setOpenDeleteDialog(true);
        }
    }, [paramSeq, page.pageSeq]);

    // 삭제팝업 종료
    const handelDeleteDialogClose = useCallback(() => {
        setOpenDeleteDialog(false);
    }, []);

    // 미리보기 팝업
    const handleClickPreviewOpen = useCallback(() => {
        const option = {
            content: page.pageBody,
            url: '/preview/page',
            page
        };
        dispatch(previewPage(option));
    }, [dispatch, page]);

    // HTML검사(W3C) 팝업 : syntax체크 -> 머지결과 -> HTML검사
    const handleClickW3COpen = useCallback(() => {
        const option = {
            content: page.pageBody,
            page
        };
        dispatch(w3cPage(option));
    }, [dispatch, page]);

    // PURGE
    const handleClickPurge = useCallback(() => {
        dispatch(getPurge(page.pageSeq));
    }, [dispatch, page]);

    return (
        <div className={classes.root}>
            {/* 버튼 */}
            <div className={classes.buttonGroup}>
                <div>
                    <WmsButton color="wolf" onClick={handleClickW3COpen}>
                        <span>W3C</span>
                    </WmsButton>
                </div>
                <div>
                    <WmsButton color="wolf" onClick={handleClickPreviewOpen}>
                        <span>미리보기</span>
                    </WmsButton>
                </div>
                <div>
                    <WmsButton color="info" onClick={handleClickPurge} disabled={!updateMode}>
                        <span>즉시반영</span>
                    </WmsButton>
                </div>
                <div>
                    <WmsButton color="info" onClick={handleClickSave}>
                        <span>저장</span>
                        <Icon>save</Icon>
                    </WmsButton>
                </div>
                <div>
                    <WmsButton color="del" onClick={handelDelete} disabled={bRoot || !updateMode}>
                        <span>삭제</span>
                        <Icon>delete</Icon>
                    </WmsButton>
                </div>
            </div>

            {/* 폼 */}
            <PageForm
                edit={page}
                error={error}
                loading={loading}
                onChangeField={handleChangeField}
                updateMode={updateMode}
                pageTypeRows={pageTypeRows}
            />
            {openDeleteDialog && (
                <DeleteDialog
                    open={openDeleteDialog}
                    onClose={handelDeleteDialogClose}
                    item={page}
                />
            )}
        </div>
    );
};

export default withRouter(PageInfoContainer);
