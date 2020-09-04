import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { WmsCard } from '~/components';
import VolumeForm from './components/VolumeForm';
import { getVolume, clearVolume } from '~/stores/volume/volumeStore';

const VolumeInfoContainer = (props) => {
    const { classes } = props;
    const { volumeId } = useParams();
    const { detail, loading } = useSelector((store) => ({
        detail: store.volumeStore.detail,
        loading:
            store.loadingStore['volumeStore/DELETE_VOLUME'] ||
            store.loadingStore['volumeStore/SAVE_VOLUME']
    }));
    const dispatch = useDispatch();

    useEffect(() => {
        /**
         * volumeId가 있고 데이터가 없을 경우 로드,
         * 파라미터가 없고 데이터가 있을 경우 데이터 clear
         */
        if (volumeId && volumeId !== detail.volumeId && !loading) {
            dispatch(getVolume(volumeId));
        } else if (!volumeId && detail.volumeId && !loading) {
            dispatch(clearVolume({ detail: true }));
        }
    }, [volumeId, dispatch, detail, loading]);

    return (
        <WmsCard title="볼륨 정보" loading={loading}>
            <VolumeForm classes={classes} />
        </WmsCard>
    );
};

export default VolumeInfoContainer;
