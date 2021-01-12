import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaCard, MokaInputLabel, MokaInput } from '@components';
import { blockReason } from '@pages/CommentManage/CommentConst';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { columnDefs } from './PodtyChannelModalGridColumns';
import { tempChannelList } from '@pages/Jpod/JpodConst';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { GET_CHANNEL_PODTY_LIST, getChannelPodtyList, clearChannelPodty, selectChannelPodty } from '@store/jpod';

/**
 * ModalBody로 Input 한개 있는 Modal
 */
const PodtyChannelModal = (props) => {
    const dispatch = useDispatch();
    const { show, onHide, inputData, onSave, ModalUsage } = props;
    const [data, setData] = useState({ title: '', value: '', isInvalid: false });
    const [rowData, setRowData] = useState([]);

    const [tempValue, setTempValue] = useState(null);
    const tempEvent = (e) => {
        console.log(e);
    };

    const t_commentSeq = 121213;

    const { total, list, search, loading } = useSelector((store) => ({
        total: store.jpod.channel.podty.total,
        list: store.jpod.channel.podty.list,
        loading: store.loading[GET_CHANNEL_PODTY_LIST],
    }));

    /**
     * 닫기
     */
    const handleClickHide = () => {
        // setData({ title: '', value: '', isInvalid: false });
        onHide();
    };

    const invalidCheckCallback = (isInvalid) => {
        setData({ ...data, isInvalid });
    };

    /**
     * inputData 값 변경
     */
    useEffect(() => {
        setData(inputData);
    }, [inputData]);

    const handleClickListRow = ({ info }) => {
        dispatch(selectChannelPodty(info));
        onHide();
    };

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
