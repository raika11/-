import React, { useState, useCallback } from 'react';
import { MokaCard, MokaInput, MokaTable } from '@/components';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

/**
 * 뉴스레터 관리 > 뉴스레터 수정 > 히스토리
 */
const NewsLetterHistory = () => {
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    /**
     * 테이블 검색 옵션 변경
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    return (
        <MokaCard className="w-100" bodyClassName="d-flex flex-column" title="뉴스레터 상품 수정 히스토리">
            <Form className="mb-14">
                <Form.Row className="align-items-end justify-content-between">
                    <p className="mb-0">전체 {total}건</p>
                    <Col xs={2} className="p-0">
                        <MokaInput as="select" value={search.size} disabled>
                            <option value="20">20개 보기</option>
                        </MokaInput>
                    </Col>
                </Form.Row>
            </Form>

            <MokaTable
                className="overflow-hidden flex-fill"
                paginationClassName="justify-content-center"
                columnDefs={[
                    {
                        headerName: 'NO',
                        field: 'no',
                        width: 100,
                    },
                    {
                        headerName: '수정 일시',
                        field: 'pkg',
                        flex: 1,
                    },
                    {
                        headerName: '수정자',
                        field: 'modInfo',
                        width: 100,
                    },
                ]}
                onRowNodeId={(data) => data.no}
                loading={loading}
                page={search.page}
                size={search.size}
                total={total}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </MokaCard>
    );
};

export default NewsLetterHistory;
