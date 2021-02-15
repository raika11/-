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
            <MokaCard titleClassName="mb-0" width={870} loading={null} header={false}>
                <BulknListSearchBox HandleEditEnable={handleEditEnable} />
                <BulknListGrid bulksURL={props.bulksURL} HandleEditEnable={handleEditEnable} />
            </MokaCard>
        </>
    );
};

BulknList.propTypes = propTypes;
BulknList.defaultProps = defaultProps;

export default BulknList;
