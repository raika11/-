import React, { useState, Suspense } from 'react';
import produce from 'immer';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCardEditor, MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';

const TemplateList = React.lazy(() => import('./TemplateList'));
const TemplateEdit = React.lazy(() => import('./TemplateEdit'));

// relations

/**
 * 템플릿 관리
 */
const Template = () => {
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
                <title>템플릿관리</title>
                <meta name="description" content="템플릿관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                width={412}
                className="mr-10"
                headerClassName="pb-0"
                titleClassName="mb-0"
                title="템플릿 검색"
                foldable
                expansion={expansionState[0]}
                onExpansion={handleListExpansion}
            >
                <Suspense>
                    <TemplateList />
                </Suspense>
            </MokaCard>

            {/* 에디터 */}
            <MokaCardEditor className="mr-10 flex-fill" title="템플릿 편집" expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

            {/* 탭 */}
            <Switch>
                <Route
                    path={['/template', '/template/:templateSeq']}
                    exact
                    render={() => (
                        <MokaIconTabs
                            expansion={expansionState[2]}
                            onExpansion={handleTabExpansion}
                            tabWidth={412}
                            tabs={[
                                <Suspense>
                                    <TemplateEdit />
                                </Suspense>,
                            ]}
                            tabNavWidth={48}
                            tabNavPosition="right"
                            tabNavs={[
                                { title: '템플릿 정보', text: 'Info' },
                                { title: '페이지 검색', icon: <MokaIcon iconName="fal-file" /> },
                                { title: '본문스킨 검색', icon: <MokaIcon iconName="fal-file-alt" /> },
                                { title: '컨테이너 검색', icon: <MokaIcon iconName="fal-box" /> },
                                { title: '컴포넌트 검색', icon: <MokaIcon iconName="fal-ballot" /> },
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

export default Template;
