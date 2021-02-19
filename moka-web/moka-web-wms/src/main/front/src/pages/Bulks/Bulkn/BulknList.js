import React from 'react';
import PropTypes from 'prop-types';
import { MokaCard } from '@components';
import { BulknListSearchBox, BulknListGrid } from './Component';

const propTypes = {
    HandleEditEnable: PropTypes.func,
    bulksURL: PropTypes.string,
};
const defaultProps = {};

const BulknList = (props) => {
    // search box 등록 버튼 클릭시 상위 상태 전달.
    const handleEditEnable = () => {
        props.HandleEditEnable();
    };

    return (
        <>
            <MokaCard title="네이버 벌크 문구" titleClassName="mb-0" width={870} loading={null} className="mr-gutter">
                <BulknListSearchBox HandleEditEnable={handleEditEnable} />
                <BulknListGrid bulksURL={props.bulksURL} HandleEditEnable={handleEditEnable} />
            </MokaCard>
        </>
    );
};

BulknList.propTypes = propTypes;
BulknList.defaultProps = defaultProps;

export default BulknList;
