import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux';
import { downloadExcel } from '@store/searchKeyword';
import toast from '@utils/toastUtil';

const OverallStatusHeader = () => {
    const dispatch = useDispatch();
    const searchDate = useSelector(({ searchKeyword }) => searchKeyword.stat.searchDate);
    const search = useSelector(({ searchKeyword }) => searchKeyword.stat.search);

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

    return (
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
    );
};

export default OverallStatusHeader;
