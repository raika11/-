import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { API_BASE_URL } from '@/constants';
import { MokaTable } from '@components';
import { GET_SEARCH_KEYWORD_STAT_TOTAL } from '@store/searchKeyword';
import columnDefs from './OverallStatusColumns';

/**
 * 총 통계
 */
const OverallStatus = () => {
    const { searchDate, search, statTotal, searchTotalCnt } = useSelector(({ searchKeyword }) => ({
        searchDate: searchKeyword.stat.searchDate,
        search: searchKeyword.stat.search,
        statTotal: searchKeyword.statTotal,
        searchTotalCnt: searchKeyword.stat.total,
    }));
    const [rowData, setRowData] = useState([]);
    const loading = useSelector(({ loading }) => loading[GET_SEARCH_KEYWORD_STAT_TOTAL]);

    /**
     * 검색어
     */
    const handleOpenKD = () => window.open('http://220.73.140.201:7800/');

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
            <div className="mb-14">
                <Row className="m-0 justify-content-between align-items-end">
                    <Col xs={6} className="p-0">
                        최종 갱신시각 : {searchDate}
                    </Col>
                    <Col xs={6} className="p-0 text-right">
                        <Button variant="outline-neutral" className="mr-1" onClick={handleOpenKD}>
                            검색어 사전
                        </Button>
                        <a
                            className="btn btn-outline-neutral"
                            href={`${API_BASE_URL}/api/search-keywords/excel?startDt=${search.startDt}&endDt=${search.endDt}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            엑셀 다운로드
                        </a>
                    </Col>
                </Row>
            </div>
            <MokaTable
                paging={false}
                loading={loading}
                columnDefs={columnDefs}
                rowData={rowData}
                className="ag-grid-align-center mb-14"
                agGridHeight={70}
                onRowNodeId={(row) => row.idx}
            />
        </>
    );
};

export default OverallStatus;
