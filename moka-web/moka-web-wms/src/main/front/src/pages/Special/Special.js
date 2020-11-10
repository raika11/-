import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';

import { MokaCard } from '@components';

const SpecialList = React.lazy(() => import('./SpecialList'));

const Special = () => {
    return (
        <>
            <Helmet>
                <title>디지털스페셜관리</title>
                <meta name="description" content="디지털스페셜관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={1585} className="mr-gutter" titleClassName="mb-0" header={false}>
                <Suspense>
                    <SpecialList />
                </Suspense>
            </MokaCard>
        </>
    );
};

export default Special;
