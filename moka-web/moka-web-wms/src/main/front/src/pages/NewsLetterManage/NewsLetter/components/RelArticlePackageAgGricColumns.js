import React, { useState, useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './RelArticlePackageAgGrid';

/**
 * 기사 패키지 검색 모달 AgGrid
 * 구독 여부 Y, 뉴스레터 설정된 패키지는 선택 버튼 비활성
 */
const RelArticlePackageAgGrid = ({ onRowClicked }) => {
    // const dispatch = useDispatch();
    // const letterChannelTypeList = useSelector(({ newsLetter }) => newsLetter.newsLetter.letterChannelTypeList);
    const [rowData] = useState([]);
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 0, size: 20 });

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(({ key, value }) => {}, []);

    /**
     * 등록 버튼
     * @param {object} data data
     */
    // const handleRowClicked = useCallback(
    //     (data) => {
    //         if (onRowClicked) {
    //             onRowClicked(data);
    //         }
    //     },
    //     [onRowClicked],
    // );

    // useEffect(() => {
    //     setRowData(
    //         list.map((i) => ({
    //             ...i,
    //             letterYn: letterChannelTypeList.indexOf(i) > -1 ? 'Y' : 'N',
    //             onClick: handleRowClicked,
    //         })),
    //     );
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            onRowNodeId={(data) => data.seq}
            rowData={rowData}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default RelArticlePackageAgGrid;
