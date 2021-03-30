import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BulkPreviewModal } from './modals';
import BulknList from './BulknList';
import BulknEdit from './BulknEdit';

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

/**
 * 네이버 벌크 문구
 * 페이지 편집 하위 메뉴는 min-height 지정, h-100
 */
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
        <div className="d-flex h-100" style={{ minHeight: 817 }}>
            <Helmet>
                <title>네이버 벌크 문구 편집</title>
                <meta name="description" content="네이버벌크편집 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 창 */}
            <BulknList HandleEditEnable={handleEditEnable} bulksURL={bulksURL} />

            {/* 등록/수정창 */}
            <Route
                path={[`/${bulkPathName}/add`, `/${bulkPathName}/:bulkartSeq`]}
                exact
                render={(props) => <BulknEdit {...props} EditState={editState} HandleEditEnable={handleEditEnable} />}
            />

            {/* 미리 보기 모달창 */}
            <BulkPreviewModal />
        </div>
    );
};

Bulkn.prototype = protoTypes;
Bulkn.defaultProps = defaultProps;

export default Bulkn;
