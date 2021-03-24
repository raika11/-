import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import moment from 'moment';
import { MokaTable } from '@components';
import { BASIC_DATEFORMAT, DISPLAY_PAGE_NUM } from '@/constants';
import columnDefs from './NoticeListAgGridColumns';
import { GET_JPOD_NOTICE, getBoardContents, changeJpodNoticeSearchOption, getJpodNotice } from '@store/jpod';

/**
 * J팟 관리 - 공지 게시판 AgGrid
 */
const NoticeListAgGrid = ({ match }) => {
    const { boardSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    // 스토어 연결
    const { search, list, total, channelList, loading } = useSelector(
        (store) => ({
            search: store.jpod.jpodNotice.jpodNotices.search,
            list: store.jpod.jpodNotice.jpodNotices.list,
            total: store.jpod.jpodNotice.jpodNotices.total,
            channelList: store.jpod.jpodNotice.channelList,
            loading: store.loading[GET_JPOD_NOTICE],
        }),
        shallowEqual,
    );
    const [rowData, setRowData] = useState([]);

    /**
     * 목록 클릭
     */
    const handleClickListRow = ({ boardSeq }) => {
        history.push(`${match.path}/${boardSeq}`);
    };

    /**
     * 검색 옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(changeJpodNoticeSearchOption(temp));
        dispatch(getJpodNotice());
    };

    useEffect(() => {
        if (channelList.length > 0) {
            // j팟 채널 id 값으로 name 조회
            let targetIndex = (id) => channelList.findIndex((c) => c.value === id);

            setRowData(
                list.map((data) => ({
                    ...data,
                    regDt: data.regDt && moment(data.regDt).format(BASIC_DATEFORMAT),
                    regInfo: `${data.regName}(${data.regId})`,
                    chnlNm: channelList[targetIndex(data.channelId)]?.name,
                })),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={40}
            onRowNodeId={(row) => row.boardSeq}
            onRowClicked={handleClickListRow}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            displayPageNum={DISPLAY_PAGE_NUM}
            onChangeSearchOption={handleChangeSearchOption}
            selected={boardSeq}
        />
    );
};

export default NoticeListAgGrid;
