import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@/components';
import columnDefs from './NewsLetterAgGridColumns';
import { GET_NEWS_LETTER_LIST, getNewsLetterList, changeNewsLetterSearchOption } from '@store/newsLetter';
import moment from 'moment';
import { DATE_FORMAT } from '@/constants';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 목록
 */
const NewsLetterAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { total, list, search } = useSelector(({ newsLetter }) => newsLetter.newsLetter);
    const loading = useSelector(({ loading }) => loading[GET_NEWS_LETTER_LIST]);
    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getNewsLetterList(changeNewsLetterSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`${match.path}/${row.letterSeq}`);
        },
        [history, match.path],
    );

    useEffect(() => {
        setRowData(
            list.map((l) => ({
                ...l,
                sendStartDt: l.sendStartDt ? moment(l.sendStartDt).format(DATE_FORMAT) : '',
                lastSendDt: l.lastSendDt ? moment(l.lastSendDt).format(DATE_FORMAT) : '',
                sendInfo: l.sendDay || l.sendBaseCnt,
                regDt: l.regDt ? moment(l.regDt).format(DATE_FORMAT) : '',
                abtestYn: l.abtestYn || 'N',
            })),
        );
    }, [list]);

    console.log(rowData);

    return (
        <>
            <div className="mb-14 d-flex justify-content-end">
                <Button variant="positive" className="mr-1" onClick={() => history.push(`${match.path}/add`)}>
                    상품 등록
                </Button>
                <Button variant="outline-neutral">Excel 다운로드</Button>
            </div>
            <MokaTable
                suppressMultiSort // 다중 정렬 비활성
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.letterSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                page={search.page}
                size={search.size}
                total={total}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </>
    );
};

export default NewsLetterAgGrid;
