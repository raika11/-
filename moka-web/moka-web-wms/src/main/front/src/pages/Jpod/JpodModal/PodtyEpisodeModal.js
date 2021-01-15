import React, { useEffect, useState } from 'react';
import { MokaModal, MokaTable } from '@components';
import { columnDefs } from './PodtyEpisodeModalGridColumns';
import { useSelector, useDispatch } from 'react-redux';
import { GET_PODTY_EPISODE_LIST, getPodtyEpisodeList, clearPodtyEpisode, selectPodtyEpisode, changePodtyEpisodeCastsrl } from '@store/jpod';

/**
 * 팟티 검색 모달.
 */
const PodtyEpisodeModal = (props) => {
    const dispatch = useDispatch();
    const { show, onHide, chnlseq } = props;
    const [rowData, setRowData] = useState([]);

    const { list, loading } = useSelector((store) => ({
        list: store.jpod.podtyEpisode.list,
        loading: store.loading[GET_PODTY_EPISODE_LIST],
    }));

    // 닫기 버튼
    const handleClickHide = () => {
        onHide();
    };

    // 목록 클릭 store 를 업데이트후 모달창 닫기.
    const handleClickListRow = ({ info }) => {
        dispatch(selectPodtyEpisode(info));
        onHide();
    };

    // store list 가 변경되면 grid 목록 업데이트.
    useEffect(() => {
        const initGridRow = (data) => {
            setRowData(
                data.map((element) => {
                    let crtDt = element.crtDt && element.crtDt.length > 10 ? element.crtDt.substr(0, 10) : element.crtDt;
                    return {
                        episodeSrl: element.episodeSrl,
                        title: element.title,
                        crtDt: crtDt,
                        castSrl: element.castSrl,
                        trackCnt: element.trackCnt,
                        author: element.author,
                        shareUrl: element.shareUrl,
                        info: element,
                    };
                }),
            );
        };

        if (list.length > 0) {
            initGridRow(list);
        }
    }, [list]);

    // 모달창이 열리면 팟티 목록 가져오고, 닫으면 목록 초기화.
    useEffect(() => {
        if (show === true) {
            dispatch(getPodtyEpisodeList());
        } else {
            dispatch(clearPodtyEpisode());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    // 에피소드 정보에서 채널 선택해서 스토어 변경되면 Castsrl 값 설정.
    useEffect(() => {
        if (chnlseq) {
            dispatch(changePodtyEpisodeCastsrl(chnlseq));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chnlseq]);

    return (
        <MokaModal
            width={900}
            show={show}
            onHide={handleClickHide}
            title={`팟티 에피소드 리스트`}
            size="xl"
            bodyClassName="overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            buttons={[{ text: '닫기', variant: 'negative', onClick: handleClickHide }]}
            draggable
        >
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                rowHeight={50}
                onRowNodeId={(data) => data.castSrl}
                onRowClicked={(e) => handleClickListRow(e)}
                loading={loading}
                paging={false}
                preventRowClickCell={['shareUrl']}
            />
        </MokaModal>
    );
};

export default PodtyEpisodeModal;
