import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux';
import { downloadExcel } from '@store/searchKeyword';
import toast from '@utils/toastUtil';
import { MokaTable } from '@components';
import columnDefs from './OverallStatusColumns';

/**
 * 총 통계
 */
const OverallStatus = (props) => {
    const dispatch = useDispatch();
    const { searchDate, search, statTotal, searchTotalCnt } = useSelector(({ searchKeyword }) => ({
        searchDate: searchKeyword.stat.searchDate,
        search: searchKeyword.stat.search,
        statTotal: searchKeyword.statTotal,
        searchTotalCnt: searchKeyword.stat.total,
    }));

    const [rowData, setRowData] = useState([]);

    const handleOpenKD = () => {
        toast.info('검색어 사전');
    };

    /**
     * 엑셀 다운로드
     */
    const handleDownloadExcel = () => {
        dispatch(
            downloadExcel({
                search,
            }),
        );
    };

    useEffect(() => {
        if (statTotal) {
            setRowData([
                {
                    idx: 0,
                    ...statTotal,
                    searchTotalCnt,
                },
            ]);
        } else {
            setRowData([]);
        }
    }, [searchTotalCnt, statTotal]);

    return (
        <>
            <div className="mb-2">
                <Row className="m-0 justify-content-between align-items-end">
                    <Col xs={6} className="p-0">
                        최종 갱신시각 : {searchDate}
                    </Col>
                    <Col xs={6} className="p-0 text-right">
                        <Button variant="outline-neutral" className="mr-2" onClick={handleOpenKD}>
                            검색어 사전
                        </Button>
                        <Button variant="outline-neutral" onClick={handleDownloadExcel}>
                            엑셀 다운로드
                        </Button>
                    </Col>
                </Row>
            </div>
            <MokaTable paging={false} columnDefs={columnDefs} rowData={rowData} className="ag-grid-align-center" agGridHeight={100} onRowNodeId={(row) => row.idx} />
        </>
    );
};

export default OverallStatus;
