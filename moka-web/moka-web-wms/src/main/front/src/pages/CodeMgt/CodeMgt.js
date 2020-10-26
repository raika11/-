import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';

const CodeMgtList = React.lazy(() => import('./CodeMgtList'));
const CodeMgtEdit = React.lazy(() => import('./CodeMgtEdit'));

/**
 * 기타코드 관리 컴포넌트
 */
const CodeMgt = () => {
    return (
        <>
            <div className="d-flex">
                <Helmet>
                    <title>기타코드관리</title>
                    <meta name="description" content="기타코드관리페이지입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 기타코드 리스트 */}
                <MokaCard width={228} className="mr-10" titleClassName="mb-0">
                    <Suspense>
                        <CodeMgtList />
                    </Suspense>
                </MokaCard>

                {/* 기타코드 코드 */}
                <MokaCard width={1452} titleClassName="mb-0">
                    <Suspense>
                        <CodeMgtEdit />
                    </Suspense>
                </MokaCard>
            </div>
        </>
    );
};

export default CodeMgt;
