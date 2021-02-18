import React, { useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { columnDefs } from './NoticeListAgGridColumns';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { GET_BOARD_CONTENTS_LIST } from '@store/jpod';

const NoticeListAgGrid = ({ match }) => {
    // const dispatch = useDispatch();
    const params = useParams();
    // 스토어 연결.
    const { search, loading, list, total } = useSelector((store) => ({
        search: store.jpod.jpodBoard.jpodBoards.search,
        list: store.jpod.jpodBoard.jpodBoards.list,
        total: store.jpod.jpodBoard.jpodBoards.total,
        loading: store.loading[GET_BOARD_CONTENTS_LIST],
    }));

    const history = useHistory();
    const [rowData, setRowData] = useState([]);

    // 목록 클릭 했을때.
    const handleClickListRow = ({ boardSeq }) => {
        history.push(`${match.path}/${boardSeq}`);
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
                    let regDt = element.regDt && element.regDt.length > 10 ? element.regDt.substr(0, 10) : element.regDt;
                    return {
                        boardSeq: element.boardSeq,
                        chName: element.boardInfo.boardName,
                        title: element.title,
                        regName: element.regName,
                        regDt: regDt,
                        viewCnt: element.viewCnt,
                    };
                }),
            );
        };

        inirGridRow(list);
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={50}
            onRowNodeId={(data) => data.boardSeq}
            onRowClicked={(e) => handleClickListRow(e)}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            displayPageNum={DISPLAY_PAGE_NUM}
            onChangeSearchOption={handleChangeSearchOption}
            selected={params.noticeSeq}
        />
    );
};

export default NoticeListAgGrid;
