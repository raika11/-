import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import { getPressCate61 } from '@store/codeMgt';
import { initialState, getJopanList, changeJopanSearchOption } from '@store/rcvArticle';

/**
 * 수신기사 > 중앙선데이 조판 검색 영역
 */
const SundayJopanSearch = () => {
    const dispatch = useDispatch();
    const pressCate61Rows = useSelector(({ codeMgt }) => codeMgt.pressCate61Rows);
    const storeSearch = useSelector(({ rcvArticle }) => rcvArticle.jopanSearch);
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
        let ns = { ...search, pressDate, page: 0 };
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
        setSearch({ ...initialState.jopanSearch, sourceCode: '61' });
    };

    useEffect(() => {
        // 섹션 메뉴 출판카테고리(중앙선데이) 코드
        if (!pressCate61Rows) {
            dispatch(getPressCate61());
        }
    }, [dispatch, pressCate61Rows]);

    useEffect(() => {
        let ns = {
            ...search,
            sourceCode: '61',
        };
        dispatch(changeJopanSearchOption(ns));
        dispatch(getJopanList({ search: ns }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form className="mb-14">
            <Form.Row className="align-items-center">
                {/* 섹션 */}
                <Col xs={3} className="p-0 pr-2">
                    <MokaInput as="select" name="section" value={search.section} onChange={handleChangeValue}>
                        <option value="all">섹션 전체</option>
                        {pressCate61Rows &&
                            pressCate61Rows.map((code) => (
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
                    inputProps={{ timeFormat: null, timeDefault: 'start' }}
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

export default SundayJopanSearch;
