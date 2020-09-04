import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { WmsCard } from '~/components';
// import { getDatset, postDomain, putDomain, deleteDomain } from '~/stores/datasetStore';
import { getDataset } from '~/stores/dataset/datasetStore';

const TestEditContainer = ({ history, match }) => {
    const paramSeq = Number(match.params.datasetSeq);
    const dispatch = useDispatch();
    const {
        orgDataset
        // orgError,
        // getLoading,
        // postLoading,
        // putLoading,
        // deleteLoading,
        // search
    } = useSelector(({ datasetStore, loadingStore, authStore }) => ({
        orgDataset: datasetStore.dataset
        // orgError: datasetStore.datasetError,
        // getLoading: loadingStore['dataset/GET_DATASET'],
        // postLoading: loadingStore['dataset/POST_DATASET'],
        // putLoading: loadingStore['dataset/PUT_DATASET'],
        // deleteLoading: loadingStore['dataset/DELETE_DATASET'],
        // search: datasetStore.search
    }));
    const [dataset, setDataset] = useState(null);

    // 정보 세팅
    useEffect(() => {
        setDataset(orgDataset);
    }, [orgDataset]);

    // 상세 조회
    useEffect(() => {
        // 수정 : url에서 Seq추출해서 조회
        if (paramSeq) {
            dispatch(getDataset({ datasetSeq: paramSeq }));
            // 등록 : 정보 초기화
        } else {
            // setDomain({
            //     ...initialDomain,
            //     mediaId: latestMediaId
            // });
        }
    }, [dispatch, paramSeq, history]);

    // 수정모드
    const updateMode = !!paramSeq;

    const title = updateMode
        ? `데이타셋편집 [${dataset && dataset.datasetSeq}_${dataset && dataset.datasetName}]`
        : '데이타셋편집';

    return <WmsCard title={title}>{dataset && dataset.datasetname}</WmsCard>;
};

export default withRouter(TestEditContainer);
