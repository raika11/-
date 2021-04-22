import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './RelJpodAgGridColumns';
import { changeChnlSearchOption, getChnlList, GET_CHNL_LIST } from '@store/jpod';
import { GRID_ROW_HEIGHT } from '@/style_constants';

/**
 * J팟 검색 모달 AgGrid
 * 뉴스레터 구독 여부가 Y, 연계된 뉴스레터가 있는 J팟은 비활성화
 */
const RelJpodAgGrid = ({ setRowSelected }) => {
    const dispatch = useDispatch();
    const { search, list, total, channel } = useSelector(({ jpod }) => jpod.channel);
    const loading = useSelector(({ loading }) => loading[GET_CHNL_LIST]);
    const [gridInstance, setGridInstance] = useState(null);
    const [chnl, setChnl] = useState({});

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') temp['page'] = 0;
            dispatch(changeChnlSearchOption(temp));
            dispatch(getChnlList({ search: temp }));
        },
        [dispatch, search],
    );

    /**
     * 목록 Row클릭
     */
    const handleRowSelected = () => {
        setChnl(gridInstance.api.getSelectedRows());
    };

    useEffect(() => {
        if (chnl[0]) {
            setRowSelected(chnl[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chnl]);

    return (
        <MokaTable
            setGridInstance={setGridInstance}
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            headerHeight={GRID_ROW_HEIGHT.T[0]}
            rowHeight={GRID_ROW_HEIGHT.C[1]}
            onRowNodeId={(data) => data.chnlSeq}
            rowData={list}
            onRowSelected={handleRowSelected}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            selected={channel.chnlSeq}
        />
    );
};

export default RelJpodAgGrid;
