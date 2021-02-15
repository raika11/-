import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel } from '@components';
import { SourceSelector } from '@pages/commons';
import BulkSiteSelector from './components/BulkSiteSelector';
import { changeBmSearchOption, getBulkStatTotal, getBulkStatList, bmInitialState } from '@/store/bulks';

/**
 * 벌크 모니터링 검색
 */
const BulkMonitorSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.bulkMonitor.search);
    const [search, setSearch] = useState(bmInitialState.search);
    const [temp, setTemp] = useState({});
    const [sourceOn, setSourceOn] = useState(false);
    const [siteOn, setSiteOn] = useState(false);

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
        if (sourceOn && siteOn) {
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
    }, [sourceOn, siteOn]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    return (
        <>
            <Form className="mb-5">
                <Form.Row className="d-flex align-items-center justify-content-between">
                    <SourceSelector
                        width={160}
                        className="mr-2"
                        value={search.orgSourceCode}
                        sourceType="BULK"
                        onChange={(value) => {
                            // let orgSourceName = {
                            //     3: '중앙일보(집배신)',
                            //     60: '중앙선데이',
                            //     61: '중앙선데이(조판)',
                            //     JL: '조인스랜드',
                            // };
                            // let nameArr = [];
                            // value.split(',').forEach((n) => nameArr.push(orgSourceName[Number(n)]));
                            setSearch({
                                ...search,
                                orgSourceCode: value,
                                // , orgSourceName: nameArr.join(',')
                            });
                            if (value !== '') {
                                setSourceOn(true);
                            }
                        }}
                    />
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
                        value={null}
                        onChange={(value) => {
                            // setSearch({ ...search, portalDiv: value });
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
                                setSearch({ ...search, status: 'N' });
                            }
                        }}
                    />
                    <Button variant="searching" className="mr-2" onClick={handleClickSearch}>
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
