import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@/components';
import { SCHEDULE_PERIOD } from '@/constants';
import { initialState, getJobStatisticSearchList, getDistributeServerCode, changeRunStateSearchOption } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 작업 실행상태 검색
 */
const RunStateSearch = ({ show }) => {
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.schedule.runState.search);
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const deployServerCode = useSelector((store) => store.schedule.work.deployServerCode);
    const [search, setSearch] = useState(initialState.runState.search);

    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;
            setSearch({ ...search, [name]: value });
        },
        [search],
    );

    /**
     * 검색
     */
    const handleClickSearch = () => {
        dispatch(
            getJobStatisticSearchList(
                changeRunStateSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    };

    /**
     * 초기화
     */
    const handleClickReset = () => {
        setSearch(initialState.runState.search);
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        if (show) {
            dispatch(getJobStatisticSearchList(getDistributeServerCode()));
        } else {
            setSearch(initialState.runState.search);
        }
    }, [dispatch, show]);

    return (
        <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
            <Form.Row className="mb-2">
                {/* 기타코드에서 가져옴 'GEN_CATE' */}
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="category" value={search.category} onChange={handleChangeValue}>
                        <option value="">분류 전체</option>
                        {genCateRows &&
                            genCateRows.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="period" value={search.period} onChange={handleChangeValue}>
                        <option value="">주기 전체</option>
                        {SCHEDULE_PERIOD.map((p) => (
                            <option key={p.period} value={p.period}>
                                {p.periodNm}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="sendType" value={search.sendType} onChange={handleChangeValue}>
                        <option value="">타입 전체</option>
                        <option value="FTP">FTP</option>
                        <option value="ND">네트워크 복사</option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0 pr-2">
                    <MokaInput as="select" name="serverSeq" value={search.serverSeq} onChange={handleChangeValue}>
                        <option value="">배포 서버 전체</option>
                        {deployServerCode &&
                            deployServerCode.map((s) => (
                                <option key={s.serverSeq} value={s.serverSeq}>
                                    {s.serverNm}
                                </option>
                            ))}
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0">
                    <MokaInput as="select" name="genResult" value={search.genResult} onChange={handleChangeValue}>
                        <option value="">상태 전체</option>
                        <option value="200">성공</option>
                        <option value="500">실패</option>
                    </MokaInput>
                </Col>
            </Form.Row>
            <Form.Row>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        <option value="keyword0">전체</option>
                        <option value="keyword1">패키지명</option>
                        <option value="keyword2">배포 경로</option>
                        <option value="keyword3">설명</option>
                    </MokaInput>
                </Col>
                <Col xs={6} className="p-0">
                    <MokaInput name="keyword" value={search.keyword} onChange={handleChangeValue} />
                </Col>
                <Col xs={4} className="p-0 d-flex justify-content-end">
                    <Button variant="searching" className="mr-1" onClick={handleClickSearch}>
                        검색
                    </Button>
                    <Button variant="negative" onClick={handleClickReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default RunStateSearch;
