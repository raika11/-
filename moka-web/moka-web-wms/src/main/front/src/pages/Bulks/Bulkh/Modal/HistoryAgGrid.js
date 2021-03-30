import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTable } from '@components';
import { historyColumnDefs } from './HistoryAgGridColumns';
import { getHotclickHistoryList, changeHistirySearchOption, getHotclickDetail, clearHistoryDetail, GET_HOTCLICK_HISTORY_LIST } from '@store/bulks';

const HistoryAgGrid = () => {
    const [rowData, setRowData] = useState([]);
    const [selectBulkartSeq, setSelectBulkartSeq] = useState(null);
    const dispatch = useDispatch();
    const { historyList, loading } = useSelector((store) => ({
        historyList: store.bulks.bulkh.historyList,
        loading: store.loading[GET_HOTCLICK_HISTORY_LIST],
    }));

    // row 클릭시 오른쪽 리스트를 가지고 온다.
    const handleClickListRow = (bulkartSeq) => {
        setSelectBulkartSeq(bulkartSeq);
        dispatch(clearHistoryDetail());
        dispatch(getHotclickDetail({ bulkartSeq: bulkartSeq }));
    };

    // grid 에서 상태 변경시 리스트를 가지고 오기.
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...historyList.search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeHistirySearchOption(temp));
            dispatch(getHotclickHistoryList());
        },
        [dispatch, historyList.search],
    );

    // store 에서 리스트가 변경 되면 grid 에 변경 된 리스트 전달.
    useEffect(() => {
        setRowData(
            historyList.list.map((element) => {
                let regDt = element.regDt && element.regDt.length > 10 ? element.regDt.substr(0, 16) : element.regDt;
                return {
                    bulkartSeq: element.bulkartSeq,
                    regMember: `${element.regMember.memberNm}(${element.regMember.memberId})`,
                    regDt: regDt,
                };
            }),
        );
    }, [historyList]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={historyColumnDefs}
            rowData={rowData}
            onRowNodeId={(row) => row.bulkartSeq}
            onRowClicked={(row) => {
                handleClickListRow(row.bulkartSeq);
            }}
            loading={loading}
            total={historyList.totalCnt}
            page={historyList.search.page}
            size={historyList.search.size}
            onChangeSearchOption={handleChangeSearchOption}
            selected={selectBulkartSeq}
        />
    );
};

export default HistoryAgGrid;
