import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { messageBox } from '@utils/toastUtil';
import { GET_PODTY_CHNL_LIST, getPodtyChnlList, clearPodtyChnl } from '@store/jpod';
import { MokaModal, MokaTable } from '@components';
import { columnDefs } from './PodtyChannelModalColumns';

/**
 * J팟 관리 > 채널 > 팟티 목록 모달
 */
const PodtyChannelModal = (props) => {
    const { show, onHide, onRowClicked } = props;
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const list = useSelector(({ jpod }) => jpod.channel.podty.list);
    const loading = useSelector(({ loading }) => loading[GET_PODTY_CHNL_LIST]);

    /**
     * 닫기
     */
    const handleHide = () => {
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
                    onClick: (row) => {
                        window.open(row.shareUrl);
                    },
                };
            }),
        );
    }, [list, onRowClicked]);

    useEffect(() => {
        if (show) {
            dispatch(
                getPodtyChnlList({
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearPodtyChnl());
        }
    }, [dispatch, show]);

    return (
        <MokaModal
            width={750}
            show={show}
            onHide={handleHide}
            title="팟티 채널 리스트"
            size="lg"
            bodyClassName="overflow-x-hidden custom-scroll"
            buttons={[{ text: '닫기', variant: 'negative', onClick: handleHide }]}
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
                preventRowClickCell={['이동']}
            />
        </MokaModal>
    );
};

export default PodtyChannelModal;
