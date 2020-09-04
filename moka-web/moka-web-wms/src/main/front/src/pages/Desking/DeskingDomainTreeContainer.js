import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import produce from 'immer';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import style from '~/assets/jss/pages/Desking/DeskingTreeStyle';
import { WmsCard, WmsTreeView, WmsSelect } from '~/components';
import { changeLatestDomainId } from '~/stores/auth/authStore';
import { getPageTree, initialState, clearPage } from '~/stores/page/pageStore';
import { getComponentWorkList, clearDesking, changeContents } from '~/stores/desking/deskingStore';

const useStyles = makeStyles(style);

const DeskingDomainTreeContainer = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const domains = useSelector((store) => store.authStore.domains);
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const pageSeq = useSelector((store) => store.deskingStore.search.pageSeq);
    const { pageTree, error, loading, orgSearch } = useSelector(({ pageStore, loadingStore }) => ({
        pageTree: pageStore.pageTree,
        error: pageStore.pageTreeError,
        loading: loadingStore['pageStore/GET_PAGE_TREE'],
        orgSearch: pageStore.search
    }));
    const [domainRows, setDomainRows] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState(initialState.search);
    const match = useRouteMatch();
    const paramSeq = Number(match.params.pageSeq);

    useEffect(() => {
        return () => {
            dispatch(clearPage());
            dispatch(clearDesking());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 검색정보 로컬화
    useEffect(() => {
        if (orgSearch) {
            setSearch(orgSearch);
        }
        return () => {
            setSearch(initialState.search);
        };
    }, [orgSearch]);

    // 도메인 로컬화
    useEffect(() => {
        if (domains) {
            setDomainRows(
                domains.map((d) => {
                    return {
                        id: d.domainId,
                        name: d.domainName
                    };
                })
            );
        }
    }, [domains]);

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
            if (pageSeq) {
                // 최초로딩일때만 트리노드 확장
                if (expanded.length <= 0) {
                    let findInfo = {
                        findSeq: pageSeq,
                        node: null,
                        path: [String(pageTree.pageSeq)]
                    };
                    let fnode = findNode(findInfo, pageTree);
                    if (fnode) {
                        setExpanded(fnode.path);
                        setSelected([String(pageSeq)]);
                        history.push(`/desking/${pageSeq}`);
                    }
                }
            } else {
                // 상세로딩 정보가 없고, 트리의 루트노드를 보여준다.

                // direct loading여부
                let bDirectLoading = false;
                const pathname = window.location.pathname.match(/^(\/desking\/)(\d+)/);
                if (paramSeq || (pathname && pathname[2])) {
                    bDirectLoading = true;
                }

                if (!bDirectLoading) {
                    setExpanded([]);
                    setSelected([]);

                    const option = {
                        pageSeq: pageTree.pageSeq
                        // callback: (result) => {
                        //     if (result) history.push(`/desking/${pageTree.pageSeq}`);
                        // }
                    };
                    dispatch(getComponentWorkList(option));
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageTree, pageSeq, history, findNode, paramSeq, dispatch]);

    // 트리 클릭. 페이지 수정창 로드
    const handleClick = useCallback(
        (seq) => {
            const spage = String(seq);
            const isSelected = selected.includes(spage);
            const isExpanded = expanded.includes(spage);
            if (!isSelected) {
                const option = {
                    pageSeq: seq,
                    callback: (result) => {
                        history.push(`/desking/${seq}`);
                    }
                };
                setSelected([spage]);
                isExpanded
                    ? dispatch(getComponentWorkList(option))
                    : // eslint-disable-next-line prefer-arrow-callback
                      setTimeout(function () {
                          dispatch(getComponentWorkList(option));
                      }, 300);
            }
            if (!isExpanded) {
                const newExpanded = produce(expanded, (e) => {
                    e.push(seq);
                });
                setExpanded(newExpanded);
            }
            dispatch(
                changeContents({
                    component: null,
                    contentsId: null
                })
            );
        },
        [selected, expanded, dispatch, history]
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

    // 도메인 변경. 다른검색조건 초기화(즉시조회)
    const handleChangeDomain = useCallback(
        (e) => {
            dispatch(changeLatestDomainId(e.target.value));

            dispatch(clearPage());
            history.push('/desking');
        },
        [dispatch, history]
    );

    return (
        <WmsCard header={false} title="페이지트리화면">
            <div className={clsx(classes.mb8)}>
                <WmsSelect
                    rows={domainRows}
                    currentId={latestDomainId}
                    fullWidth
                    onChange={handleChangeDomain}
                />
            </div>
            <div className={classes.searchTreeRoot}>
                <WmsTreeView
                    data={pageTree}
                    error={error}
                    loading={loading}
                    expanded={expanded}
                    selected={selected}
                    onToggle={handleExpandToggle}
                    onClick={handleClick}
                />
            </div>
        </WmsCard>
    );
};

export default DeskingDomainTreeContainer;
