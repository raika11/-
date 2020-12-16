import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MokaCard } from '@components';
import { BulknListSearchBox, BulknListGrid } from './Component';
import { useDispatch } from 'react-redux';
import { getBulkList } from '@store/bulks';

const propTypes = {
    HandleEditEnable: PropTypes.func,
    bulksURL: PropTypes.string,
};
const defaultProps = {};

const BulknList = (props) => {
    const dispatch = useDispatch();

    // 로딩시 리스트를 가시고 오기.
    useEffect(() => {
        dispatch(getBulkList());
    }, [dispatch]);

    // search box 등록 버튼 클릭시 상위 상태 전달.
    const handleEditEnable = () => {
        props.HandleEditEnable();
    };

    return (
        <>
            <MokaCard titleClassName="mb-0" width={670} loading={null} header={false} className={'mr-gutter'}>
                <BulknListSearchBox HandleEditEnable={handleEditEnable} />
                <BulknListGrid bulksURL={props.bulksURL} HandleEditEnable={handleEditEnable} />
            </MokaCard>
        </>
    );
};

BulknList.propTypes = propTypes;
BulknList.defaultProps = defaultProps;

export default BulknList;
