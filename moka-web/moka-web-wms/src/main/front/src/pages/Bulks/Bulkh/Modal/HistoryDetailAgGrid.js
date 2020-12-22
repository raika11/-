import React, { useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { useHistory } from 'react-router-dom';
import { historyDetailColumnDefs } from './HistoryAgGridColumns';
import { Col } from 'react-bootstrap';
import { MokaCard } from '@components';
import Button from 'react-bootstrap/Button';
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

    // 불러오기 버튼을 클릭 하면 핫클릭 리트스 창을 url 을 변경해서 리스트 를 가지고 온다.
    const handleClickLoadButton = () => {
        const selctSeq = historyListArticle.selectSeq;
        history.push(`/${bulkPathName}/${selctSeq}`);
    };

    // store 리스트가 변경 되면 grid 에 리스트 전달.
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
        <>
            <MokaCard
                width={630}
                height={670}
                loading={loading}
                header={false}
                className={'custom-scroll mr-gutter flex-fill'}
                footer
                footerAs={
                    <>
                        <Col></Col>
                        <Col className="offset-8 pr-0">
                            <Button variant="outline-neutral" onClick={() => handleClickLoadButton()} disabled={rowData.length > 0 ? false : true}>
                                불러오기
                            </Button>
                        </Col>
                    </>
                }
            >
                <MokaTable
                    agGridHeight={550}
                    columnDefs={historyDetailColumnDefs}
                    rowData={rowData}
                    onRowNodeId={(row) => row.id}
                    onRowClicked={null}
                    loading={null}
                    total={historyListArticle.list.totalCnt}
                    page={null}
                    size={null}
                    onChangeSearchOption={null}
                    selected={null}
                    paging={false}
                />
            </MokaCard>
        </>
    );
};

export default HistoryDetailAgGrid;
