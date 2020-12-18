import React, { useEffect, useState, useCallback } from 'react';
import { MokaTable } from '@components';
import { historyColumnDefs } from './HistoryAgGridColumns';
import { MokaCard } from '@components';
import { useSelector, useDispatch } from 'react-redux';
import { getHotclickHistoryList, changeHistirySearchOption, getHotclickDetail, clearHistoryDetail } from '@store/bulks';

const HistoryAgGrid = () => {
    const [rowData, setRowData] = useState([]);
    const dispatch = useDispatch();
    const { historyList } = useSelector((store) => ({
        historyList: store.bulks.bulkh.historyList,
    }));

    // row 클릭시 오른쪽 리스트를 가지고 온다.
    const handleClickListRow = (bulkartSeq) => {
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
            dispatch(getHotclickHistoryList(changeHistirySearchOption(temp)));
        },
        [dispatch, historyList.search],
    );

    // store 에서 리스트가 변경 되면 grid 에 변경 된 리스트 전달.
    useEffect(() => {
        setRowData(
            historyList.list.map((element) => {
                return {
                    bulkartSeq: element.bulkartSeq,
                    regId: element.regId,
                    regDt: element.regDt,
                };
            }),
        );
    }, [historyList]);

    return (
        <>
            <MokaCard width={430} height={650} loading={null} header={false} className={'custom-scroll mr-gutter flex-fill'}>
                <MokaTable
                    agGridHeight={550}
                    columnDefs={historyColumnDefs}
                    rowData={rowData}
                    onRowNodeId={(row) => row.bulkartSeq}
                    onRowClicked={(row) => {
                        handleClickListRow(row.bulkartSeq);
                    }}
                    loading={null}
                    total={historyList.totalCnt}
                    page={historyList.search.page}
                    size={historyList.search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    selected={null}
                    className="sns-meta-ag-grid"
                />
            </MokaCard>
        </>
    );
};

export default HistoryAgGrid;
