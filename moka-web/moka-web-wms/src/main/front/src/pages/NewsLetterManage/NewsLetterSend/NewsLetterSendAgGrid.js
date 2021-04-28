import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@/components';
import columnDefs from './NewsLetterSendAgGridColumns';
import { GET_NEWS_LETTER_SEND_LIST } from '@/store/newsLetter';
import { BASIC_DATEFORMAT, NEWS_LETTER_TYPE } from '@/constants';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 목록
 */
const NewsLetterSendAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { total, search, list, loading } = useSelector(
        (store) => ({
            total: store.newsLetter.send.total,
            search: store.newsLetter.send.search,
            list: store.newsLetter.send.list,
            loading: store.loading[GET_NEWS_LETTER_SEND_LIST],
        }),
        shallowEqual,
    );

    const [rowData, setRowData] = useState([]);

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

    /**
     * 뉴스레터 발송
     */
    const handleClickSend = () => {
        history.push(`${match.path}/send`);
    };

    useEffect(() => {
        setRowData(
            list.map((s) => ({
                ...s,
                sendDt: s.sendDt ? moment(s.sendDt).format(BASIC_DATEFORMAT) : '',
            })),
        );
    }, [list]);

    return (
        <>
            <div className="mb-14 d-flex justify-content-end">
                <Button variant="positive" className="mr-1" onClick={handleClickSend}>
                    뉴스레터 발송
                </Button>
                <Button variant="outline-neutral" className="mr-1">
                    아카이브 확인
                </Button>
                <Button variant="outline-neutral">Excel 다운로드</Button>
            </div>
            <MokaTable
                suppressMultiSort // 다중 정렬 비활성
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.sendSeq}
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

export default NewsLetterSendAgGrid;
