import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@/components';
import { SCHEDULE_PERIOD } from '@/constants';
import { getGenCate } from '@/store/codeMgt';
import { initialState, getDistributeServerCode, getJobCode, getJobList, changeWorkSearchOption } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 작업 목록 검색
 */
const WorkSearch = ({ show, match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.schedule.work.search);
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const deployServerCode = useSelector((store) => store.schedule.work.deployServerCode);
    const [search, setSearch] = useState(initialState.work.search);

    /**
     * input value
     */
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
            getJobList(
                changeWorkSearchOption({
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
        setSearch(initialState.work.search);
    };

    /**
     * 등록
     */
    const handleClickAdd = () => {
        history.push(`${match.path}/work-list/add`);
    };

    useEffect(() => {
        if (show) {
            dispatch(getJobList(getGenCate(), getDistributeServerCode(), getJobCode()));
        } else if (!show) {
            setSearch(initialState.work.search);
        }
    }, [dispatch, show]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

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
                    <MokaInput as="select" name="usedYn" value={search.usedYn} onChange={handleChangeValue}>
                        <option value="">사용 전체</option>
                        <option value="Y">사용</option>
                        <option value="N">중지</option>
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
                    <Button variant="negative" className="mr-1" onClick={handleClickReset}>
                        초기화
                    </Button>
                    <Button variant="positive" onClick={handleClickAdd}>
                        등록
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default WorkSearch;
