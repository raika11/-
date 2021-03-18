import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import { getPressCate1 } from '@store/codeMgt';
import { initialState, getJopanList, changeJopanSearchOption } from '@store/rcvArticle';

/**
 * 수신기사 > 중앙일보 조판 검색 영역
 */
const JaJopanSearch = () => {
    const dispatch = useDispatch();
    const pressCate1Rows = useSelector((store) => store.codeMgt.pressCate1Rows);
    const storeSearch = useSelector((store) => store.rcvArticle.jopanSearch);

    const [search, setSearch] = useState(initialState.jopanSearch);

    /**
     * change input vaule
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색 버튼
     */
    const handleClickSearch = () => {
        const pressDate = search.pressDate && search.pressDate.isValid() ? moment(search.pressDate).format(DB_DATEFORMAT) : null;
        let ns = {
            ...search,
            pressDate,
            page: 0,
        };
        dispatch(changeJopanSearchOption(ns));
        dispatch(getJopanList({ search: ns }));
    };

    useEffect(() => {
        let prsd = moment(storeSearch.pressDate, DB_DATEFORMAT);
        if (!prsd.isValid()) prsd = null;

        setSearch({
            ...storeSearch,
            pressDate: prsd,
        });
    }, [storeSearch]);

    /**
     * 초기화 버튼 검색 조건을 초기화 한다
     */
    const handleClickReset = () => {
        setSearch({ ...initialState.jopanSearch, sourceCode: '1' });
    };

    useEffect(() => {
        // 섹션 메뉴 출판카테고리(중앙) 코드
        if (!pressCate1Rows) {
            dispatch(getPressCate1());
        }
    }, [dispatch, pressCate1Rows]);

    useEffect(() => {
        let ns = {
            ...search,
            sourceCode: '1',
        };
        dispatch(changeJopanSearchOption(ns));
        dispatch(getJopanList({ search: ns }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <Form className="mb-14">
            <Form.Row className="align-items-center">
                {/* 섹션 */}
                <Col xs={3} className="p-0 pr-2">
                    <MokaInput as="select" name="section" value={search.section} onChange={handleChangeValue}>
                        <option value="all">섹션 전체</option>
                        {pressCate1Rows &&
                            pressCate1Rows.map((code) => (
                                <option key={code.id} value={code.cdNmEtc1}>
                                    {code.name}
                                </option>
                            ))}
                    </MokaInput>
                </Col>

                {/* 조판 일자 */}
                <MokaInput
                    as="dateTimePicker"
                    className="mr-2"
                    name="pressDate"
                    value={search.pressDate}
                    inputProps={{ timeFormat: null }}
                    onChange={(date) => {
                        if (typeof date === 'object') {
                            setSearch({ ...search, pressDate: date });
                        } else if (date === '') {
                            setSearch({ ...search, pressDate: null });
                        }
                    }}
                />

                {/* 호 */}
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput placeholder="호" name="ho" value={search.ho} onChange={handleChangeValue} />
                </Col>

                {/* 면 */}
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput placeholder="면" name="myun" value={search.myun} onChange={handleChangeValue} />
                </Col>

                {/* 버튼 */}
                <div className="d-flex">
                    <Button className="mr-1" variant="searching" onClick={handleClickSearch}>
                        검색
                    </Button>
                    <Button variant="negative" onClick={handleClickReset}>
                        초기화
                    </Button>
                </div>
            </Form.Row>
        </Form>
    );
};

export default JaJopanSearch;
