import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@/components';
import { initialState, clearSearch, getTourApplyList, changeSearchOption } from '@/store/tour';

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
                    page: 0,
                }),
            ),
        );
    };

    /**
     * 검색 조건 초기화
     */
    const handleClickReset = () => {
        setSearch({ ...initialState.search, startTourDay: null, endTourDay: null, keyword: '' });
        dispatch(clearSearch());
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getTourApplyList());
    }, [dispatch]);

    return (
        <Form>
            <Form.Row className="mb-2 d-flex">
                <div style={{ width: 140 }}>
                    <MokaInput
                        className="mb-0 mr-2"
                        as="dateTimePicker"
                        value={search.startTourDay}
                        inputProps={{ timeFormat: null }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, startTourDay: date });
                            } else {
                                setSearch({ ...search, startTourDay: null });
                            }
                        }}
                    />
                </div>
                <div style={{ width: 140 }}>
                    <MokaInput
                        className="mb-0 mr-2"
                        as="dateTimePicker"
                        value={search.endTourDay}
                        inputProps={{ timeFormat: null }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, endTourDay: date });
                            } else {
                                setSearch({ ...search, endTourDay: null });
                            }
                        }}
                    />
                </div>
                <div className="flex-fill">
                    <MokaSearchInput
                        className="mr-2"
                        placeholder="신청자 또는 단체명을 입력해주세요"
                        onSearch={handleClickSearch}
                        value={search.keyword}
                        onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                    />
                </div>
                <Button variant="negative" onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default TourListSearch;
