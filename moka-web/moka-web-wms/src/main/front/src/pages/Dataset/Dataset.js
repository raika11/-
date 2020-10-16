import React, { Suspense, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';

const DatasetEdit = React.lazy(() => import('./DatasetEdit'));
const DatasetList = React.lazy(() => import('./DatasetList'));

const Dataset = () => {
    const [tabExpansion, setTabExpansion] = useState(false);

    return (
        <div className="d-flex">
            <Helmet>
                <title>데이터셋관리</title>
                <meta name="description" content="데이터셋관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={412} className="mr-10" titleClassName="mb-0" title="데이터셋 검색">
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
                                expansion={tabExpansion}
                                onExpansion={(ex) => setTabExpansion(ex)}
                                tabWidth={412}
                                tabs={[<div>sss</div>]}
                                tabNavWidth={48}
                                tabNavPosition="left"
                                placement="right"
                                tabNavs={[
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-file" /> },
                                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-box" /> },
                                    { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
                                    { title: '관련 템플릿', icon: <MokaIcon iconName="fal-ballot" /> },
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

export default Dataset;
