import React, { useCallback } from 'react';
import { MokaTable } from '@components';
import { columnDefs } from './EpisodeListAgGridColumns';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelectArticleList } from '@store/survey/quiz';
import { GET_EPISODES, changeEpisodesSearchOption, getEpisodes, clearEpisodeInfo, getEpisodesInfo } from '@store/jpod';

/**
 * J팟 관리 - 에피소드 AgGrid
 */
const EpisodeListAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const params = useParams();
    const history = useHistory();
    // 스토어 연결.
    const total = useSelector((store) => store.jpod.episode.episodes.total);
    const search = useSelector((store) => store.jpod.episode.episodes.search);
    const list = useSelector((store) => store.jpod.episode.episodes.list);
    const loading = useSelector((store) => store.loading[GET_EPISODES]);

    const selectArticleItem = useSelector((store) => store.quiz.selectArticle.item);
    const selectArticleList = useSelector((store) => store.quiz.selectArticle.list);

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
            dispatch(changeEpisodesSearchOption(temp));
            dispatch(getEpisodes());
        },
        [dispatch, search],
    );

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={list}
            rowHeight={80}
            onRowNodeId={(data) => data.epsdSeq}
            onRowClicked={handleClickListRow}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            selected={params.epsdSeq}
        />
    );
};

export default EpisodeListAgGrid;
