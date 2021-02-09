import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel } from '@components';
import { SourceSelector } from '@pages/commons';
import BulkSiteSelector from './components/BulkSiteSelector';
import { changeBmSearchOption, getBulkStatTotal, bmInitialState } from '@/store/bulks';

/**
 * 벌크 모니터링 검색
 */
const BulkMonitorSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.bulkMonitor.search);
    const [search, setSearch] = useState(bmInitialState.search);
    const [sourceList, setSourceList] = useState('');
    const [site, setSite] = useState('');
    const [error, setError] = useState(false);

    const handleClickSearch = () => {
        dispatch(
            getBulkStatTotal(
                changeBmSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    };

    const handleClickReset = () => {
        setSourceList(null);
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    return (
        <>
            <Form className="mb-5">
                <Form.Row>
                    <div className="d-flex align-items-center">
                        <SourceSelector width={160} className="mr-2" value={sourceList} sourceType="BULK" onChange={(value) => setSourceList(value)} />
                        <MokaInputLabel as="none" label="전송일" />
                        {/* 시작일 종료일 */}
                        <div style={{ width: 150 }}>
                            <MokaInput
                                as="dateTimePicker"
                                className="mr-2"
                                inputProps={{ timeFormat: null }}
                                value={search.startDt}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        setSearch({
                                            ...search,
                                            startDt: moment(date).format('YYYYMMDD'),
                                        });
                                    } else {
                                        setSearch({
                                            ...search,
                                            startDt: null,
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div style={{ width: 150 }}>
                            <MokaInput
                                as="dateTimePicker"
                                className="mr-2"
                                inputProps={{ timeFormat: null }}
                                value={search.endDt}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        setSearch({
                                            ...search,
                                            endDt: moment(date).format('YYYYMMDD'),
                                        });
                                    } else {
                                        setSearch({
                                            ...search,
                                            endDt: null,
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div className="mr-2" style={{ width: 120 }}>
                            <MokaInput as="select" value={search.searchType} onChange={(e) => setSearch({ ...search, searchType: e.target.value })}>
                                <option value="">전체</option>
                                <option value="contentId">기사 ID</option>
                                <option value="title">기사 제목</option>
                            </MokaInput>
                        </div>
                        <div className="mr-2" style={{ width: 370 }}>
                            <MokaInput
                                className="mr-2"
                                placeholder="검색어를 입력하세요"
                                value={search.keyword}
                                onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                            />
                        </div>
                        <BulkSiteSelector className="mr-2" value={site} onChange={(value) => setSite(value)} />
                        <MokaInput
                            as="checkbox"
                            className="mr-2"
                            id="bulk-error-checkbox"
                            inputProps={{ label: '진행 + 오류만 보기', custom: true, checked: error === true }}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setError(true);
                                } else {
                                    setError(false);
                                }
                            }}
                        />
                        <Button variant="searching" className="mr-2" onClick={handleClickSearch}>
                            검색
                        </Button>
                        <Button variant="outline-neutral" onClick={handleClickReset}>
                            초기화
                        </Button>
                    </div>
                </Form.Row>
            </Form>
        </>
    );
};

export default BulkMonitorSearch;
