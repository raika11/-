import React, { useEffect, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaCard, MokaTable } from '@/components';
import { getNewsLetterHistoryList, GET_NEWS_LETTER_HISTORY, changeNewsLetterHitorySearchOption, getNewsLetterHistory } from '@/store/newsLetter';
import { useHistory } from 'react-router';

/**
 * 뉴스레터 관리 > 뉴스레터 수정 > 히스토리
 */
const NewsLetterHistory = () => {
    const { letterSeq } = useHistory();
    const dispatch = useDispatch();
    const { total, list, search, loading } = useSelector(
        (store) => ({
            total: store.newsLetter.newsLetter.history.total,
            list: store.newsLetter.newsLetter.history.list,
            search: store.newsLetter.newsLetter.history.search,
            loading: store.loading[GET_NEWS_LETTER_HISTORY],
        }),
        shallowEqual,
    );

    /**
     * 테이블 검색 옵션 변경
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') temp['page'] = 0;
            dispatch(changeNewsLetterHitorySearchOption(temp));
            dispatch(getNewsLetterHistoryList({ letterSeq, search: temp }));
        },
        [dispatch, letterSeq, search],
    );

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        // dispatch(getNewsLetterHistory())
    }, []);

    useEffect(() => {
        if (letterSeq) {
            dispatch(getNewsLetterHistoryList({ letterSeq, search }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [letterSeq]);

    return (
        <MokaCard className="w-100" bodyClassName="d-flex flex-column" title="뉴스레터 상품 수정 히스토리">
            <MokaTable
                className="overflow-hidden flex-fill"
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
                rowData={list}
                loading={loading}
                page={search.page}
                size={search.size}
                total={total}
                onRowClicked={handleRowClicked}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </MokaCard>
    );
};

export default NewsLetterHistory;
