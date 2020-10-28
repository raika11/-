import React, { useState, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import produce from 'immer';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { MokaIconTabs } from '@/components/MokaTabs';
import { clearStore, clearHistory, clearRelationList } from '@store/page';

import PageEditor from './PageEditor';
const PageList = React.lazy(() => import('./PageList'));
const PageEdit = React.lazy(() => import('./PageEdit'));

// relations
const PageChildPageList = React.lazy(() => import('./relations/PageChildPageList'));
const PageChildContainerList = React.lazy(() => import('./relations/PageChildContainerList'));
const PageChildSkinList = React.lazy(() => import('./relations/PageChildSkinList'));
const PageChildComponentList = React.lazy(() => import('./relations/PageChildComponentList'));
const PageChildTemplateList = React.lazy(() => import('./relations/PageChildTemplateList'));
const PageChildAdList = React.lazy(() => import('./relations/PageChildAdList'));
const PageHistoryList = React.lazy(() => import('./relations/PageHistoryList'));

/**
 * 페이지 관리
 */
const Page = () => {
    const dispatch = useDispatch();
    const [expansionState, setExpansionState] = useState([true, false, true]);

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

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
            dispatch(clearRelationList());
            dispatch(clearHistory());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>페이지관리</title>
                <meta name="description" content="페이지관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                className="mr-10"
                headerClassName="pb-0"
                titleClassName="mb-0"
                title="페이지관리"
                foldable
                height={CARD_DEFAULT_HEIGHT}
                expansion={expansionState[0]}
                onExpansion={handleListExpansion}
            >
                <Suspense>
                    <PageList />
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
                                tabWidth={412}
                                tabs={[
                                    <Suspense>
                                        <PageEdit />
                                    </Suspense>,
                                    <Suspense>
                                        <PageChildPageList />
                                    </Suspense>,
                                    <Suspense>
                                        <PageChildSkinList />
                                    </Suspense>,
                                    <Suspense>
                                        <PageChildContainerList />
                                    </Suspense>,
                                    <Suspense>
                                        <PageChildComponentList />
                                    </Suspense>,
                                    <Suspense>
                                        <PageChildTemplateList />
                                    </Suspense>,
                                    <Suspense>
                                        <PageChildAdList />
                                    </Suspense>,
                                    <Suspense>
                                        <PageHistoryList />
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                tabNavPosition="right"
                                tabNavs={[
                                    { title: '사이트 정보', text: 'Info' },
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-file" /> },
                                    { title: '관련 뷰스킨', icon: <MokaIcon iconName="fal-file-alt" /> },
                                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-box" /> },
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
