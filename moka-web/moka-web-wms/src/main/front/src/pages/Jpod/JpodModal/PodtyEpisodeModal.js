import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MokaModal, MokaTable } from '@components';
import { columnDefs } from './PodtyEpisodeModalGridColumns';
import { GET_PODTY_EPISODE_LIST, getPodtyEpisodeList, selectPodtyEpisode, changePodtyEpisodeCastsrl } from '@store/jpod';

/**
 * 팟티 에피소드 검색 모달.
 */
const PodtyEpisodeModal = (props) => {
    const { show, onHide, podtyChnlSrl } = props;
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);

    const list = useSelector((store) => store.jpod.podtyEpisode.list);
    const loading = useSelector((store) => store.loading[GET_PODTY_EPISODE_LIST]);

    // 목록 클릭 store 를 업데이트후 모달창 닫기.
    const handleClickListRow = ({ info }) => {
        dispatch(selectPodtyEpisode(info));
        onHide();
    };

    // store list 가 변경되면 grid 목록 업데이트.
    useEffect(() => {
        setRowData(
            list.map((element) => {
                let crtDt = element.crtDt && element.crtDt.length > 10 ? element.crtDt.substr(0, 10) : element.crtDt;
                return {
                    ...element,
                    crtDt: crtDt,
                    podtyChnlSrl: podtyChnlSrl,
                    info: element,
                };
            }),
        );
    }, [list, podtyChnlSrl]);

    useEffect(() => {
        // 모달창이 열리면 팟티 목록 가져오고, 닫으면 목록 초기화.
        if (show) {
            dispatch(getPodtyEpisodeList());
        }
    }, [dispatch, show]);

    useEffect(() => {
        // 에피소드 정보에서 채널 선택해서 스토어 변경되면 Castsrl 값 설정.
        if (podtyChnlSrl) {
            dispatch(changePodtyEpisodeCastsrl(podtyChnlSrl));
        }
    }, [dispatch, podtyChnlSrl]);

    return (
        <MokaModal
            size="xl"
            width={1200}
            height={820}
            show={show}
            onHide={onHide}
            title={`팟티 에피소드 리스트`}
            bodyClassName="overflow-y-hidden h-100"
            footerClassName="d-flex justify-content-center"
            buttons={[{ text: '닫기', variant: 'negative', onClick: onHide }]}
            draggable
        >
            <MokaTable
                className="h-100"
                columnDefs={columnDefs}
                rowData={rowData}
                rowHeight={80}
                onRowNodeId={(data) => data.episodeSrl}
                onRowClicked={handleClickListRow}
                loading={loading}
                paging={false}
                preventRowClickCell={['shareUrl']}
            />
        </MokaModal>
    );
};

export default PodtyEpisodeModal;
