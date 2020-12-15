import React, { useState, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import SpecialEdit from './SpecialEdit';
const SpecialList = React.lazy(() => import('./SpecialList'));

/**
 * 디지털 스페셜 관리
 */
const Special = ({ match }) => {
    const [show, setShow] = useState(false);

    const handleClickSave = () => {};

    const handleRowClicked = (row) => {
        setShow(true);
    };

    return (
        <div className="d-flex">
            <Helmet>
                <title>디지털 스페셜 관리</title>
                <meta name="description" content="디지털 스페셜 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={840} className="mr-gutter" titleClassName="mb-0" header={false}>
                <Suspense>
                    <SpecialList onRowClicked={handleRowClicked} />
                </Suspense>
            </MokaCard>

            {/* 등록/수정 */}
            <Route path={[`${match.url}/add`, `${match.url}/:seqNo`]}>
                <SpecialEdit show={show} onSave={handleClickSave} />
            </Route>
        </div>
    );
};

export default Special;
