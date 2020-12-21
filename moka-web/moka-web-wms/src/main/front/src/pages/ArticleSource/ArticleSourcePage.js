import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@/components';

const ArticleSourceList = React.lazy(() => import('./ArticleSourceList'));
const ArticleSourceEdit = React.lazy(() => import('./ArticleSourceEdit'));

const ArticleSourcePage = () => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>수신 매체 관리</title>
                <meta name="description" content="수신매체관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={812} className="mr-gutter" titleClassName="mb-0" bodyClassName="d-flex flex-column">
                <Suspense>
                    <ArticleSourceList />
                </Suspense>
            </MokaCard>

            <MokaCard width={782} titleClassName="mb-0" title="매체 정보">
                <Suspense>
                    <ArticleSourceEdit />
                </Suspense>
            </MokaCard>
        </div>
    );
};

export default ArticleSourcePage;
