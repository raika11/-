import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { MokaTable } from '@components';
import { BASIC_DATEFORMAT, DISPLAY_PAGE_NUM } from '@/constants';
import { columnDefs } from './NoticeListAgGridColumns';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { GET_JPOD_NOTICE, getBoardContents, changeJpodNoticeSearchOption, getJpodNotice } from '@store/jpod';

/**
 * J팟 관리 - 공지 게시판 AgGrid
 */
const NoticeListAgGrid = ({ match }) => {
    const params = useParams();
    const dispatch = useDispatch();
    const selectBoardId = useRef(null);
    const selectBoardSeq = useRef(null);
    console.log(params);

    // 스토어 연결.
    const { search, loading, list, total } = useSelector((store) => ({
        search: store.jpod.jpodNotice.jpodNotices.search,
        list: store.jpod.jpodNotice.jpodNotices.list,
        total: store.jpod.jpodNotice.jpodNotices.total,
        loading: store.loading[GET_JPOD_NOTICE],
    }));

    const history = useHistory();
    const [rowData, setRowData] = useState([]);

    // 목록 클릭 했을때.
    const handleClickListRow = ({ boardId, boardSeq }) => {
        // 로딩이 끝났을 경우만 데이터를 가지고 올수 있게.
        history.push(`${match.path}/${boardId}/${boardSeq}`);
        dispatch(getBoardContents({ boardId: boardId, boardSeq: boardSeq }));
    };

    // grid 에서 상태 변경시 리스트를 가지고 오기.
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(changeJpodNoticeSearchOption(temp));
        dispatch(getJpodNotice());
    };

    // url 이 변경 되었을 경우 처리. ( 에피소드 고유 번호 및 add )
    useEffect(() => {
        if (!isNaN(params.boardId) && selectBoardId.current !== params.boardId) {
            selectBoardId.current = params.boardId;
        }

        if (!isNaN(params.boardSeq) && selectBoardSeq.current !== params.boardSeq) {
            selectBoardSeq.current = params.boardSeq;
        } else if (history.location.pathname === `${match.path}/add` && selectBoardSeq.current !== 'add') {
            selectBoardSeq.current = 'add';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    useEffect(() => {
        // 최초 로딩시에만 게시판 정보가 있으면 정보 가지고 오기.
        if (params.boardId && params.boardSeq) {
            dispatch(getBoardContents({ boardId: params.boardId, boardSeq: params.boardSeq }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(list);
        setRowData(
            list.map((element) => {
                return {
                    ...list,
                    regDt: element.regDt && moment(element.regDt).format(BASIC_DATEFORMAT),
                    chName: element.boardInfo.boardName,
                    chnlNm: element.jpodChannel ? element.jpodChannel.chnlNm : '',
                };
            }),
        );
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={40}
            onRowNodeId={(data) => data.boardSeq}
            onRowClicked={(e) => handleClickListRow(e)}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            displayPageNum={DISPLAY_PAGE_NUM}
            onChangeSearchOption={handleChangeSearchOption}
            selected={params.boardSeq}
        />
    );
};

export default NoticeListAgGrid;
