import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GRID_ROW_HEIGHT } from '@/style_constants';
import { messageBox } from '@utils/toastUtil';
import { GET_PODTY_EPSD_LIST, getPodtyEpsdList, clearPodtyEpsd } from '@store/jpod';
import { MokaModal, MokaTable } from '@components';
import { columnDefs } from './PodtyEpisodeModalColumns';

/**
 * J팟 관리 > 에피소드 > 팟티 목록 모달
 */
const PodtyEpisodeModal = (props) => {
    const { show, onHide, onRowClicked, castSrl } = props;
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const list = useSelector(({ jpod }) => jpod.episode.podty.list);
    const loading = useSelector(({ loading }) => loading[GET_PODTY_EPSD_LIST]);

    /**
     * row 클릭
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
    }, [list]);

    useEffect(() => {
        if (show) {
            dispatch(
                getPodtyEpsdList({
                    castSrl,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearPodtyEpsd());
        }
    }, [castSrl, dispatch, show]);

    return (
        <MokaModal
            size="lg"
            width={750}
            show={show}
            onHide={onHide}
            title="팟티 에피소드 리스트"
            bodyClassName="overflow-y-hidden custom-scroll"
            buttons={[{ text: '닫기', variant: 'negative', onClick: onHide }]}
            centered
        >
            <MokaTable
                agGridHeight={450}
                columnDefs={columnDefs}
                rowData={rowData}
                headerHeight={GRID_ROW_HEIGHT.T[0]}
                rowHeight={GRID_ROW_HEIGHT.C[1]}
                onRowNodeId={(data) => data.episodeSrl}
                onRowClicked={handleRowClicked}
                loading={loading}
                paging={false}
                preventRowClickCell={['move']}
            />
        </MokaModal>
    );
};

export default PodtyEpisodeModal;
