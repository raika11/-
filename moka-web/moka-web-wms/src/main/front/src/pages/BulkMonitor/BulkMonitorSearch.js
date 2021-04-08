import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@components';
import BulkSiteSelector from './components/BulkSiteSelector';
import { changeBmSearchOption, getBulkStatTotal, getBulkStatList, bmInitialState } from '@/store/bulks';
import { getTypeSourceList } from '@store/articleSource';
import { DB_DATEFORMAT } from '@/constants';

/**
 * 벌크 모니터링 검색
 */
const BulkMonitorSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.bulkMonitor.search);
    const typeSourceList = useSelector((store) => store.articleSource.typeSourceList);
    const [search, setSearch] = useState(bmInitialState.search);
    const [bulkSourceList, setBulkSourceList] = useState([]);
    const [sourceReset, setSourceReset] = useState(false);

    /**
     * 검색 버튼
     */
    const handleClickSearch = () => {
        dispatch(
            getBulkStatTotal({
                date: {
                    startDt: search.startDt && search.startDt.isValid() ? moment(search.startDt).format('YYYY-MM-DD') : null,
                    endDt: search.endDt && search.endDt.isValid() ? moment(search.endDt).format('YYYY-MM-DD') : null,
                },
            }),
        );

        dispatch(
            getBulkStatList(
                changeBmSearchOption({
                    ...search,
                    startDt: search.startDt && search.startDt.isValid() ? moment(search.startDt).format('YYYY-MM-DD') : null,
                    endDt: search.endDt && search.endDt.isValid() ? moment(search.endDt).format('YYYY-MM-DD') : null,
                    page: 0,
                }),
            ),
        );
    };

    /**
     * 초기화 버튼
     */
    const handleClickReset = () => {
        setSearch({ ...bmInitialState.search, startDt: moment().startOf('day').format('YYYY-MM-DD'), endDt: moment().endOf('day').format('YYYY-MM-DD') });
        setSourceReset(true);
    };

    useEffect(() => {
        let sd = moment(storeSearch.startDt, DB_DATEFORMAT);
        if (!sd.isValid()) sd = null;
        let ed = moment(storeSearch.endDt, DB_DATEFORMAT);
        if (!ed.isValid()) ed = null;

        setSearch({
            ...storeSearch,
            startDt: sd,
            endDt: ed,
        });
    }, [storeSearch]);

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
        dispatch(changeBmSearchOption({ ...search, startDt: moment().startOf('day').format('YYYY-MM-DD'), endDt: moment().endOf('day').format('YYYY-MM-DD') }));
        // 벌크 전송 목록 조회 (데이터가 많으므로 화면 마운트시 조회 x)
        // dispatch(
        //     getBulkStatTotal({
        //         date: {
        //             startDt: moment().startOf('day').format('YYYY-MM-DD'),
        //             endDt: moment().endOf('day').format('YYYY-MM-DD'),
        //         },
        //     }),
        // );
        // dispatch(getBulkStatList(changeBmSearchOption({ ...search, startDt: moment().startOf('day').format('YYYY-MM-DD'), endDt: moment().endOf('day').format('YYYY-MM-DD') })));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    console.log(search.portalDiv);

    return (
        <>
            <Form className="mb-14">
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
                            inputProps={{ timeFormat: null, timeDefault: 'start' }}
                            value={search.startDt}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setSearch({
                                        ...search,
                                        startDt: date,
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
                            inputProps={{ timeFormat: null, timeDefault: 'end' }}
                            value={search.endDt}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setSearch({
                                        ...search,
                                        endDt: date,
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
                        onReset={sourceReset}
                        onChange={(value) => {
                            if (value !== '') {
                                setSourceReset(false);
                            }
                            setSearch({ ...search, portalDiv: value });
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
