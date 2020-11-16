import React, { Suspense, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import { ITEM_DS } from '@/constants';
import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { useDispatch } from 'react-redux';
import { clearStore, deleteDataset, hasRelationList } from '@store/dataset';
import toast from '@utils/toastUtil';

const DatasetEdit = React.lazy(() => import('./DatasetEdit'));
const DatasetList = React.lazy(() => import('./DatasetList'));

// relations
const RelationInPageList = React.lazy(() => import('@pages/Page/components/RelationInPageList'));
const RelationInArticlePageList = React.lazy(() => import('@pages/ArticlePage/components/RelationInArticlePageList'));
const RelationInContainerList = React.lazy(() => import('@pages/Container/components/RelationInContainerList'));
const RelationInComponentList = React.lazy(() => import('@pages/Component/components/RelationInComponentList'));

const Dataset = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { dataset } = useSelector((store) => ({ dataset: store.dataset.dataset }));

    // state
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    const deleteCallback = (response) => {
        const { header, body, payload } = response;
        if (header.success) {
            if (!body) {
                dispatch(
                    deleteDataset({
                        datasetSeq: payload.datasetSeq,
                        callback: (response) => {
                            if (response.header.success) {
                                history.push('/dataset');
                            }
                            toast.result(response);
                        },
                    }),
                );
            } else {
                toast.result(response);
            }
        } else {
            toast.result(response);
        }
    };

    const handleClickDelete = (dataset) => {
        toast.confirm(
            `${dataset.datasetSeq}을(를) 정말 삭제 하시겠습니까?`,
            () => {
                dispatch(
                    hasRelationList({
                        datasetSeq: dataset.datasetSeq,
                        callback: deleteCallback,
                    }),
                );
            },
            () => {},
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

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
                    <DatasetList onDelete={handleClickDelete} />
                </Suspense>
            </MokaCard>

            <Switch>
                <Route
                    path={['/dataset', '/dataset/:datasetSeq']}
                    exact
                    render={() => (
                        <>
                            <Suspense>
                                <DatasetEdit onDelete={handleClickDelete} />
                            </Suspense>
                            <MokaIconTabs
                                foldable={false}
                                tabWidth={412}
                                onSelectNav={(idx) => setActiveTabIdx(idx)}
                                tabs={[
                                    <Suspense>
                                        <RelationInPageList show={activeTabIdx === 0} relSeqType={ITEM_DS} relSeq={dataset.datasetSeq} />
                                    </Suspense>,
                                    <Suspense>
                                        <RelationInArticlePageList show={activeTabIdx === 1} relSeqType={ITEM_DS} relSeq={dataset.datasetSeq} />
                                    </Suspense>,
                                    <Suspense>
                                        <RelationInContainerList show={activeTabIdx === 2} relSeqType={ITEM_DS} relSeq={dataset.datasetSeq} />
                                    </Suspense>,
                                    <Suspense>
                                        <RelationInComponentList show={activeTabIdx === 3} relSeqType={ITEM_DS} relSeq={dataset.datasetSeq} />
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                placement="left"
                                tabNavs={[
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-money-check" /> },
                                    { title: '관련 기사페이지', icon: <MokaIcon iconName="fal-file-alt" /> },
                                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-calculator" /> },
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
