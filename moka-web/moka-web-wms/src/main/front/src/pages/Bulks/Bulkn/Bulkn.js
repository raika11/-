import React, { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { BulkPreviewModal } from './Modal';
import { useSelector } from 'react-redux';

const BulknMain = React.lazy(() => import('./BulknMain'));
const BulknList = React.lazy(() => import('./BulknList'));
const BulknEdit = React.lazy(() => import('./BulknEdit'));

const protoTypes = {
    bulksParams: PropTypes.object.isRequired,
};

const defaultProps = {
    bulksParams: {
        bulk_div: '',
        bulk_source: '',
    },
};

const initialData = {
    editState: 'disabled', // 에디트 상태. disabled | enable | clean
};
const Bulkn = ({ bulksParams, bulksURL }) => {
    const [editState, setEditState] = useState(initialData.editState);
    const { bulkPathName } = useSelector((store) => ({
        bulkPathName: store.bulks.bulkPathName,
    }));

    const handleEditEnable = () => {
        if (editState !== 'enable') {
            // 에디트 상태가 enable 이 아닐경우에만
            setEditState('enable');
        }
    };

    return (
        <div className="d-flex">
            <Helmet>
                <title>네이버 벌크 문구 편집</title>
                <meta name="description" content="네이버벌크편집 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 임시. */}
            <Switch>
                <Route path={[`/${bulkPathName}`, `/${bulkPathName}/:tempSeq`]} exact render={() => <BulknMain bulksParams={bulksParams} />} />
            </Switch>

            {/* 리스트 창 */}
            <Suspense>
                <BulknList HandleEditEnable={handleEditEnable} bulksURL={bulksURL} />
            </Suspense>

            {/* 등록/수정창 */}
            <Route
                path={[`/${bulkPathName}/add`, `/${bulkPathName}/:bulkartSeq`]}
                exact
                render={(props) => (
                    <Suspense>
                        <BulknEdit {...props} EditState={editState} HandleEditEnable={handleEditEnable} />
                    </Suspense>
                )}
            />

            {/* 미리 보기 모달창. */}
            <Suspense>
                <BulkPreviewModal />
            </Suspense>
        </div>
    );
};

Bulkn.prototype = protoTypes;
Bulkn.defaultProps = defaultProps;

export default Bulkn;
