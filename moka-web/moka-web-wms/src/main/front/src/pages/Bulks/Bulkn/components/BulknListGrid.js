import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { MokaTable } from '@components';
import { getBulkList, GET_BULK_LIST, changeSearchOption, clearBulksList, getBulkArticle } from '@store/bulks';
import { ColumnDefs } from './BulknListGridColumns';

/**
 * 네이버 벌크 문구 > 목록 > AgGrid
 */
const BulknListGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { list, total, search, loading, bulkartSeq, bulkPathName } = useSelector((store) => ({
        total: store.bulks.bulkn.total,
        search: store.bulks.bulkn.search,
        list: store.bulks.bulkn.list,
        bulkPathName: store.bulks.bulkPathName,
        bulkartSeq: store.bulks.bulkn.bulkartSeq,
        loading: store.loading[GET_BULK_LIST],
    }));

    // grid 리크스 초기화.
    const [rowData, setRowData] = useState([]);

    // item 클릭하면 라우터 이동. ( bulkartSeq 값이 있으면 bulkarticle 를 가지고 옴.)
    const handleClickListRow = (e) => {
        dispatch(
            getBulkArticle({
                bulkartSeq: e.bulkartSeq,
            }),
        );
        history.push(`/${bulkPathName}/${e.bulkartSeq}`);
    };

    // grid 에서 상태 변경시 리스트를 가지고 오기.
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(clearBulksList());
            dispatch(changeSearchOption(temp));
            dispatch(getBulkList());
        },
        [dispatch, search],
    );

    // 최초 로딩.
    useEffect(() => {
        setRowData([]);
        const setGridRowData = (list) => {
            setRowData(
                list.map((element) => {
                    let sendDt = element.sendDt && element.sendDt.length > 10 ? element.sendDt.substr(0, 16) : element.sendDt;
                    return {
                        ...element,
                        sendDt: sendDt,
                        regInfo: element.regMember ? `${element.regMember.memberNm}(${element.regMember.memberId})` : '',
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

        if (list) {
            setGridRowData(list);
        }
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={ColumnDefs}
            rowData={rowData}
            onRowNodeId={(data) => data.bulkartSeq}
            onRowClicked={handleClickListRow}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            displayPageNum={DISPLAY_PAGE_NUM}
            onChangeSearchOption={handleChangeSearchOption}
            selected={bulkartSeq}
            preventRowClickCell={['used', 'preview']}
        />
    );
};

export default BulknListGrid;
