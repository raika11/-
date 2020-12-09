import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLiveList, GET_LIVE_LIST } from '@store/bright';
import { MokaLoader } from '@components';

const LiveList = ({ show }) => {
    const dispatch = useDispatch();

    const { loading } = useSelector((store) => ({
        loading: store.loading[GET_LIVE_LIST],
        liveList: store.bright.live.list,
    }));

    useEffect(() => {
        if (show) {
            dispatch(getLiveList());
        }
    }, [dispatch, show]);

    return <div className="positive-relative h-100 w-100 px-3">{loading && <MokaLoader />}</div>;
};

export default LiveList;
