import React, { useState, Suspense } from 'react';
import produce from 'immer';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { clearStore, clearHistroy, clearRelationList } from '@store/template';

import TemplateEditor from './TemplateEditor';
const TemplateList = React.lazy(() => import('./TemplateList'));
const TemplateEdit = React.lazy(() => import('./TemplateEdit'));

// relations
const TemplatePageList = React.lazy(() => import('./relations/TemplatePageList'));
const TemplateSkinList = React.lazy(() => import('./relations/TemplateSkinList'));
const TemplateContainerList = React.lazy(() => import('./relations/TemplateContainerList'));
const TemplateComponentList = React.lazy(() => import('./relations/TemplateComponentList'));
const TemplateHistoryList = React.lazy(() => import('./relations/TemplateHistoryList'));

/**
 * 템플릿 관리
 */
const Template = () => {
    const dispatch = useDispatch();
    const [expansionState, setExpansionState] = useState([true, false, true]);
    const [openTabIdx, setOpenTabIdx] = useState(0);

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
            dispatch(clearHistroy());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>템플릿관리</title>
                <meta name="description" content="템플릿관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={412} className="mr-10" titleClassName="mb-0" title="템플릿 검색" expansion={expansionState[0]} onExpansion={handleListExpansion} foldable>
                <Suspense>
                    <TemplateList />
                </Suspense>
            </MokaCard>

            <Switch>
                <Route
                    path={['/template', '/template/:templateSeq']}
                    exact
                    render={() => (
                        <>
                            {/* 에디터 */}
                            <TemplateEditor expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

                            {/* 탭 */}
                            <MokaIconTabs
                                expansion={expansionState[2]}
                                onExpansion={handleTabExpansion}
                                onSelectNav={(idx) => setOpenTabIdx(idx)}
                                tabWidth={412}
                                tabs={[
                                    <Suspense>
                                        <TemplateEdit show={openTabIdx === '0'} />
                                    </Suspense>,
                                    <Suspense>
                                        <TemplatePageList show={openTabIdx === '1'} />
                                    </Suspense>,
                                    <Suspense>
                                        <TemplateSkinList show={openTabIdx === '2'} />
                                    </Suspense>,
                                    <Suspense>
                                        <TemplateContainerList show={openTabIdx === '3'} />
                                    </Suspense>,
                                    <Suspense>
                                        <TemplateComponentList show={openTabIdx === '4'} />
                                    </Suspense>,
                                    <Suspense>
                                        <TemplateHistoryList show={openTabIdx === '5'} />
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                tabNavPosition="right"
                                tabNavs={[
                                    { title: '템플릿 정보', text: 'Info' },
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-file" /> },
                                    { title: '관련 뷰스킨', icon: <MokaIcon iconName="fal-file-alt" /> },
                                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-box" /> },
                                    { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
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

export default Template;
