import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, useRouteMatch } from 'react-router-dom';
import produce from 'immer';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTreeView } from '~/components';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';
import { DeleteDialog } from './components';
import style from '~/assets/jss/pages/Page/PageStyle';
import { clearPage, getPage, insertSubPage } from '~/stores/page/pageStore';

const useStyles = makeStyles(style);

const PageTreeContainer = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const latestMediaId = useSelector((store) => store.authStore.latestMediaId);
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const { pageTree, error, loading, page } = useSelector(({ pageStore, loadingStore }) => ({
        pageTree: pageStore.pageTree,
        error: pageStore.pageTreeError,
        loading: loadingStore['pageStore/GET_PAGE_TREE'],
        page: pageStore.page
    }));
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [willDeleteItem, setWillDeleteItem] = useState(null);
    const match = useRouteMatch();
    const paramSeq = Number(match.params.pageSeq);

    useEffect(() => {
        return () => {
            dispatch(clearPage());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 부모노드 찾기(재귀함수)
    // 리턴: {findSeq: page.pageSeq,node: null,path: [String(pageTree.pageSeq)]};
    const findNode = useCallback((findInfo, rootNode) => {
        if (rootNode.pageSeq === findInfo.findSeq) {
            return produce(findInfo, (draft) => draft);
        }

        if (rootNode.nodes && rootNode.nodes.length > 0) {
            for (let i = 0; i < rootNode.nodes.length; i++) {
                const newInfo = produce(findInfo, (draft) => {
                    draft.node = rootNode.nodes[i];
                    draft.path.push(String(rootNode.nodes[i].pageSeq));
                });
                const fnode = findNode(newInfo, rootNode.nodes[i]);
                if (fnode !== null && fnode.node !== null) {
                    return fnode;
                }
            }
            return null;
        }
        return null;
    }, []);

    // 첫 로딩시, 페이지 선택
    useEffect(() => {
        if (pageTree) {
            if (page.pageSeq) {
                // 최초로딩일때만 트리노드 확장
                if (expanded.length <= 0) {
                    let findInfo = {
                        findSeq: page.pageSeq,
                        node: null,
                        path: [String(pageTree.pageSeq)]
                    };
                    let fnode = findNode(findInfo, pageTree);
                    if (fnode) {
                        setExpanded(fnode.path);
                        setSelected([String(page.pageSeq)]);
                        history.push(`/page/${page.pageSeq}`);
                    }
                }
            } else {
                // 상세로딩 정보가 없고, 추가상태도 아닐때는 트리의 루트노드를 보여준다.

                // 추가상태여부
                const bSubInsert = !!(page.parent && page.parent.pageSeq);

                // direct loading여부
                let bDirectLoading = false;
                const pathname = window.location.pathname.match(/^(\/page\/)(\d+)/);
                if (paramSeq || (pathname && pathname[2])) {
                    bDirectLoading = true;
                }

                if (!bDirectLoading && !bSubInsert) {
                    setExpanded([]);
                    setSelected([]);

                    const option = {
                        pageSeq: pageTree.pageSeq
                        // callback: (result) => {
                        //     if (result) history.push(`/page/${pageTree.pageSeq}`);
                        // }
                    };
                    dispatch(getPage(option));
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageTree, page, history, findNode, paramSeq, dispatch]);

    // 트리 클릭. 페이지 수정창 로드
    const handleClick = useCallback(
        (pageSeq) => {
            const spage = String(pageSeq);
            const isSelected = selected.includes(spage);
            const isExpanded = expanded.includes(spage);
            if (!isSelected) {
                const option = {
                    pageSeq,
                    callback: (result) => {
                        history.push(`/page/${pageSeq}`);
                    }
                };
                setSelected([spage]);
                isExpanded
                    ? dispatch(getPage(option))
                    : // eslint-disable-next-line prefer-arrow-callback
                      setTimeout(function () {
                          dispatch(getPage(option));
                          //   history.push(`/page/${pageSeq}`);
                      }, 300);
            }
            if (!isExpanded) {
                const newExpanded = produce(expanded, (e) => {
                    e.push(pageSeq);
                });
                setExpanded(newExpanded);
            }
        },
        [selected, expanded, dispatch, history]
    );

    // 트리에서 추가버튼 클릭.
    const handleInsertSub = useCallback(
        (item) => {
            const parent = {
                pageSeq: item.pageSeq,
                pageName: item.pageName,
                pageUrl: item.pageUrl
            };
            setSelected([String(item.pageSeq)]);
            dispatch(insertSubPage({ parent, latestMediaId, latestDomainId }));
            history.push('/page');
        },
        [history, dispatch, latestMediaId, latestDomainId]
    );

    // 트리에서 삭제버튼 클릭.
    const handelDelete = useCallback(
        (item) => {
            if (item.pageSeq) {
                if (pageTree.pageSeq === item.pageSeq) {
                    dispatch(
                        enqueueSnackbar({
                            key: `page${new Date().getTime() + Math.random()}`,
                            message: '메인화면은 삭제할 수 없습니다.',
                            options: {
                                variant: 'error',
                                persist: true
                            }
                        })
                    );
                } else {
                    setWillDeleteItem(item);
                    setOpenDeleteDialog(true);
                }
            }
        },
        [dispatch, pageTree]
    );

    /** 확장 아이콘버튼 클릭(토글) */
    const handleExpandToggle = useCallback(
        (item) => {
            // expanded 노드 변경
            const isExpanded = expanded.indexOf(String(item.pageSeq));
            if (isExpanded > -1) {
                const newExpanded = produce(expanded, (e) => {
                    e.splice(isExpanded, 1);
                });
                setExpanded(newExpanded);
            } else {
                const newExpanded = produce(expanded, (e) => {
                    e.push(String(item.pageSeq));
                });
                setExpanded(newExpanded);
            }
        },
        [expanded]
    );

    // 삭제팝업 종료
    const handelDeleteDialogClose = useCallback(() => {
        setWillDeleteItem(null);
        setOpenDeleteDialog(false);
    }, []);

    return (
        <>
            <div className={classes.listTreeRoot}>
                <WmsTreeView
                    data={pageTree}
                    error={error}
                    loading={loading}
                    expanded={expanded}
                    selected={selected}
                    onToggle={handleExpandToggle}
                    onClick={handleClick}
                    onInsert={handleInsertSub}
                    onDelete={handelDelete}
                />
                {openDeleteDialog && (
                    <DeleteDialog
                        open={openDeleteDialog}
                        onClose={handelDeleteDialogClose}
                        item={willDeleteItem}
                    />
                )}
            </div>
        </>
    );
};

export default withRouter(PageTreeContainer);
