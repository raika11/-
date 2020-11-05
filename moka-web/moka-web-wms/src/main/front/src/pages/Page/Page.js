import React, { useState, Suspense, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import produce from 'immer';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { CARD_DEFAULT_HEIGHT, ITEM_PG, ITEM_TP, ITEM_CT, ITEM_CP, TEMS_PREFIX } from '@/constants';
import { MokaIconTabs } from '@/components/MokaTabs';
import { clearStore, deletePage, appendTag, changePageBody } from '@store/page';
import { clearStore as clearHistoryStore } from '@store/history';
import { notification, toastr } from '@utils/toastUtil';

import PageEditor from './PageEditor';
const PageList = React.lazy(() => import('./PageList'));
const PageEdit = React.lazy(() => import('./PageEdit'));

// relations
const LookupPageList = React.lazy(() => import('@pages/commons/LookupPageList'));
const LookupSkinList = React.lazy(() => import('@pages/commons/LookupSkinList'));
const LookupContainerList = React.lazy(() => import('@pages/commons/LookupContainerList'));
const LookupComponentList = React.lazy(() => import('@/pages/commons/LookupComponentList'));
const LookupTemplateList = React.lazy(() => import('@/pages/commons/LookupTemplateList'));
const PageChildAdList = React.lazy(() => import('./relations/PageChildAdList'));
const HistoryList = React.lazy(() => import('@pages/commons/HistoryList'));

/**
 * 페이지 관리
 */
const Page = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { page, tree } = useSelector((store) => ({
        page: store.page.page,
        tree: store.page.tree,
    }));
    const [expansionState, setExpansionState] = useState([true, false, true]);
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    /**
     * 리스트 확장 시
     * @param {boolean} expansion 확장여부
     */
    const handleListExpansion = (expansion) => {
        setExpansionState(
            produce(expansionState, (draft) => {
                if (!draft[2] && !expansion) {
                    draft[1] = true;
                } else {
                    draft[1] = false;
                }
                draft[0] = expansion;
            }),
        );
    };

    /**
     * 에디터 확장 시
     * @param {boolean} expansion 확장여부
     */
    const handleEditorExpansion = (expansion) => {
        if (expansion) {
            setExpansionState([false, expansion, false]);
        } else {
            setExpansionState([true, expansion, true]);
        }
    };

    /**
     * 탭 확장 시
     * @param {boolean} expansion 확장여부
     */
    const handleTabExpansion = (expansion) => {
        setExpansionState(
            produce(expansionState, (draft) => {
                if (!draft[0] && !expansion) {
                    draft[1] = true;
                } else {
                    draft[1] = false;
                }
                draft[2] = expansion;
            }),
        );
    };

    // 노드 찾기(재귀함수)
    // 리턴: {findSeq: page.pageSeq,node: null,path: [String(pageTree.pageSeq)]};
    const findNode = useCallback((findInfo, rootNode) => {
        if (rootNode.pageSeq === findInfo.findSeq) {
            return produce(findInfo, (draft) => draft);
        }

        if (rootNode.nodes && rootNode.nodes.length > 0) {
            for (let i = 0; i < rootNode.nodes.length; i++) {
                const newInfo = produce(findInfo, (draft) => {
                    draft.node = rootNode.nodes[i];
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

    /**
     * 삭제 이벤트
     */
    const handleClickDelete = useCallback(
        (item) => {
            if (item.pageUrl === '/') {
                toastr.warning('', '메인화면은 삭제할 수 없습니다.');
            } else {
                let findInfo = {
                    findSeq: item.pageSeq,
                    node: null,
                };
                let fnode = findNode(findInfo, tree);

                let msg;
                if (fnode.node.nodes && fnode.node.nodes.length > 0) {
                    msg = `하위 페이지도 삭제됩니다. ${item.pageName}(${item.pageUrl})을(를) 삭제하시겠습니까?`;
                } else {
                    msg = `${item.pageSeq}_${item.pageName}(${item.pageUrl})을(를) 삭제하시겠습니까?`;
                }

                toastr.confirm(msg, {
                    onOk: () => {
                        const option = {
                            pageSeq: item.pageSeq,
                            callback: (response) => {
                                if (response.header.success) {
                                    notification('success', response.header.message);
                                    history.push('/page');
                                } else {
                                    notification('warning', response.header.message);
                                }
                            },
                        };
                        dispatch(deletePage(option));
                    },
                    onCancel: () => {},
                });
            }
        },
        [dispatch, findNode, history, tree],
    );

    /**
     * tems태그 삽입
     */
    const handleAppendTag = useCallback(
        (data, itemType) => {
            let tag = null;
            if (itemType === ITEM_CT) {
                tag = `${new Date().getTime()}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${data.containerSeq}" name="${data.containerName}"/>\n`;
            } else if (itemType === ITEM_CP) {
                tag = `${new Date().getTime()}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${data.componentSeq}" name="${data.componentName}"/>\n`;
            } else if (itemType === ITEM_TP) {
                tag = `${new Date().getTime()}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${data.templateSeq}" name="${data.templateName}"/>\n`;
                // } else if (itemType === ITEM_AD) {
                //     tag = `${new Date().getTime()}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${row.adSeq}" name="${row.adName}"/>\n`;
            }
            dispatch(appendTag(tag));
        },
        [dispatch],
    );

    /**
     * 히스토리 로드 버튼 이벤트
     */
    const handleClickLoad = ({ header, body }) => {
        if (header.success) {
            toastr.confirm('불러오기 시 작업 중인 tems소스가 날라갑니다. 불러오시겠습니까?', {
                onOk: () => {
                    dispatch(changePageBody(body.body));
                },
                onCancel: () => {},
            });
        } else {
            notification('error', header.message);
        }
    };

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
            dispatch(clearHistoryStore());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="d-flex">
            <Helmet>
                <title>페이지관리</title>
                <meta name="description" content="페이지관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                className="mr-gutter"
                headerClassName="pb-0"
                titleClassName="mb-0"
                title="페이지관리"
                foldable
                height={CARD_DEFAULT_HEIGHT}
                expansion={expansionState[0]}
                onExpansion={handleListExpansion}
            >
                <Suspense>
                    <PageList onDelete={handleClickDelete} />
                </Suspense>
            </MokaCard>

            <Switch>
                <Route
                    path={['/page', '/page/:pageSeq']}
                    exact
                    render={() => (
                        <>
                            {/* 에디터 */}
                            <PageEditor expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

                            {/* 탭 */}
                            <MokaIconTabs
                                expansion={expansionState[2]}
                                onExpansion={handleTabExpansion}
                                height={CARD_DEFAULT_HEIGHT}
                                onSelectNav={(idx) => setActiveTabIdx(Number(idx))}
                                tabWidth={412}
                                tabs={[
                                    <Suspense>
                                        <PageEdit onDelete={handleClickDelete} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupPageList show={activeTabIdx === 1} seqType={ITEM_PG} seq={page.pageSeq} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupSkinList show={activeTabIdx === 2} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupContainerList show={activeTabIdx === 3} seqType={ITEM_PG} seq={page.pageSeq} onAppend={handleAppendTag} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupComponentList show={activeTabIdx === 4} seqType={ITEM_PG} seq={page.pageSeq} onAppend={handleAppendTag} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupTemplateList show={activeTabIdx === 5} seqType={ITEM_PG} seq={page.pageSeq} onAppend={handleAppendTag} />
                                    </Suspense>,
                                    <Suspense>
                                        <PageChildAdList />
                                    </Suspense>,
                                    <Suspense>
                                        <HistoryList show={activeTabIdx === 7} seqType={ITEM_PG} seq={page.pageSeq} onLoad={handleClickLoad} />
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                tabNavPosition="right"
                                tabNavs={[
                                    { title: '페이지 정보', text: 'Info' },
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-money-check" /> },
                                    { title: '관련 기사타입', icon: <MokaIcon iconName="fal-file-alt" /> },
                                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-calculator" /> },
                                    { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
                                    { title: '관련 템플릿', icon: <MokaIcon iconName="fal-newspaper" /> },
                                    { title: '관련 광고', icon: <MokaIcon iconName="fal-ad" /> },
                                    { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
                                ]}
                            />
                        </>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Page;
