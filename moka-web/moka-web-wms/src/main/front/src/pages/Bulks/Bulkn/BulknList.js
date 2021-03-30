import React from 'react';
import PropTypes from 'prop-types';
import { MokaCard } from '@components';
import { BulknListSearchBox, BulknListGrid } from './components';

const propTypes = {
    HandleEditEnable: PropTypes.func,
    bulksURL: PropTypes.string,
};
const defaultProps = {};

/**
 * 네이버 벌크 문구 > 네이버 벌크 목록
 */
const BulknList = (props) => {
    /**
     * 등록
     */
    const handleEditEnable = () => {
        props.HandleEditEnable();
    };

    return (
        <MokaCard title="네이버 벌크 문구" width={870} className="mr-gutter h-100" bodyClassName="d-flex flex-column">
            <BulknListSearchBox HandleEditEnable={handleEditEnable} />
            <BulknListGrid bulksURL={props.bulksURL} HandleEditEnable={handleEditEnable} />
        </MokaCard>
    );
};

BulknList.propTypes = propTypes;
BulknList.defaultProps = defaultProps;

export default BulknList;
