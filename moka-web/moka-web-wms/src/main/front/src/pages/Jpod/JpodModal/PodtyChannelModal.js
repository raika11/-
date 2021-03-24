import React, { useEffect, useState } from 'react';
import { MokaModal, MokaTable } from '@components';
import { columnDefs } from './PodtyChannelModalGridColumns';
import { useSelector, useDispatch } from 'react-redux';
import { GET_CHANNEL_PODTY_LIST, getChannelPodtyList, clearChannelPodty } from '@store/jpod';

/**
 * 팟티 검색 모달
 */
const PodtyChannelModal = (props) => {
    const { show, onHide, onRowClicked } = props;
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const list = useSelector(({ jpod }) => jpod.podtyChannel.list);
    const loading = useSelector(({ loading }) => loading[GET_CHANNEL_PODTY_LIST]);

    /**
     * 닫기
     */
    const handleClickHide = () => {
        onHide();
    };

    /**
     * row 클릭
     * @param {object} podty 팟티 데이터
     */
    const handleRowClicked = (podty) => {
        onRowClicked(podty);
        onHide();
    };

    useEffect(() => {
        setRowData(
            list.map((element) => {
                let crtDt = element.crtDt && element.crtDt.length > 10 ? element.crtDt.substr(0, 10) : element.crtDt;
                return {
                    ...element,
                    crtDt: crtDt,
                };
            }),
        );
    }, [list, onRowClicked]);

    useEffect(() => {
        if (show) {
            dispatch(getChannelPodtyList());
        } else {
            dispatch(clearChannelPodty());
        }
    }, [dispatch, show]);

    return (
        <MokaModal
            width={750}
            show={show}
            onHide={handleClickHide}
            title="팟티 채널 리스트"
            size="lg"
            bodyClassName="overflow-x-hidden custom-scroll"
            buttons={[{ text: '닫기', variant: 'negative', onClick: handleClickHide }]}
            centered
        >
            <MokaTable
                agGridHeight={450}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.castSrl}
                onRowClicked={handleRowClicked}
                loading={loading}
                paging={false}
                preventRowClickCell={['shareUrl']}
            />
        </MokaModal>
    );
};

export default PodtyChannelModal;
