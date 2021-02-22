import React, { useEffect, useState, useCallback } from 'react';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { columnDefs } from './ChannelListAgGridColumns';
import ImageRenderer from './ImageRenderer';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { GET_CHANNELS, changeJpodSearchOption, getChannels } from '@store/jpod';

const ChannelListAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const params = useParams();
    // 스토어 연결.
    const { search, list, loading, total } = useSelector((store) => ({
        search: store.jpod.channel.jpod.search,
        list: store.jpod.channel.jpod.list,
        total: store.jpod.channel.jpod.total,
        loading: store.loading[GET_CHANNELS],
    }));

    const history = useHistory();
    const [rowData, setRowData] = useState([]);

    // 목록 클릭 했을때.
    const handleClickListRow = ({ chnlSeq }) => {
        history.push(`${match.path}/${chnlSeq}`);
        // dispatch(clearChannelInfo());
        // dispatch(getChannelInfo({ chnlSeq: chnlSeq }));
        // dispatch(getChEpisodes({ chnlSeq: chnlSeq }));
    };

    // grid 에서 상태 변경시 리스트를 가지고 오기.
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeJpodSearchOption(temp));
            dispatch(getChannels());
        },
        [dispatch, search],
    );

    useEffect(() => {
        setRowData([]);
        const initGridRow = (data) => {
            setRowData(
                data.map((element) => {
                    let chnlSdt = element.chnlSdt && element.chnlSdt.length > 10 ? element.chnlSdt.substr(0, 10) : element.chnlSdt;
                    const totalEpsdCnt = element.totalEpsdCnt ? element.totalEpsdCnt : 0;
                    const lastEpsdNo = element.lastEpsdNo ? element.lastEpsdNo : 0;
                    return {
                        chnlSeq: element.chnlSeq,
                        chnlSdt: chnlSdt,
                        chnlThumb: element.chnlThumb,
                        chnlNm: element.chnlNm,
                        chnlMemo: element.chnlMemo,
                        usedYn: element.usedYn,
                        roundinfo: `${totalEpsdCnt}/${lastEpsdNo}`,
                        subscribe: 0,
                    };
                }),
            );
        };

        if (list.length > 0) {
            initGridRow(list);
        }
    }, [list]);

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={rowData}
            agGridHeight={630}
            onRowNodeId={(data) => data.chnlSeq}
            onRowClicked={(e) => handleClickListRow(e)}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            rowHeight={46}
            displayPageNum={DISPLAY_PAGE_NUM}
            onChangeSearchOption={handleChangeSearchOption}
            selected={params.chnlSeq}
            frameworkComponents={{ ImageRenderer: ImageRenderer }}
        />
    );
};

export default ChannelListAgGrid;
