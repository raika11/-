import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';

const DatasetEdit = React.lazy(() => import('./DatasetEdit'));
const DatasetList = React.lazy(() => import('./DatasetList'));

// relations
const DatasetPageList = React.lazy(() => import('./relations/DatasetPageList'));
const DatasetSkinList = React.lazy(() => import('./relations/DatasetSkinList'));
const DatasetContainerList = React.lazy(() => import('./relations/DatasetContainerList'));
const DatasetComponentList = React.lazy(() => import('./relations/DatasetComponentList'));

const Dataset = () => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>데이터셋관리</title>
                <meta name="description" content="데이터셋관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={412} className="mr-gutter" titleClassName="mb-0" title="데이터셋 검색">
                <Suspense>
                    <DatasetList />
                </Suspense>
            </MokaCard>

            <Switch>
                <Route
                    path={['/dataset', '/dataset/:datasetSeq']}
                    exact
                    render={() => (
                        <>
                            <Suspense>
                                <DatasetEdit />
                            </Suspense>
                            <MokaIconTabs
                                foldable={false}
                                tabWidth={412}
                                tabs={[
                                    <Suspense>
                                        <DatasetPageList />
                                    </Suspense>,
                                    <Suspense>
                                        <DatasetSkinList />
                                    </Suspense>,
                                    <Suspense>
                                        <DatasetContainerList />
                                    </Suspense>,
                                    <Suspense>
                                        <DatasetComponentList />
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                placement="left"
                                tabNavs={[
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-file" /> },
                                    { title: '관련 뷰스킨', icon: <MokaIcon iconName="fal-box" /> },
                                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-ballot" /> },
                                    { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
                                ]}
                            />
                        </>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Dataset;
