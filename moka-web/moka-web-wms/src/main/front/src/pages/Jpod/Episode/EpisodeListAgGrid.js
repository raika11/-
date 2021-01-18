import React, { useEffect, useState, useCallback } from 'react';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { columnDefs } from './EpisodeListAgGridColumns';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {} from '@pages/Jpod/JpodConst';

import { GET_EPISODES, changeEpisodesSearchOption, getEpisodes, clearEpisodeInfo, getEpisodesInfo } from '@store/jpod';

const EpisodeListAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const params = useParams();
    const history = useHistory();
    const [rowData, setRowData] = useState([]);
    // 스토어 연결.
    const { search, list, loading, total } = useSelector((store) => ({
        search: store.jpod.episode.episodes.search,
        list: store.jpod.episode.episodes.list,
        total: store.jpod.episode.episodes.total,
        loading: store.loading[GET_EPISODES],
    }));
    // 목록 클릭 했을때.
    // const handleClickListRow = ({ epsdSeq }) => {
    const handleClickListRow = ({ chnlSeq, epsdSeq }) => {
        history.push(`${match.path}/${chnlSeq}/${epsdSeq}`);
        dispatch(clearEpisodeInfo());
        dispatch(getEpisodesInfo({ chnlSeq: chnlSeq, epsdSeq: epsdSeq }));
    };

    // grid 에서 상태 변경시 리스트를 가지고 오기.
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            setRowData([]);
            dispatch(changeEpisodesSearchOption(temp));
            dispatch(getEpisodes());
        },
        [dispatch, search],
    );

    useEffect(() => {
        const inirGridRow = (data) => {
            setRowData(
                data.map((element) => {
                    return {
                        epsdSeq: element.epsdSeq,
                        chnlSeq: element.chnlSeq,
                        podtyEpsdSrl: element.podtyEpsdSrl,
                        epsdNo: element.epsdNo,
                        chnlNm: element.chnlNm,
                        epsdNm: element.epsdNm,
                        epsdMemo: element.epsdMemo,
                        epsdDate: element.epsdDate,
                        playTime: element.playTime,
                    };
                }),
            );
        };

        if (list.length > 0) {
            inirGridRow(list);
        }
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={80}
            onRowNodeId={(data) => data.epsdSeq}
            onRowClicked={(e) => handleClickListRow(e)}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            displayPageNum={DISPLAY_PAGE_NUM}
            onChangeSearchOption={handleChangeSearchOption}
            selected={params.epsdSeq}
        />
    );
};

export default EpisodeListAgGrid;