import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@components';
import { useSelector, useDispatch } from 'react-redux';
import { columnDefs } from './ChannelListAgGridColumns';
import { GET_CHNL_LIST, changeChnlSearchOption, getChnlList } from '@store/jpod';

/**
 * J팟관리 > 채널 > 목록
 */
const ChannelListAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector(({ loading }) => loading[GET_CHNL_LIST]);
    const { search, list, total, channel } = useSelector(({ jpod }) => jpod.channel);
    const [rowData, setRowData] = useState([]);

    /**
     * row 클릭
     */
    const handleRowClicked = ({ chnlSeq }) => history.push(`${match.path}/${chnlSeq}`);

    /**
     * 테이블 검색 옵션 변경
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

    useEffect(() => {
        setRowData(
            list.map((chnl) => {
                let chnlSdt = chnl.chnlSdt && chnl.chnlSdt.length > 10 ? chnl.chnlSdt.substr(0, 10) : chnl.chnlSdt;
                const totalEpsdCnt = chnl.usedCnt ? chnl.usedCnt : 0;
                const lastEpsdNo = chnl.unusedCnt ? chnl.unusedCnt : 0;
                return {
                    chnlSeq: chnl.chnlSeq,
                    chnlSdt: chnlSdt,
                    chnlThumb: chnl.chnlThumb,
                    chnlNm: chnl.chnlNm,
                    chnlMemo: chnl.chnlMemo,
                    usedYn: chnl.usedYn,
                    roundinfo: `${totalEpsdCnt}/${lastEpsdNo}`,
                    subscribe: 0,
                };
            }),
        );
    }, [list]);

    return (
        <MokaTable
            className="flex-fill overflow-hidden"
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={46}
            onRowNodeId={(data) => data.chnlSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            selected={channel.chnlSeq}
        />
    );
};

export default ChannelListAgGrid;
