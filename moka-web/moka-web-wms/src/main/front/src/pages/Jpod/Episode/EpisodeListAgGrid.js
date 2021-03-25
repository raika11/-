import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@components';
import { columnDefs } from './EpisodeListAgGridColumns';
import { GET_EPSD_LIST, changeEpsdSearchOption, getEpsdList } from '@store/jpod';

/**
 * J팟 관리 > 에피소드 > AgGrid
 */
const EpisodeListAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector(({ loading }) => loading[GET_EPSD_LIST]);
    const { total, search, list, episode } = useSelector(({ jpod }) => jpod.episode);
    const [rowData, setRowData] = useState([]);

    /**
     * row 클릭
     */
    const handleRowClicked = ({ chnlSeq, epsdSeq }) => history.push(`${match.path}/${chnlSeq}/${epsdSeq}`);

    /**
     * 테이블 검색 옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') temp['page'] = 0;
            dispatch(changeEpsdSearchOption(temp));
            dispatch(getEpsdList({ search: temp }));
        },
        [dispatch, search],
    );

    useEffect(() => {
        setRowData(
            list.map((li) => ({
                ...li,
                seasonNo: `시즌${li.seasonNo > 0 ? li.seasonNo : ''}`,
                playTime: (li.playTime || '').slice(0, 5),
            })),
        );
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(data) => data.epsdSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            selected={episode.epsdSeq}
        />
    );
};

export default EpisodeListAgGrid;
