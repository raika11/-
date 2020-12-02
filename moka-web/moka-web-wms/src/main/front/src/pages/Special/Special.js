import React, { useState, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';

const SpecialList = React.lazy(() => import('./SpecialList'));
const SpecialEdit = React.lazy(() => import('./SpecialEdit'));

const Special = () => {
    const [show, setShow] = useState(false);

    const handleClickSave = () => {};

    const handleRowClicked = (row) => {
        setShow(true);
    };

    return (
        <div className="d-flex">
            <Helmet>
                <title>디지털스페셜관리</title>
                <meta name="description" content="디지털스페셜관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={840} className="mr-gutter" titleClassName="mb-0" header={false}>
                <Suspense>
                    <SpecialList onRowClicked={handleRowClicked} />
                </Suspense>
            </MokaCard>

            <Suspense>
                <SpecialEdit show={show} onSave={handleClickSave} />
            </Suspense>
        </div>
    );
};

export default Special;
