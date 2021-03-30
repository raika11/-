import React, { useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { useHistory } from 'react-router-dom';
import { historyDetailColumnDefs } from './HistoryAgGridColumns';
import { MokaCard } from '@components';
import { useSelector } from 'react-redux';
import { GET_HISTORY_DETAIL } from '@store/bulks';

const HistoryDetailAgGrid = () => {
    const history = useHistory();
    const { historyListArticle, bulkPathName, loading } = useSelector((store) => ({
        bulkPathName: store.bulks.bulkPathName,
        historyListArticle: store.bulks.bulkh.historyList.article,
        loading: store.loading[GET_HISTORY_DETAIL],
    }));
    const [rowData, setRowData] = useState([]);

    /**
     * 불러오기
     */
    const handleClickLoadButton = () => {
        const selctSeq = historyListArticle.selectSeq;
        history.push(`/${bulkPathName}/${selctSeq}`);
    };

    useEffect(() => {
        setRowData(
            historyListArticle.list.map((element) => {
                return {
                    ordNo: element.ordNo,
                    bulkartSeq: element.bulkartSeq,
                    title: element.title,
                    totalId: element.totalId,
                };
            }),
        );
    }, [historyListArticle]);

    return (
        <MokaCard
            loading={loading}
            header={false}
            className="shadow-none w-100 h-100"
            bodyClassName="d-flex flex-column p-0 m-0"
            footer
            footerClassName="pb-0"
            footerButtons={[
                {
                    text: '불러오기',
                    onClick: handleClickLoadButton,
                    variant: 'outline-neutral',
                    disabled: rowData.length < 1,
                },
            ]}
        >
            <MokaTable
                className="flex-fill overflow-hidden"
                columnDefs={historyDetailColumnDefs}
                rowData={rowData}
                onRowNodeId={(row) => row.id}
                onRowClicked={null}
                total={historyListArticle.list.totalCnt}
                onChangeSearchOption={null}
                paging={false}
            />
        </MokaCard>
    );
};

export default HistoryDetailAgGrid;
