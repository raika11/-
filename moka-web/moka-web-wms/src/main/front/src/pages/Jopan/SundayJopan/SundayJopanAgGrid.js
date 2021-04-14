import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './SundayJopanAgGridColumns';
import { GRID_ROW_HEIGHT } from '@/style_constants';
import { GET_JOPAN_LIST, changeJopanSearchOption, getJopanList, changeJopan } from '@/store/rcvArticle';

/**
 * 수신기사 > 중앙선데이 조판 AgGrid
 */
const SundayJopanAgGrid = ({ match, setView }) => {
    const dispatch = useDispatch();
    const pressCate61Rows = useSelector((store) => store.codeMgt.pressCate61Rows);
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
    const handleRowClicked = useCallback((row) => {}, []);

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
        if (pressCate61Rows) {
            setRowdata(
                list.map((l, idx) => {
                    let sectionName;
                    let findSectionIndex = pressCate61Rows.findIndex((s) => s.cdNmEtc1 === l.id.section);
                    if (findSectionIndex > -1) {
                        sectionName = pressCate61Rows[findSectionIndex].name;
                    } else {
                        sectionName = '';
                    }

                    return {
                        ...l,
                        seq: search.size * search.page + idx + 1,
                        sectionName: sectionName,
                        onClick: handleClickShow,
                    };
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pressCate61Rows, list, search.page, search.size]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            rowHeight={GRID_ROW_HEIGHT.C[0]}
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
