import React, { useState, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';

const ComponentList = React.lazy(() => import('./ComponentList'));
const ComponentEdit = React.lazy(() => import('./ComponentEdit'));

/**
 * 컴포넌트 관리
 */
const Component = () => {
    const dispatch = useDispatch();
    const [openTabIdx, setOpenTabIdx] = useState(0);

    React.useEffect(() => {
        return () => {
            // dispatch(clearStore());
            // dispatch(clearRelationList());
            // dispatch(clearHistory());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>컴포넌트관리</title>
                <meta name="description" content="컴포넌트관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={412} className="mr-10" titleClassName="mb-0" title="컴포넌트 검색">
                <Suspense>
                    <ComponentList />
                </Suspense>
            </MokaCard>

            <Switch>
                <Route
                    path={['/component', '/component/:componentSeq']}
                    exact
                    render={() => (
                        <>
                            {/* 등록/수정 */}
                            <ComponentEdit />

                            {/* 탭 */}
                            <MokaIconTabs
                                onSelectNav={(idx) => setOpenTabIdx(idx)}
                                tabWidth={412}
                                // tabs={[
                                //     <Suspense>
                                //         <TemplateEdit show={openTabIdx === '0'} />
                                //     </Suspense>,
                                //     <Suspense>
                                //         <TemplatePageList show={openTabIdx === '1'} />
                                //     </Suspense>,
                                //     <Suspense>
                                //         <TemplateSkinList show={openTabIdx === '2'} />
                                //     </Suspense>,
                                //     <Suspense>
                                //         <TemplateContainerList show={openTabIdx === '3'} />
                                //     </Suspense>,
                                //     <Suspense>
                                //         <TemplateComponentList show={openTabIdx === '4'} />
                                //     </Suspense>,
                                //     <Suspense>
                                //         <TemplateHistoryList show={openTabIdx === '5'} />
                                //     </Suspense>,
                                // ]}
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

export default Component;
