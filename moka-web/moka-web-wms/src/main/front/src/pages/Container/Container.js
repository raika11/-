import React, { useState, Suspense } from 'react';
import produce from 'immer';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCardEditor, MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';

const ContainerList = React.lazy(() => import('./ContainerList'));
const ContainerEdit = React.lazy(() => import('./ContainerEdit'));

// relations

/**
 * 컨테이너 관리
 */
const Container = () => {
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
                <title>컨테이너관리</title>
                <meta name="description" content="컨테이너관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                width={412}
                className="mr-10"
                headerClassName="pb-0"
                titleClassName="mb-0"
                title="컨테이너 검색"
                foldable
                expansion={expansionState[0]}
                onExpansion={handleListExpansion}
            >
                <Suspense>
                    <ContainerList />
                </Suspense>
            </MokaCard>

            <Switch>
                <Route
                    path={['/container', '/container/:containerSeq']}
                    exact
                    render={() => (
                        <>
                            {/* 에디터 */}
                            <MokaCardEditor className="mr-10 flex-fill" title="(컨테이너명)" expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

                            {/* 탭 */}
                            <MokaIconTabs
                                expansion={expansionState[2]}
                                onExpansion={handleTabExpansion}
                                tabWidth={412}
                                tabs={[
                                    <Suspense>
                                        <ContainerEdit />
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                tabNavPosition="right"
                                tabNavs={[
                                    { title: '컨테이너 정보', text: 'Info' },
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-file" /> },
                                    { title: '관련 본문스킨', icon: <MokaIcon iconName="fal-file-alt" /> },
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

export default Container;
