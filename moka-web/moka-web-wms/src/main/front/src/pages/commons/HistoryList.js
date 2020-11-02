import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { ITEM_PG, ITEM_SK, ITEM_TP } from '@/constants';
import { defaultHistorySearchType, relationDSAgGridHeight } from './index';
import { MokaCard, MokaTable, MokaSearchInput, MokaInputLabel } from '@components';
import { initialState, changeSearchOption, getHistoryList, GET_HISTORY_LIST, clearStore, getHistory } from '@store/history';
import columDefs from './HistoryListColums';

const propTypes = {
    /**
     * seq의 타입
     */
    seqType: PropTypes.oneOf([ITEM_TP, ITEM_SK, ITEM_PG]),
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
     * 검색 버튼
     */
    const handleSearch = () => {
        dispatch(
            getHistoryList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
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
        <MokaCard title="히스토리" titleClassName="mb-0">
            <Form>
                <Form.Row className="mb-2">
                    <Col xs={4} className="p-0 pr-2">
                        <MokaInputLabel
                            label="구분"
                            as="select"
                            labelWidth={28}
                            className="mb-0"
                            value={search.searchType || undefined}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    searchType: e.target.value,
                                });
                            }}
                        >
                            {defaultHistorySearchType.map((searchType) => (
                                <option value={searchType.id} key={searchType.id}>
                                    {searchType.name}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
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
                agGridHeight={relationDSAgGridHeight}
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
