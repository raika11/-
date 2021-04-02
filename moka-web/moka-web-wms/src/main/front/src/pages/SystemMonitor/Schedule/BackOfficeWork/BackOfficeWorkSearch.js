import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@/components';
import { DB_DATEFORMAT, SCHEDULE_STATUS } from '@/constants';
import { initialState, getJobHistoryList, getJobCode, changeBackOfficeWorkSearchOption } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 백오피스 예약작업 검색
 */
const BackOfficeWorkSearch = ({ show }) => {
    const dispatch = useDispatch();
    const jobCode = useSelector((store) => store.schedule.backOffice.jobCode);
    const storeSearch = useSelector((store) => store.schedule.backOffice.search);
    const [search, setSearch] = useState(initialState.backOffice.search);

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
            getJobHistoryList(
                changeBackOfficeWorkSearchOption({
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
        setSearch({ ...initialState.backOffice.search, startDay: moment().startOf('day').format(DB_DATEFORMAT), endDay: moment().endOf('day').format(DB_DATEFORMAT) });
    };

    useEffect(() => {
        let st = moment(storeSearch.startDay);
        if (!st.isValid()) {
            st = null;
        }
        let nt = moment(storeSearch.endDay);
        if (!nt.isValid()) {
            nt = null;
        }
        setSearch({ ...storeSearch, startDay: st, endDay: nt });
    }, [storeSearch]);

    useEffect(() => {
        if (show) {
            dispatch(
                getJobHistoryList(
                    getJobCode(),
                    changeBackOfficeWorkSearchOption({ ...search, startDay: moment().startOf('day').format(DB_DATEFORMAT), endDay: moment().endOf('day').format(DB_DATEFORMAT) }),
                ),
            );
        } else {
            setSearch({ ...initialState.backOffice.search, startDay: moment().startOf('day').format(DB_DATEFORMAT), endDay: moment().endOf('day').format(DB_DATEFORMAT) });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
            <Form.Row className="mb-2">
                <Col xs={5} className="p-0 pr-2 d-flex align-items-center">
                    <MokaInput
                        as="dateTimePicker"
                        className="mr-1"
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, startDay: moment(date).format(DB_DATEFORMAT) });
                            } else {
                                setSearch({ ...search, startDay: null });
                            }
                        }}
                        value={search.startDay}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        className="ml-1"
                        inputProps={{ timeFormat: null, timeDefault: 'end' }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, endDay: moment(date).format(DB_DATEFORMAT) });
                            } else {
                                setSearch({ ...search, endDay: null });
                            }
                        }}
                        value={search.endDay}
                    />
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="jobSeq" value={search.jobSeq} onChange={handleChangeValue}>
                        <option value="">업무 전체</option>
                        {jobCode &&
                            jobCode.map((j) => (
                                <option key={j.jobSeq} value={j.jobSeq}>
                                    {j.jobNm}
                                </option>
                            ))}
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="status" value={search.status} onChange={handleChangeValue}>
                        <option value="">상태 전체</option>
                        {SCHEDULE_STATUS.map((s) => (
                            <option key={s.status} value={s.status}>
                                {s.statusNm}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={3} className="p-0">
                    <MokaInput name="jobCd" placeholder="작업 식별 정보를 입력하세요" value={search.jobCd} onChange={handleChangeValue} />
                </Col>
            </Form.Row>
            <Form.Row className="justify-content-end">
                <Button variant="searching" className="mr-1" onClick={handleClickSearch}>
                    검색
                </Button>
                <Button variant="negative" onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default BackOfficeWorkSearch;
