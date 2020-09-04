import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import style from '~/assets/jss/pages/Resource/ResourceTreeStyle';
// import { WmsTreeView, WmsMessageBox } from '~/components';
import { getPageTree, deletePage } from '~/stores/page/pageStore';

const useStyles = makeStyles(style);

const ResourceTreeContainer = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const { pageTree, error, loading, search, latestPageSeq, page } = useSelector(
        ({ pageStore, loadingStore }) => ({
            pageTree: pageStore.pageTree,
            error: pageStore.pageTreeError,
            loading: loadingStore['pageStore/GET_PAGE_TREE'],
            search: pageStore.search,
            latestPageSeq: pageStore.latestPageSeq,
            page: pageStore.page
        })
    );

    // 마지막 매체정보 변경 : domainStore의 검색조건을 변경하고, 목록도 다시 조회된다.
    useEffect(() => {
        if (latestDomainId && latestDomainId !== search.domainId) {
            const option = {
                ...search,
                domainId: latestDomainId
            };
            dispatch(getPageTree(option));
        }
    }, [dispatch, latestDomainId, search]);

    // 첫 로딩시, 메인 페이지 로딩
    useEffect(() => {
        // if (pageTree && pageTree.pageSeq && !page.pageSeq) {
        //     const link = `/page/${pageTree.pageSeq}`;
        //     history.push(link);
        // }
    }, [pageTree, page, history]);

    // 트리 클릭. 페이지 수정창 로드
    const handleClick = useCallback(
        (pageSeq) => {
            const link = `/page/${pageSeq}`;
            history.push(link);
        },
        [history]
    );

    // 트리에서 추가버튼 클릭.
    const handleInsertSub = useCallback(
        (item) => {
            // const parent = {
            //     pageSeq: item.pageSeq,
            //     pageName: item.pageName,
            //     pageUrl: item.pageUrl
            // };
            // dispatch(changeParent(parent));
            history.push('/page');
            // const pageType = codes && codes[0].codeName;

            // history.push('/page');
            // dispatch(initializePage({ parent, latestMediaId, latestDomainId, pageType }));
        },
        [history]
    );

    // 트리에서 삭제버튼 클릭.
    const handelDelete = useCallback(
        (item) => {
            if (item.pageSeq) {
                let message;
                if (item.nodes && item.nodes.length > 0) {
                    message = `하위 페이지도 삭제됩니다. ${item.pageName}(${item.pageUrl})을(를) 삭제하시겠습니까?`;
                } else {
                    message = `${item.pageName}(${item.pageUrl})을(를) 삭제하시겠습니까?`;
                }

                // WmsMessageBox.confirm(message, () => {
                //     dispatch(deletePage({ pageSeq: item.pageSeq, search }));
                //     // 상세에 삭제된 페이지정보가 있을 경우 라우팅
                //     if (latestPageSeq && latestPageSeq === item.pageSeq) {
                //         history.push('/page');
                //     }
                // });
            }
        },
        [dispatch, history, latestPageSeq, search]
    );

    return (
        <>
            <div className={classes.root}>
                {/* <WmsTreeView
                    data={pageTree}
                    error={error}
                    loading={loading}
                    // selected={latestPageSeq}
                    onClick={handleClick}
                    onInsert={handleInsertSub}
                    onDelete={handelDelete}
                /> */}
            </div>
        </>
    );
};

export default withRouter(ResourceTreeContainer);
