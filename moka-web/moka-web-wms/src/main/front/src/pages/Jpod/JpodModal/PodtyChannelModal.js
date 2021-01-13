import React, { useEffect, useState } from 'react';
import { MokaModal, MokaTable } from '@components';
import { columnDefs } from './PodtyChannelModalGridColumns';
import { useSelector, useDispatch } from 'react-redux';
import { GET_CHANNEL_PODTY_LIST, getChannelPodtyList, clearChannelPodty, selectChannelPodty } from '@store/jpod';

/**
 * 팟티 검색 모달.
 */
const PodtyChannelModal = (props) => {
    const dispatch = useDispatch();
    const { show, onHide } = props;
    const [rowData, setRowData] = useState([]);

    const { list, loading } = useSelector((store) => ({
        list: store.jpod.channel.podty.list,
        loading: store.loading[GET_CHANNEL_PODTY_LIST],
    }));

    // 닫기 버튼
    const handleClickHide = () => {
        onHide();
    };

    // 목록 클릭 store 를 업데이트후 모달창 닫기.
    const handleClickListRow = ({ info }) => {
        dispatch(selectChannelPodty(info));
        onHide();
    };

    // store list 가 변경되면 grid 목록 업데이트.
    useEffect(() => {
        const initGridRow = (data) => {
            setRowData(
                data.map((element) => {
                    let crtDt = element.crtDt && element.crtDt.length > 10 ? element.crtDt.substr(0, 10) : element.crtDt;
                    return {
                        castSrl: element.castSrl,
                        getCastName: element.getCastName,
                        crtDt: crtDt,
                        // castSrl: element.castSrl, // 채널번호
                        trackCnt: element.trackCnt,
                        simpodCategory: element.simpodCategory,
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

    // 모달창이 열리면 팟티 목록 가져오기.
    useEffect(() => {
        if (show === true) {
            dispatch(getChannelPodtyList());
        } else {
            dispatch(clearChannelPodty());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <MokaModal
            width={900}
            show={show}
            onHide={handleClickHide}
            title={`팟티 채널 리스트`}
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

export default PodtyChannelModal;
