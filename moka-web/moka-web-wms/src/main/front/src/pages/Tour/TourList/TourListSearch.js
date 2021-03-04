import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@/components';
import { initialState, getTourApplyList, changeSearchOption } from '@/store/tour';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { messageBox } from '@utils/toastUtil';

/**
 * 신청 목록 검색
 */
const TourListSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.tour.search);
    const [search, setSearch] = useState(initialState.search);

    /**
     * 검색 버튼
     */
    const handleClickSearch = () => {
        dispatch(
            getTourApplyList(
                changeSearchOption({
                    ...search,
                    startTourDay: moment(search.startTourDay).format(DB_DATEFORMAT),
                    endTourDay: moment(search.endTourDay).format(DB_DATEFORMAT),
                    page: 0,
                }),
            ),
        );
    };

    /**
     * 검색 조건 초기화
     */
    const handleClickReset = () => {
        setSearch({ ...initialState.search, startTourDay: moment().format(DB_DATEFORMAT), endTourDay: moment().add(2, 'weeks').format(DB_DATEFORMAT), keyword: '' });
    };

    useEffect(() => {
        let st = moment(storeSearch.startTourDay);
        if (!st.isValid()) {
            st = null;
        }
        let nt = moment(storeSearch.endTourDay);
        if (!nt.isValid()) {
            nt = null;
        }
        setSearch({ ...storeSearch, startTourDay: st, endTourDay: nt });
    }, [storeSearch]);

    useEffect(() => {
        dispatch(
            getTourApplyList(
                changeSearchOption({
                    ...search,
                    startTourDay: moment().startOf('day').format(DB_DATEFORMAT),
                    endTourDay: moment().add(2, 'weeks').endOf('day').format(DB_DATEFORMAT),
                    page: 0,
                }),
            ),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        const diff = moment(search.endTourDay).diff(moment(search.startTourDay));
        if (diff < 0) {
            messageBox.alert('시작일은 종료일 보다 클 수 없습니다.');
            setSearch({ ...search, startTourDay: moment().startOf('day').format(DB_DATEFORMAT) });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search.startTourDay, search.endTourDay]);

    return (
        <Form className="mb-14">
            <Form.Row>
                <Col xs={5} className="p-0 pr-2 d-flex">
                    <MokaInput
                        className="mr-2"
                        as="dateTimePicker"
                        value={search.startTourDay}
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                        onChange={(date) => {
                            if (moment().subtract(1, 'y').diff(date) > 0) {
                                messageBox.alert('조회 기간은 현재일 기준 최대 1년입니다.');
                                setSearch({ ...search, startTourDay: moment().startOf('day').format(DB_DATEFORMAT) });
                            } else {
                                if (typeof date === 'object') {
                                    setSearch({ ...search, startTourDay: date });
                                } else {
                                    setSearch({ ...search, startTourDay: null });
                                }
                            }
                        }}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        value={search.endTourDay}
                        inputProps={{ timeFormat: null, timeDefault: 'end' }}
                        onChange={(date) => {
                            if (moment().add(1, 'y').diff(date) < 0) {
                                messageBox.alert('조회 기간은 현재일 기준 최대 1년입니다.');
                                setSearch({ ...search, endTourDay: moment().add(2, 'weeks').endOf('day').format(DB_DATEFORMAT) });
                            } else {
                                if (typeof date === 'object') {
                                    setSearch({ ...search, endTourDay: date });
                                } else {
                                    setSearch({ ...search, endTourDay: null });
                                }
                            }
                        }}
                    />
                </Col>
                <MokaSearchInput
                    className="mr-1 flex-fill"
                    placeholder="신청자 또는 단체명을 입력해주세요"
                    onSearch={handleClickSearch}
                    value={search.keyword}
                    onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                />
                <Button variant="negative" onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default TourListSearch;
