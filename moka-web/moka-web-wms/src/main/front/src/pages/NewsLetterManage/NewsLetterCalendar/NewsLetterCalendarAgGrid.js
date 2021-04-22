import React, { useState } from 'react';
import { MokaInput, MokaTable } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 일정 > 발송 상품 목록 AgGrid
 */
const NewsLetterCalendarAgGrid = () => {
    const [search] = useState({ page: 0, size: 10 });
    return (
        <>
            {/* 발송 상품 구분 */}
            <div>
                <MokaInput as="select" disabled>
                    <option>발송 예정 상품</option>
                    <option>발송 진행 중 상품</option>
                    <option>발송 종료 상품</option>
                </MokaInput>
            </div>

            {/* 상품 목록 */}
            <MokaTable
                className="overflow-hidden flex-fill"
                header={false}
                // columnDefs={columnDefs}
                paginationClassName="justify-content-center"
                onRowNodeId={(data) => data.seq}
                // loading={loading}
                page={search.page}
                size={search.size}
                pageSizes={false}
                showTotalString={false}
            />
        </>
    );
};

export default NewsLetterCalendarAgGrid;
