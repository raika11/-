import React, { useState, useEffect, useCallback } from 'react';
import { ColumnDefs } from './BulknListGridColumns';
import { useHistory, useParams } from 'react-router-dom';
import { MokaTable } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import { getBulkList, GET_BULK_LIST, changeSearchOption } from '@store/bulks';
import { DISPLAY_PAGE_NUM } from '@/constants';

const BulknListGrid = () => {
    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const { list, total, search, loading, bulkPathName } = useSelector((store) => ({
        total: store.bulks.bulkn.total,
        search: store.bulks.bulkn.search,
        list: store.bulks.bulkn.list,
        bulkPathName: store.bulks.bulkPathName,
        loading: store.loading[GET_BULK_LIST],
    }));

    // grid 리크스 초기화.
    const [rowData, setRowData] = useState([]);

    // item 클릭하면 라우터 이동. ( bulkartSeq 값이 있으면 bulkarticle 를 가지고 옴.)
    const handleClickListRow = (e) => {
        history.push(`/${bulkPathName}/${e.bulkartSeq}`);
    };

    // grid 에서 상태 변경시 리스트를 가지고 오기.
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getBulkList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    // 최초 로딩.
    useEffect(() => {
        const setGridRowData = (list) => {
            setRowData(
                list.map((element) => {
                    return {
                        ...element,
                        sendDt: element.sendDt ? element.sendDt : null,
                        used: {
                            bulkartSeq: element.bulkartSeq,
                            status: element.status,
                            usedYn: element.usedYn,
                        },
                        preview: {
                            bulkartSeq: element.bulkartSeq,
                        },
                    };
                }),
            );
        };

        setGridRowData(list);
    }, [list]);

    return (
        <>
            <MokaTable
                agGridHeight={650}
                columnDefs={ColumnDefs}
                rowData={rowData}
                rowHeight={40}
                onRowNodeId={(data) => data.bulkartSeq}
                onRowClicked={handleClickListRow}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={DISPLAY_PAGE_NUM}
                onChangeSearchOption={handleChangeSearchOption}
                selected={params.bulkartSeq}
                preventRowClickCell={['used', 'preview']}
            />
        </>
    );
};

export default BulknListGrid;