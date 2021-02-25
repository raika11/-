import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@/components';
import columnDefs from './JaJopanAgGridColumns';
import { GET_JOPAN_LIST, changeJopanSearchOption, getJopanList, changeJopan } from '@/store/rcvArticle';

const JaJopanAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const total = useSelector((store) => store.rcvArticle.jopanTotal);
    const list = useSelector((store) => store.rcvArticle.jopanList);
    const search = useSelector((store) => store.rcvArticle.jopanSearch);
    const loading = useSelector((store) => store.loading[GET_JOPAN_LIST]);

    const [rowData, setRowdata] = useState([]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeJopanSearchOption(temp));
            dispatch(getJopanList({ search: temp }));
        },
        [dispatch, search],
    );

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    /**
     * 보기 버튼 클릭
     */
    const handleClickShow = useCallback(
        (data) => {
            history.push(`${match.path}/${data.seq}`);
            dispatch(changeJopan(data));
        },
        [dispatch, history, match.path],
    );

    useEffect(() => {
        setRowdata(
            list.map((l, idx) => ({
                ...l,
                seq: search.size * search.page + idx + 1,
                onClick: handleClickShow,
            })),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list, search.page, search.size]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(data) => data.seq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            // selected={episodeInfo.epsdSeq}
            preventRowClickCell={['show']}
        />
    );
};

export default JaJopanAgGrid;
