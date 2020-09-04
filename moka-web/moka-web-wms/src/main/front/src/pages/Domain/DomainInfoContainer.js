import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { WmsCard } from '~/components';
import { changeLatestMediaId } from '~/stores/auth/authStore';
import { getDomain, clearDomain } from '~/stores/domain/domainStore';
import DomainForm from './components/DomainForm';

/**
 * 도메인 Info 컨테이너
 */
const DomainInfoContainer = () => {
    const { domainId } = useParams();
    const { detail, latestMediaId, loading } = useSelector((store) => ({
        detail: store.domainStore.detail,
        latestMediaId: store.authStore.latestMediaId,
        loading:
            store.loadingStore['domainStore/DELETE_DOMAIN'] ||
            store.loadingStore['domainStore/SAVE_DOMAIN']
    }));
    const dispatch = useDispatch();
    const [mediaCnt, setMediaCnt] = useState(0);
    const [title, setTitle] = useState('도메인 정보');

    useEffect(() => {
        /**
         * 파라미터 domainId가 있는데 데이터가 없을 경우 로드,
         * 파라미터가 없는데 데이터가 있을 경우 데이터 clear
         */
        if (domainId && domainId !== detail.domainId && !loading) {
            dispatch(getDomain(domainId));
        } else if (!domainId && detail.domainId && !loading) {
            dispatch(clearDomain({ detail: true }));
        }
    }, [domainId, dispatch, detail, loading]);

    useEffect(() => {
        /**
         * 로드한 데이터로 미디어아이디, 도메인아이디 셋팅
         */
        if (mediaCnt < 1) {
            if (detail.domainId && latestMediaId !== detail.mediaId) {
                dispatch(
                    changeLatestMediaId({
                        mediaId: detail.mediaId,
                        domainId: detail.domainId
                    })
                );
            }
            setMediaCnt(mediaCnt + 1);
        }
    }, [mediaCnt, latestMediaId, dispatch, detail]);

    useEffect(() => {
        let id = detail.domainId;
        let name = detail.domainName;

        if (id && name) {
            setTitle(`도메인 정보 (${id}_${name})`);
        } else {
            setTitle('도메인 정보');
        }
    }, [detail]);

    return (
        <WmsCard title={title} loading={loading}>
            <DomainForm />
        </WmsCard>
    );
};

export default DomainInfoContainer;
