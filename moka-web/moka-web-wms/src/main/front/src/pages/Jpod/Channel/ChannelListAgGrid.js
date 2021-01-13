import React, { useEffect, Suspense, useState, useCallback, useRef } from 'react';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { columnDefs } from './ChannelListAgGridColumns';
import { tempChannelList } from '@pages/Jpod/JpodConst';
import ImageRenderer from './ImageRenderer';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { initialState, GET_CHANNELS, changeJpodSearchOption, getChannels, getChannelInfo, clearChannelInfo } from '@store/jpod';

const ChannelListAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const params = useParams();
    const selectChnlSeq = useRef(null);
    const { search, list, loading, total } = useSelector((store) => ({
        search: store.jpod.channel.jpod.search,
        list: store.jpod.channel.jpod.list,
        total: store.jpod.channel.jpod.total,
        loading: store.loading[GET_CHANNELS],
    }));

    const history = useHistory();
    const [rowData, setRowData] = useState([]);
    const t_commentSeq = 121213;

    const handleClickListRow = ({ chnlSeq }) => {
        history.push(`${match.path}/${chnlSeq}`);
        dispatch(clearChannelInfo());
        dispatch(getChannelInfo({ chnlSeq: chnlSeq }));
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

    // useEffect(() => {
    //     console.log(params.chnlSeq);
    //     if (!isNaN(Number(params.chnlSeq)) && selectChnlSeq.current !== params.chnlSeq) {
    //         selectChnlSeq.current = params.chnlSeq;
    //         dispatch(clearChannelInfo());
    //         dispatch(getChannelInfo({ chnlSeq: params.chnlSeq }));
    //     } else if (params.chnlSeq === 'add') {
    //         console.log('add');
    //         // dispatch(clearChannelInfo());
    //     }
    // }, [dispatch, params]);

    useEffect(() => {
        setRowData([]);
        const inirGridRow = (data) => {
            setRowData(
                data.map((element) => {
                    let chnlSdt = element.chnlSdt && element.chnlSdt.length > 10 ? element.chnlSdt.substr(0, 10) : element.chnlSdt;
                    return {
                        chnlSeq: element.chnlSeq,
                        chnlSdt: chnlSdt,
                        chnlThumb: element.chnlThumb,
                        chnlNm: element.chnlNm,
                        chnlMemo: element.chnlMemo,
                        roundinfo: `0/0`,
                        subscribe: ``,
                    };
                }),
            );
        };

        if (list.length > 0) {
            inirGridRow(list);
        }
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={80}
            onRowNodeId={(data) => data.chnlSeq}
            onRowClicked={(e) => handleClickListRow(e)}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            displayPageNum={DISPLAY_PAGE_NUM}
            onChangeSearchOption={handleChangeSearchOption}
            selected={params.chnlSeq}
            frameworkComponents={{ ImageRenderer: ImageRenderer }}
        />
    );
};

export default ChannelListAgGrid;
