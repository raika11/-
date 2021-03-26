import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import moment from 'moment';
import { MokaTable } from '@components';
import { BASIC_DATEFORMAT } from '@/constants';
import columnDefs from './NoticeListAgGridColumns';
import { GET_JPOD_NOTICE_LIST, changeJpodNoticeSearchOption, getJpodNoticeList } from '@store/jpod';

/**
 * J팟 관리 - 공지 게시판 AgGrid
 */
const NoticeListAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    // 스토어 연결
    const { search, list, total, channelList, contents, reply, loading } = useSelector(
        (store) => ({
            search: store.jpod.jpodNotice.search,
            list: store.jpod.jpodNotice.list,
            total: store.jpod.jpodNotice.total,
            channelList: store.jpod.jpodNotice.channelList,
            contents: store.jpod.jpodNotice.contents,
            reply: store.jpod.jpodNotice.reply,
            loading: store.loading[GET_JPOD_NOTICE_LIST],
        }),
        shallowEqual,
    );
    const [rowData, setRowData] = useState([]);

    /**
     * 목록 클릭
     */
    const handleClickRow = ({ boardSeq, parentBoardSeq }) => {
        if (parentBoardSeq !== boardSeq) {
            history.push(`${match.path}/${parentBoardSeq}/reply/${boardSeq}`);
        } else {
            history.push(`${match.path}/${boardSeq}`);
        }
    };

    /**
     * 검색 옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getJpodNoticeList(changeJpodNoticeSearchOption(temp)));
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
            onRowClicked={handleClickRow}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            selected={contents.boardSeq || reply.boardSeq}
        />
    );
};

export default NoticeListAgGrid;
