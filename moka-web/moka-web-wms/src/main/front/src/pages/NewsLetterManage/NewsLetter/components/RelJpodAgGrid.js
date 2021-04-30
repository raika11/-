import React, { useState, useEffect, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './RelJpodAgGridColumns';
import { changeChnlSearchOption, getChnlList, GET_CHNL_LIST } from '@store/jpod';

/**
 * J팟 검색 모달 AgGrid
 * 뉴스레터 구독 여부가 Y, 연계된 뉴스레터가 있는 J팟은 비활성화
 */
const RelJpodAgGrid = ({ onRowClicked, onHide }) => {
    const dispatch = useDispatch();
    const { search, list, total, channel } = useSelector(({ jpod }) => jpod.channel, shallowEqual);
    const letterChannelTypeList = useSelector(({ newsLetter }) => newsLetter.newsLetter.letterChannelTypeList);
    const loading = useSelector(({ loading }) => loading[GET_CHNL_LIST]);
    const [rowData, setRowData] = useState([]);

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
     * 등록 버튼
     * @param {object} data data
     */
    const handleRowClicked = useCallback(
        (data) => {
            if (onRowClicked) {
                onRowClicked(data);
                onHide();
            }
        },
        [onRowClicked, onHide],
    );

    useEffect(() => {
        setRowData(
            list.map((j) => ({
                ...j,
                letterYn: letterChannelTypeList.indexOf(j.chnlSeq) > -1 ? 'Y' : 'N',
                onClick: handleRowClicked,
            })),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list, handleRowClicked]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            onRowNodeId={(data) => data.chnlSeq}
            rowData={rowData}
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
