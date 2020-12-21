import React, { useState, Suspense, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIcon, MokaLoader } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { ITEM_TP } from '@/constants';

const RcvArticleList = React.lazy(() => import('./RcvArticleList'));

/**
 * 수신 기사 전체
 */
const RcvArticle = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <div className="d-flex">
            <Helmet>
                <title>수신 기사 전체</title>
                <meta name="description" content="수신 기사 전체 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={850} className="mr-gutter" titleClassName="mb-0" bodyClassName="d-flex flex-column" header={false}>
                <Suspense>
                    <RcvArticleList />
                </Suspense>
            </MokaCard>

            {/* <Route
                path={[`${match.url}/:totalId`]}
                exact
                render={() => (
                    <React.Fragment>
                        <TemplateEditor expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

                        <Suspense>
                            <MokaIconTabs
                                expansion={expansionState[2]}
                                onExpansion={handleTabExpansion}
                                onSelectNav={(idx) => setActiveTabIdx(idx)}
                                tabWidth={412}
                                tabs={[
                                    <TemplateEdit show={activeTabIdx === 0} onDelete={handleClickDelete} />,
                                    <Suspense fallback={<MokaLoader />}>
                                        <RelationInPageList show={activeTabIdx === 1} relSeqType={ITEM_TP} relSeq={template.templateSeq} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <RelationInArticlePageList show={activeTabIdx === 2} relSeqType={ITEM_TP} relSeq={template.templateSeq} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <RelationInContainerList show={activeTabIdx === 3} relSeqType={ITEM_TP} relSeq={template.templateSeq} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <RelationInComponentList show={activeTabIdx === 4} relSeqType={ITEM_TP} relSeq={template.templateSeq} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <HistoryList show={activeTabIdx === 5} seqType={ITEM_TP} seq={template.templateSeq} onLoad={handleClickLoad} />
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                tabNavPosition="right"
                                tabNavs={[
                                    { title: '템플릿 정보', text: 'Info' },
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-money-check" /> },
                                    { title: '관련 기사페이지', icon: <MokaIcon iconName="fal-file-alt" /> },
                                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-calculator" /> },
                                    { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
                                    { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
                                ]}
                            />
                        </Suspense>
                    </React.Fragment>
                )}
            /> */}
        </div>
    );
};

export default RcvArticle;
