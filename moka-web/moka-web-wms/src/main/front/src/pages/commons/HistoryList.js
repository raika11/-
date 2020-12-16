import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import moment from 'moment';
import { ITEM_PG, ITEM_AP, ITEM_TP, ITEM_CT, DB_DATEFORMAT } from '@/constants';
import { MokaCard, MokaTable, MokaSearchInput, MokaInput, MokaInputLabel } from '@components';
import { initialState, changeSearchOption, getHistoryList, GET_HISTORY_LIST, clearStore, getHistory } from '@store/history';
import toast from '@utils/toastUtil';
import columDefs from './HistoryListColumns';

const propTypes = {
    /**
     * seq의 타입
     */
    seqType: PropTypes.oneOf([ITEM_TP, ITEM_CT, ITEM_AP, ITEM_PG]),
    /**
     * seq
     */
    seq: PropTypes.number,
    /**
     * show === true이면 리스트를 조회한다
     */
    show: PropTypes.bool,
    /**
     * row의 load 버튼 클릭 이벤트
     */
    onLoad: PropTypes.func,
};
const defaultProps = {
    show: true,
};

/**
 * 우측 히스토리 목록
 */
const HistoryList = (props) => {
    const { show, seq, seqType, onLoad } = props;
    const dispatch = useDispatch();
    const { search: storeSearch, loading, total, list } = useSelector(
        (store) => ({
            search: store.history.search,
            loading: store.loading[GET_HISTORY_LIST],
            total: store.history.total,
            list: store.history.list,
        }),
        shallowEqual,
    );

    // state
    const [search, setSearch] = useState(initialState.search);
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * 날짜 변경
     */
    const handleDate = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, regDt: moment(date).format(DB_DATEFORMAT) });
        } else if (date === '') {
            setSearch({ ...search, regDt: null });
        }
    };

    /**
     * 검색 버튼
     */
    const handleSearch = () => {
        if (search.seq && search.seqType) {
            dispatch(
                getHistoryList(
                    changeSearchOption({
                        ...search,
                        page: 0,
                    }),
                ),
            );
        } else {
            toast.error(
                seqType === ITEM_TP
                    ? '템플릿을 선택해주세요'
                    : seqType === ITEM_CT
                    ? '컨테이너를 선택해주세요'
                    : seqType === ITEM_AP
                    ? '기사페이지를 선택해주세요'
                    : '페이지를 선택해주세요',
            );
        }
    };

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getHistoryList(changeSearchOption(temp)));
    };

    /**
     * row 클릭
     */
    const handleRowClicked = (data) => {};

    /**
     * 로드 버튼 클릭
     * @param {object} data row data
     */
    const handleClickLoad = useCallback(
        (data) => {
            // 히스토리 상세 데이터를 조회한다
            dispatch(
                getHistory({
                    seq: data.seq,
                    search: {
                        seq,
                        seqType,
                    },
                    callback: (response) => {
                        if (onLoad) {
                            onLoad(response);
                        }
                    },
                }),
            );
        },
        [dispatch, onLoad, seq, seqType],
    );

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    useEffect(() => {
        if (show && seq) {
            dispatch(
                getHistoryList(
                    changeSearchOption({
                        ...initialState.search,
                        seq,
                        seqType,
                        page: 0,
                    }),
                ),
            );
        } else {
            dispatch(clearStore());
        }
    }, [show, seq, seqType, dispatch]);

    useEffect(() => {
        setRowData(
            list.map((l) => ({
                ...l,
                handleClickLoad,
            })),
        );
    }, [handleClickLoad, list]);

    return (
        <MokaCard title="히스토리" titleClassName="mb-0" bodyClassName="d-flex flex-column">
            <Form>
                {/* 날짜 검색 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="날짜"
                        as="dateTimePicker"
                        labelWidth={28}
                        className="mb-0 w-100"
                        inputProps={{
                            timeFormat: null,
                        }}
                        value={moment(search.regDt, DB_DATEFORMAT)}
                        onChange={handleDate}
                    />
                </Form.Row>
                <Form.Row className="mb-2">
                    {/* 검색조건 */}
                    <Col xs={4} className="p-0 pr-2">
                        <MokaInput
                            as="select"
                            className="mb-0"
                            value={search.searchType || undefined}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    searchType: e.target.value,
                                });
                            }}
                        >
                            {initialState.searchTypeList.map((searchType) => (
                                <option value={searchType.id} key={searchType.id}>
                                    {searchType.name}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    {/* 키워드 */}
                    <Col xs={8} className="p-0 mb-0">
                        <MokaSearchInput
                            value={search.keyword}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    keyword: e.target.value,
                                });
                            }}
                            onSearch={handleSearch}
                        />
                    </Col>
                </Form.Row>
            </Form>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columDefs}
                rowData={rowData}
                onRowNodeId={(history) => history.seq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['load']}
            />
        </MokaCard>
    );
};

HistoryList.propTypes = propTypes;
HistoryList.defaultProps = defaultProps;

export default HistoryList;
