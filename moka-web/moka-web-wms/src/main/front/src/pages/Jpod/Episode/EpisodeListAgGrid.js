import React, { useEffect, useState, useCallback } from 'react';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { columnDefs } from './EpisodeListAgGridColumns';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelectArticleList } from '@store/survey/quiz';

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

    const { selectArticleItem, selectArticleList } = useSelector((store) => ({
        selectArticleItem: store.quiz.selectArticle.item,
        selectArticleList: store.quiz.selectArticle.list,
    }));

    // 목록 클릭 했을때.
    const handleClickListRow = ({ chnlSeq, epsdSeq }) => {
        history.push(`${match.path}/${chnlSeq}/${epsdSeq}`);
        dispatch(clearSelectArticleList());
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

    // store 에피소드 목록이 변경 되었을때 그리드 데이터 설정.
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
                        usedYn: element.usedYn,
                    };
                }),
            );
        };

        if (list.length > 0) {
            setRowData([]);
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
