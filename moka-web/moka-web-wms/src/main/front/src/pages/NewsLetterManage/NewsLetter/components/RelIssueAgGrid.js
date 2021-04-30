import React, { useState, useEffect, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './RelIssueAgGridColumns';
import { changeIssueSearchOptions, getIssueList, GET_ISSUE_LIST } from '@store/issue';

/**
 * 이슈/연재/토픽 패키지 검색 모달
 * 구독 여부 Y, 뉴스레터 설정된 패키지는 선택 버튼 비활성
 */
const RelIssueAgGrid = ({ pkgDiv, onRowClicked, onHide }) => {
    const dispatch = useDispatch();
    const { search, total, list } = useSelector(({ issue }) => issue, shallowEqual);
    const letterChannelTypeList = useSelector(({ newsLetter }) => newsLetter.newsLetter.letterChannelTypeList);
    const loading = useSelector(({ loading }) => loading[GET_ISSUE_LIST]);
    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') temp['page'] = 0;
            dispatch(changeIssueSearchOptions(temp));
            dispatch(getIssueList({ search: temp }));
        },
        [dispatch, search],
    );

    /**
     * 등록 버튼
     * @param {object} data data
     */
    const handleRowClicked = useCallback(
        (data) => {
            if (onRowClicked) {
                onRowClicked(data);
                onHide();
            }
        },
        [onRowClicked, onHide],
    );

    useEffect(() => {
        setRowData(
            list.map((i) => ({
                ...i,
                pkgDiv: pkgDiv.find((d) => d.code === i.pkgDiv)?.name || '',
                letterYn: letterChannelTypeList.indexOf(i.pkgSeq) > -1 ? 'Y' : 'N',
                onClick: handleRowClicked,
            })),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            onRowNodeId={(data) => data.pkgSeq}
            rowData={rowData}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default RelIssueAgGrid;
