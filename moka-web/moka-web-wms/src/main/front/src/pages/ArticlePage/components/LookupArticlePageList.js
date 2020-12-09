import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { ITEM_AP } from '@/constants';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaTable } from '@components';
import { initialState, getArticlePageLookupList, getArticlePageLookup, changeLookupSearchOption, clearLookup, GET_ARTICLE_PAGE_LOOKUP_LIST } from '@store/articlePage';
import columnDefs from './LookupArticlePageListColumns';

const propTypes = {
    /**
     * seq의 타입
     */
    seqType: PropTypes.oneOf([ITEM_AP]),
    /**
     * seq
     */
    seq: PropTypes.number,
    /**
     * show === true이면 리스트를 조회한다
     */
    show: PropTypes.bool,
    /**
     * row의 append 버튼 클릭 이벤트
     */
    onAppend: PropTypes.func,
    /**
     * row의 append 버튼 클릭 이벤트
     */
    onPreview: PropTypes.func,
};
const defaultProps = {
    show: true,
};

/**
 * seq, seqType을 검색조건으로 사용하는 Lookup 기사페이지 리스트
 */
const LookupArticlePageList = (props) => {
    const { seq, seqType, show, onLoad, onPreview } = props;
    const dispatch = useDispatch();

    const { list, search: storeSearch, total, loading, latestDomainId, searchTypeList } = useSelector((store) => ({
        list: store.articlePage.lookup.list,
        search: store.articlePage.lookup.search,
        total: store.articlePage.lookup.total,
        loading: store.loading[GET_ARTICLE_PAGE_LOOKUP_LIST],
        latestDomainId: store.auth.latestDomainId,
        searchTypeList: store.articlePage.searchTypeList,
    }));

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    // state
    const [search, setSearch] = useState(initialState.lookup.search);
    const [rowData, setRowData] = useState([]);
    const [selected, setSelected] = useState({});

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getArticlePageLookupList(changeLookupSearchOption(temp)));
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        handleChangeSearchOption({ key: 'page', value: 0 });
    };

    /**
     * row클릭
     * @param {object} data row data
     */
    const handleRowClicked = (data) => {
        setSelected(data);
    };

    /**
     * 로드 버튼 클릭
     * @param {object} data row data
     */
    const handleClickLoad = useCallback(
        (data) => {
            if (onLoad) {
                // 상세 데이터를 조회한다
                const option = {
                    artPageSeq: data.artPageSeq,
                    callback: (response) => {
                        onLoad(response);
                    },
                };
                dispatch(getArticlePageLookup(option));
            }
        },
        [dispatch, onLoad],
    );

    /**
     * 태그 삽입 버튼 클릭
     * @param {object} data row data
     */
    const handleClickPreview = useCallback(
        (data) => {
            if (onPreview) {
                onPreview(data, ITEM_AP);
            }
        },
        [onPreview],
    );

    useEffect(() => {
        return () => {
            dispatch(clearLookup());
        };
    }, [dispatch]);

    useEffect(() => {
        // row 생성
        setRowData(
            list.map((data) => ({
                ...data,
                handleClickLoad,
                handleClickPreview,
            })),
        );
    }, [handleClickLoad, handleClickPreview, list]);

    useEffect(() => {
        if (show) {
            dispatch(
                getArticlePageLookupList(
                    changeLookupSearchOption({
                        ...initialState.lookup.search,
                        keyword: seq,
                        searchType: seqType === ITEM_AP ? 'artPageSeq' : '',
                        domainId: latestDomainId,
                    }),
                ),
            );
        }
    }, [show, latestDomainId, dispatch, seq, seqType]);

    return (
        <>
            <MokaCard titleClassName="mb-0" title="관련 기사페이지">
                <Form className="mb-2">
                    {/* 검색조건, 키워드 */}
                    <Form.Row>
                        <Col xs={5} className="p-0 pr-2">
                            <MokaInputLabel
                                label="구분"
                                labelWidth={28}
                                className="mb-0"
                                as="select"
                                value={search.searchType}
                                onChange={(e) => {
                                    setSearch({
                                        ...search,
                                        searchType: e.target.value,
                                    });
                                }}
                            >
                                {searchTypeList.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </MokaInputLabel>
                        </Col>
                        <Col xs={7} className="p-0">
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

                {/* ag-grid table */}
                <MokaTable
                    agGridHeight={649}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onRowNodeId={(data) => data.artPageSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    displayPageNum={3}
                    onChangeSearchOption={handleChangeSearchOption}
                    preventRowClickCell={['append', 'preview']}
                    selected={selected.artPageSeq}
                />
            </MokaCard>
        </>
    );
};

LookupArticlePageList.propTypes = propTypes;
LookupArticlePageList.defaultProps = defaultProps;

export default LookupArticlePageList;
