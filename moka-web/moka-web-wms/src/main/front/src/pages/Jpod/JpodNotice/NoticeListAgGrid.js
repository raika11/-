import React, { useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { columnDefs, testRows } from './NoticeListAgGridColumns';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { GET_CHANNELS } from '@store/jpod';

const NoticeListAgGrid = ({ match }) => {
    // const dispatch = useDispatch();
    const params = useParams();
    // 스토어 연결.
    const { search, loading } = useSelector((store) => ({
        search: store.jpod.channel.jpod.search,
        list: store.jpod.channel.jpod.list,
        total: store.jpod.channel.jpod.total,
        loading: store.loading[GET_CHANNELS],
    }));

    const history = useHistory();
    const [rowData, setRowData] = useState([]);

    // 목록 클릭 했을때.
    const handleClickListRow = ({ noticeSeq }) => {
        history.push(`${match.path}/${noticeSeq}`);
        // dispatch(clearChannelInfo());
        // dispatch(getChannelInfo({ chnlSeq: chnlSeq }));
        // dispatch(getChEpisodes({ chnlSeq: chnlSeq }));
    };

    // grid 에서 상태 변경시 리스트를 가지고 오기.
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        // dispatch(changeJpodSearchOption(temp));
        // dispatch(getChannels());
    };

    // useEffect(() => {
    //     setRowData([]);
    //     const inirGridRow = (data) => {
    //         setRowData(
    //             data.map((element) => {
    //                 let chnlSdt = element.chnlSdt && element.chnlSdt.length > 10 ? element.chnlSdt.substr(0, 10) : element.chnlSdt;
    //                 const totalEpsdCnt = element.totalEpsdCnt ? element.totalEpsdCnt : 0;
    //                 const lastEpsdNo = element.lastEpsdNo ? element.lastEpsdNo : 0;
    //                 return {
    //                     chnlSeq: element.chnlSeq,
    //                     chnlSdt: chnlSdt,
    //                     chnlThumb: element.chnlThumb,
    //                     chnlNm: element.chnlNm,
    //                     chnlMemo: element.chnlMemo,
    //                     usedYn: element.usedYn,
    //                     roundinfo: `${totalEpsdCnt}/${lastEpsdNo}`,
    //                     subscribe: ``,
    //                 };
    //             }),
    //         );
    //     };

    //     if (list.length > 0) {
    //         inirGridRow(list);
    //     }
    // }, [list]);

    useEffect(() => {
        setRowData([]);
        const inirGridRow = (data) => {
            setRowData(
                data.map((element) => {
                    // let chnlSdt = element.chnlSdt && element.chnlSdt.length > 10 ? element.chnlSdt.substr(0, 10) : element.chnlSdt;
                    return {
                        noticeSeq: element.noticeSeq,
                        chName: element.chName,
                        title: element.title,
                        regUser: element.regUser,
                        regDt: element.regDt,
                        viewCount: element.viewCount,
                    };
                }),
            );
        };

        inirGridRow(testRows);
    }, []);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={50}
            onRowNodeId={(data) => data.noticeSeq}
            onRowClicked={(e) => handleClickListRow(e)}
            loading={loading}
            total={testRows.length}
            page={0}
            size={0}
            displayPageNum={DISPLAY_PAGE_NUM}
            onChangeSearchOption={handleChangeSearchOption}
            selected={params.noticeSeq}
        />
    );
};

export default NoticeListAgGrid;
