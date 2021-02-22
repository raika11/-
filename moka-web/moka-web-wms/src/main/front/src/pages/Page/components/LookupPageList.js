import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ITEM_PG } from '@/constants';
import { MokaCard, MokaInput, MokaSearchInput, MokaTable } from '@components';
import { initialState, getPageLookupList, changeLookupSearchOption, clearLookup, getPageLookup, GET_PAGE_LOOKUP_LIST } from '@store/page';
import columnDefs from './LookupPageListColumns';
import { PageHtmlModal } from '@pages/Page/modals';

const propTypes = {
    /**
     * seq의 타입
     */
    seqType: PropTypes.oneOf([ITEM_PG]),
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
 * seq, seqType을 검색조건으로 사용하는 Lookup 페이지 리스트
 */
const LookupPageList = (props) => {
    const { seq, seqType, show, onLoad } = props;
    const dispatch = useDispatch();

    const { list, search: storeSearch, total, loading, latestDomainId } = useSelector((store) => ({
        list: store.page.lookup.list,
        search: store.page.lookup.search,
        total: store.page.lookup.total,
        loading: store.loading[GET_PAGE_LOOKUP_LIST],
        latestDomainId: store.auth.latestDomainId,
    }));

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    // state
    const [search, setSearch] = useState(initialState.lookup.search);
    const [rowData, setRowData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState({});

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getPageLookupList(changeLookupSearchOption(temp)));
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
        setShowModal(true);
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
                    pageSeq: data.pageSeq,
                    callback: (response) => {
                        onLoad(response);
                    },
                };
                dispatch(getPageLookup(option));
            }
        },
        [dispatch, onLoad],
    );

    /**
     * preview 버튼 클릭
     * @param {object} data row data
     */
    const handleClickPreview = (data) => {
        window.open(`//${data.domain.domainUrl}${data.pageUrl}`);
    };

    /**
     * 링크 버튼 클릭
     * @param {object} data row data
     */
    const handleClickLink = (data) => {
        window.open(`/page/${data.pageSeq}`);
    };

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
                handleClickLink,
                handleClickPreview,
            })),
        );
    }, [handleClickLoad, list]);

    useEffect(() => {
        if (show) {
            dispatch(
                getPageLookupList(
                    changeLookupSearchOption({
                        ...initialState.lookup.search,
                        keyword: seq,
                        searchType: seqType === ITEM_PG ? 'pageSeq' : '',
                        domainId: latestDomainId,
                    }),
                ),
            );
        }
    }, [show, latestDomainId, dispatch, seq, seqType]);

    return (
        <MokaCard title="관련 페이지" bodyClassName="d-flex flex-column">
            <Form className="mb-14">
                {/* 검색조건, 키워드 */}
                <Form.Row>
                    <div className="mr-2 flex-shrink-0">
                        <MokaInput
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
                            {initialState.searchTypeList.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>
                    <MokaSearchInput
                        className="flex-fill"
                        value={search.keyword}
                        onChange={(e) => {
                            setSearch({
                                ...search,
                                keyword: e.target.value,
                            });
                        }}
                        onSearch={handleSearch}
                    />
                </Form.Row>
            </Form>

            {/* 버튼 그룹 */}
            {seqType !== ITEM_PG && (
                <div className="d-flex mb-14 justify-content-end">
                    <Button variant="positive" onClick={() => window.open('/page/add')}>
                        페이지 등록
                    </Button>
                </div>
            )}

            {/* ag-grid table */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.pageSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={3}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['load', 'preview', 'link']}
                selected={selected.pageSeq}
            />

            <PageHtmlModal
                pageSeq={selected.pageSeq}
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setSelected({});
                }}
            />
        </MokaCard>
    );
};

LookupPageList.propTypes = propTypes;
LookupPageList.defaultProps = defaultProps;

export default LookupPageList;
