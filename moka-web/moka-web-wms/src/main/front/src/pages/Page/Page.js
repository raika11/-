import React, { useState, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import produce from 'immer';
import { Helmet } from 'react-helmet';

import { MokaCardEditor, MokaCard, MokaIcon } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { MokaIconTabs } from '@/components/MokaTabs';

const PageList = React.lazy(() => import('./PageList'));
const PageEdit = React.lazy(() => import('./PageEdit'));

// relations
const PageChildPageList = React.lazy(() => import('./relations/PageChildPageList'));
const PageChildContainerList = React.lazy(() => import('./relations/PageChildContainerList'));
const PageChildContentsSkinList = React.lazy(() => import('./relations/PageChildContentsSkinList'));
const PageChildComponentList = React.lazy(() => import('./relations/PageChildComponentList'));
const PageChildTemplateList = React.lazy(() => import('./relations/PageChildTemplateList'));
const PageChildAdList = React.lazy(() => import('./relations/PageChildAdList'));
const PageHistoryList = React.lazy(() => import('./relations/PageHistoryList'));

/**
 * 페이지 관리
 */
const Page = () => {
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

            {/* 에디터 */}
            <MokaCardEditor className="mr-10 flex-fill" title="에디터 영역" height={CARD_DEFAULT_HEIGHT} expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

            {/* 탭 */}
            <Switch>
                <Route
                    path={['/page', '/page/:pageSeq']}
                    exac
                    render={() => (
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
                                    <PageChildContentsSkinList />
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
                                { title: '페이지 검색', icon: <MokaIcon iconName="fal-file" /> },
                                { title: '콘텐츠 스킨 검색', icon: <MokaIcon iconName="fal-file-alt" /> },
                                { title: '컨테이너 검색', icon: <MokaIcon iconName="fal-box" /> },
                                { title: '컴포넌트 검색', icon: <MokaIcon iconName="fal-ballot" /> },
                                { title: '템플릿 검색', icon: <MokaIcon iconName="fal-newspaper" /> },
                                { title: '광고 검색', icon: <MokaIcon iconName="fal-ad" /> },
                                { title: '페이지 히스토리', icon: <MokaIcon iconName="fal-history" /> },
                            ]}
                        />
                    )}
                />
            </Switch>
        </div>
    );
};

export default Page;
