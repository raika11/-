import React, { useState, Suspense, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import produce from 'immer';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIcon, MokaLoader } from '@components';
import { CARD_DEFAULT_HEIGHT, ITEM_PG, ITEM_TP, ITEM_CT, ITEM_CP, TEMS_PREFIX } from '@/constants';
import { MokaIconTabs } from '@components/MokaTabs';
import { clearStore, deletePage, appendTag, changePageBody } from '@store/page';
import { clearStore as clearHistoryStore } from '@store/history';
import toast, { messageBox } from '@utils/toastUtil';

import PageEditor from './PageEditor';
import PageEdit from './PageEdit';
const PageList = React.lazy(() => import('./PageList'));

// relations
const LookupPageList = React.lazy(() => import('@pages/Page/components/LookupPageList'));
const LookupContainerList = React.lazy(() => import('@pages/Container/components/LookupContainerList'));
const LookupComponentList = React.lazy(() => import('@pages/Component/components/LookupComponentList'));
const LookupTemplateList = React.lazy(() => import('@pages/Template/components/LookupTemplateList'));
const LookupAdList = React.lazy(() => import('@pages/Ad/components/LookupAdList'));
const HistoryList = React.lazy(() => import('@pages/commons/HistoryList'));

/**
 * 페이지 관리
 */
const Page = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { page, tree, treeBySeq } = useSelector(({ page }) => page);
    const currentMenu = useSelector(({ auth }) => auth.currentMenu);
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

    /**
     * 트리아이템의 path찾기
     * @params {number} targetSeq pageSeq
     * @returns {array} ['13', '3']
     */
    const findPath = useCallback(
        (targetSeq) => {
            let paths = [];

            const loop = (targetSeq, paths) => {
                const target = treeBySeq[targetSeq];
                if (target) {
                    if (target.pageSeq !== tree.pageSeq) {
                        paths.push(String(target.parentPageSeq));
                        loop(target.parentPageSeq, paths);
                    } else {
                        if (paths.indexOf(String(target.pageSeq)) < 0) {
                            paths.push(String(target.pageSeq));
                        }
                    }
                } else {
                    return;
                }
            };

            loop(targetSeq, paths);
            return paths;
        },
        [tree, treeBySeq],
    );

    /**
     * 삭제 이벤트
     */
    const handleClickDelete = useCallback(
        (item) => {
            if (item.pageUrl === '/') {
                messageBox.alert('메인화면은 삭제할 수 없습니다.');
            } else {
                const node = treeBySeq[item.pageSeq];
                const msg =
                    node.nodes && node.nodes.length > 0
                        ? `하위 페이지도 삭제됩니다.\n${item.pageName}(${item.pageUrl}) 페이지를 삭제하시겠습니까?`
                        : `${item.pageSeq}_${item.pageName}(${item.pageUrl}) 페이지를 삭제하시겠습니까?`;

                messageBox.confirm(
                    msg,
                    () => {
                        dispatch(
                            deletePage({
                                pageSeq: item.pageSeq,
                                callback: ({ header, body }) => {
                                    if (header.success && body) {
                                        toast.success(header.message);
                                        history.push(match.path);
                                    } else {
                                        messageBox.alert(header.message);
                                    }
                                },
                            }),
                        );
                    },
                    () => {},
                );
            }
        },
        [dispatch, history, match.path, treeBySeq],
    );

    /**
     * 본문에 TEMS 태그 삽입
     */
    const handleAppendTag = useCallback(
        (row, itemType) => {
            const nt = new Date().getTime();
            let tag = null;
            if (itemType === ITEM_CT) {
                tag = `${nt}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${row.containerSeq}" name="${row.containerName}"/>\n`;
            } else if (itemType === ITEM_CP) {
                tag = `${nt}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${row.componentSeq}" name="${row.componentName}"/>\n`;
            } else if (itemType === ITEM_TP) {
                tag = `${nt}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${row.templateSeq}" name="${row.templateName}"/>\n`;
            }
            // } else if (itemType === ITEM_AD) {
            //     tag = `${nt}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${row.adSeq}" name="${row.adName}"/>\n`;
            dispatch(appendTag(tag));
        },
        [dispatch],
    );

    /**
     * 히스토리 로드 버튼 이벤트
     */
    const handleClickHistLoad = ({ header, body }) => {
        if (header.success) {
            messageBox.confirm('현재 작업된 소스가 히스토리 내용으로 변경됩니다.\n변경하시겠습니까?', () => {
                dispatch(changePageBody(body.body));
            });
        } else {
            toast.error(header.message);
        }
    };

    /**
     * 페이지 로드 버튼 이벤트
     */
    const handleClickPageLoad = ({ header, body }) => {
        if (header.success) {
            messageBox.confirm('현재 작업된 소스가 변경됩니다.\n변경하시겠습니까?', () => {
                dispatch(changePageBody(body.pageBody));
            });
        } else {
            toast.error(header.message);
        }
    };

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
            dispatch(clearHistoryStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>{currentMenu?.menuDisplayNm}</title>
                <meta name="description" content={`${currentMenu?.menuDisplayNm}페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                className="mr-gutter"
                title={currentMenu?.menuDisplayNm}
                foldable
                height={CARD_DEFAULT_HEIGHT}
                expansion={expansionState[0]}
                onExpansion={handleListExpansion}
                bodyClassName="d-flex flex-column"
            >
                <Suspense fallback={<MokaLoader />}>
                    <PageList onDelete={handleClickDelete} match={match} findPath={findPath} />
                </Suspense>
            </MokaCard>

            <Switch>
                <Route
                    path={[`${match.path}/add`, `${match.path}/:pageSeq`]}
                    exact
                    render={() => (
                        <>
                            {/* 에디터 */}
                            <PageEditor expansion={expansionState[1]} onExpansion={handleEditorExpansion} match={match} />

                            {/* 탭 */}
                            <MokaIconTabs
                                expansion={expansionState[2]}
                                onExpansion={handleTabExpansion}
                                height={CARD_DEFAULT_HEIGHT}
                                onSelectNav={(idx) => setActiveTabIdx(Number(idx))}
                                tabWidth={412}
                                tabs={[
                                    <PageEdit onDelete={handleClickDelete} match={match} />,
                                    <Suspense fallback={<MokaLoader />}>
                                        <LookupPageList show={activeTabIdx === 1} seqType={ITEM_PG} seq={page.pageSeq} onLoad={handleClickPageLoad} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <LookupContainerList show={activeTabIdx === 2} seqType={ITEM_PG} seq={page.pageSeq} onAppend={handleAppendTag} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <LookupComponentList show={activeTabIdx === 3} seqType={ITEM_PG} seq={page.pageSeq} onAppend={handleAppendTag} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <LookupTemplateList show={activeTabIdx === 4} seqType={ITEM_PG} seq={page.pageSeq} onAppend={handleAppendTag} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <LookupAdList />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <HistoryList show={activeTabIdx === 6} seqType={ITEM_PG} seq={page.pageSeq} onLoad={handleClickHistLoad} />
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                tabNavPosition="right"
                                tabNavs={[
                                    { title: '페이지 정보', text: 'Info' },
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-money-check" /> },
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
