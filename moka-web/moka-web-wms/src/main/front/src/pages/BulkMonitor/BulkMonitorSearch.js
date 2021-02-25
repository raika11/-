import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@components';
import BulkSiteSelector from './components/BulkSiteSelector';
import { changeBmSearchOption, getBulkStatTotal, getBulkStatList, bmInitialState } from '@/store/bulks';
import { getTypeSourceList } from '@store/articleSource';

/**
 * 벌크 모니터링 검색
 */
const BulkMonitorSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.bulkMonitor.search);
    const typeSourceList = useSelector((store) => store.articleSource.typeSourceList);
    const [search, setSearch] = useState(bmInitialState.search);
    const [temp, setTemp] = useState({});
    const [bulkSourceList, setBulkSourceList] = useState([]);
    const [siteOn, setSiteOn] = useState(false);

    /**
     * 검색 버튼
     */
    const handleClickSearch = () => {
        dispatch(
            getBulkStatTotal({
                date: {
                    startDt: search.startDt,
                    endDt: search.endDt,
                },
            }),
        );

        dispatch(
            getBulkStatList(
                changeBmSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    };

    /**
     * 초기화 버튼
     */
    const handleClickReset = () => {
        dispatch(
            changeBmSearchOption({
                ...search,
                ...temp,
            }),
        );
    };

    useEffect(() => {
        // 벌크 전체 건수, 벌크 전송 목록
        if (siteOn) {
            dispatch(
                getBulkStatTotal({
                    date: {
                        startDt: search.startDt,
                        endDt: search.endDt,
                    },
                }),
            );

            dispatch(
                getBulkStatList(
                    changeBmSearchOption({
                        ...search,
                        page: 0,
                    }),
                ),
            );

            setTemp({ ...temp, ...search });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteOn]);

    useEffect(() => {
        // BULK 매체 조회
        if (!typeSourceList?.['BULK']) {
            dispatch(getTypeSourceList({ type: 'BULK' }));
        } else {
            setBulkSourceList([...typeSourceList['BULK'], { sourceCode: 'JL', sourceName: '조인스랜드' }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeSourceList]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    return (
        <>
            <Form className="mb-5">
                <Form.Row className="d-flex align-items-center justify-content-between">
                    <div className="mr-2" style={{ width: 160 }}>
                        <MokaInput
                            as="select"
                            value={search.orgSourceCode}
                            onChange={(e) => {
                                setSearch({ ...search, orgSourceCode: e.target.value });
                            }}
                        >
                            <option value="all">전체</option>
                            {bulkSourceList &&
                                bulkSourceList.map((s) => (
                                    <option key={s.sourceCode} value={s.sourceCode}>
                                        {s.sourceName}
                                    </option>
                                ))}
                        </MokaInput>
                    </div>

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
                                        startDt: moment(date).format('YYYY-MM-DD'),
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
                                        endDt: moment(date).format('YYYY-MM-DD'),
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
                            <option value="all">전체</option>
                            <option value="contentId">기사 ID</option>
                            <option value="title">기사 제목</option>
                        </MokaInput>
                    </div>
                    <div className="mr-2" style={{ width: 370 }}>
                        <MokaInput className="mr-2" placeholder="검색어를 입력하세요" value={search.keyword} onChange={(e) => setSearch({ ...search, keyword: e.target.value })} />
                    </div>
                    <BulkSiteSelector
                        className="mr-2"
                        value={search.portalDiv}
                        onChange={(value) => {
                            setSearch({ ...search, portalDiv: value });
                            if (value !== '') {
                                setSiteOn(true);
                            }
                        }}
                    />
                    <MokaInput
                        as="checkbox"
                        className="mr-2"
                        id="bulk-error-checkbox"
                        inputProps={{ label: '진행 + 오류만 보기', custom: true, checked: search.status === 'Y' }}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSearch({ ...search, status: 'Y' });
                            } else {
                                setSearch({ ...search, status: undefined });
                            }
                        }}
                    />
                    <Button variant="searching" className="mr-1" onClick={handleClickSearch}>
                        검색
                    </Button>
                    <Button variant="outline-neutral" onClick={handleClickReset}>
                        초기화
                    </Button>
                </Form.Row>
            </Form>
        </>
    );
};

export default BulkMonitorSearch;
