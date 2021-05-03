import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@/components';
import columnDefs from './NewsLetterAgGridColumns';
import { GET_NEWS_LETTER_LIST, getNewsLetterList, changeNewsLetterSearchOption } from '@store/newsLetter';
import moment from 'moment';
import { DATE_FORMAT, NEWS_LETTER_SEND_TYPE, NEWS_LETTER_TYPE, NEWS_LETTER_STATUS, API_BASE_URL } from '@/constants';
import { GRID_HEADER_HEIGHT } from '@/style_constants';

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
                sendType: NEWS_LETTER_SEND_TYPE[l.sendType] || l.sendType,
                letterType: NEWS_LETTER_TYPE[l.letterType] || l.letterType,
                sendStartDt: l.sendStartDt ? moment(l.sendStartDt).format(DATE_FORMAT) : '',
                lastSendDt: l.lastSendDt ? moment(l.lastSendDt).format(DATE_FORMAT) : '',
                sendInfo: l.sendDay || l.sendBaseCnt,
                status: NEWS_LETTER_STATUS[l.status] || l.status,
                regDt: l.regDt ? moment(l.regDt).format(DATE_FORMAT) : '',
                regInfo: l.regMember.memberId ? `${l.regMember.memberNm} (${l.regMember.memberId})` : '',
                abtestYn: l.abtestYn || 'N',
            })),
        );
    }, [list]);

    return (
        <>
            <div className="mb-14 d-flex justify-content-end">
                <Button variant="positive" className="mr-1" onClick={() => history.push(`${match.path}/add`)}>
                    상품 등록
                </Button>
                <a
                    className="btn btn-outline-neutral"
                    href={`${API_BASE_URL}/api/newsletter/excel?letterType=${search.letterType}&category=${search.category}&status=${search.status}&sendType=${search.sendType}&startDt=${search.startDt}&endDt=${search.endDt}&scbYn=${search.scbYn}&abtestYn=${search.abtestYn}&letterName=${search.letterName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Excel 다운로드
                </a>
            </div>
            <MokaTable
                suppressMultiSort // 다중 정렬 비활성
                headerHeight={GRID_HEADER_HEIGHT[1]}
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
