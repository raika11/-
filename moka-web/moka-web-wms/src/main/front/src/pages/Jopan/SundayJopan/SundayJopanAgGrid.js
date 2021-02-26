import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './SundayJopanAgGridColumns';
import { GET_JOPAN_LIST, changeJopanSearchOption, getJopanList, changeJopan } from '@/store/rcvArticle';

/**
 * 수신기사 > 중앙선데이 조판 AgGrid
 */
const SundayJopanAgGrid = ({ match, setView }) => {
    const dispatch = useDispatch();
    const total = useSelector((store) => store.rcvArticle.jopanTotal);
    const list = useSelector((store) => store.rcvArticle.jopanList);
    const search = useSelector((store) => store.rcvArticle.jopanSearch);
    const jopan = useSelector((store) => store.rcvArticle.jopan);
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
            setView(true);
            dispatch(changeJopan(data));
        },
        [dispatch, setView],
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
            selected={jopan.seq}
            preventRowClickCell={['show']}
        />
    );
};

export default SundayJopanAgGrid;
