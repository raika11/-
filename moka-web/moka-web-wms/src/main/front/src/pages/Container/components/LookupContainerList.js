import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { ITEM_PG, ITEM_AP, ITEM_CT } from '@/constants';
import { MokaCard, MokaInput, MokaSearchInput, MokaTable } from '@components';
import { initialState, getContainerLookupList, changeLookupSearchOption, clearLookup, getContainerLookup, GET_CONTAINER_LOOKUP_LIST } from '@store/container';
import columnDefs, { ctColumnDefs } from './LookupContainerListColumns';
import { ContainerHtmlModal } from '@pages/Container/modals';

const propTypes = {
    /**
     * seq의 타입
     */
    seqType: PropTypes.oneOf([ITEM_CT, ITEM_AP, ITEM_PG]),
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
     * row의 load 버튼 클릭 이벤트
     */
    onLoad: PropTypes.func,
};
const defaultProps = {
    show: true,
};

/**
 * seq, seqType을 검색조건으로 사용하는 Lookup 컨테이너 리스트
 */
const LookupContainerList = (props) => {
    const { seq, seqType, show, onAppend, onLoad } = props;
    const dispatch = useDispatch();

    const { list, search: storeSearch, total, loading, latestDomainId } = useSelector((store) => ({
        list: store.container.lookup.list,
        search: store.container.lookup.search,
        total: store.container.lookup.total,
        loading: store.loading[GET_CONTAINER_LOOKUP_LIST],
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
        dispatch(getContainerLookupList(changeLookupSearchOption(temp)));
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
     * 태그 삽입 버튼 클릭
     * @param {object} data row data
     */
    const handleClickAppend = useCallback(
        (data) => {
            if (onAppend) {
                onAppend(data, ITEM_CT);
            }
        },
        [onAppend],
    );

    /**
     * 링크 버튼 클릭
     * @param {object} data row data
     */
    const handleClickLink = (data) => {
        window.open(`/container/${data.containerSeq}`);
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
                    containerSeq: data.containerSeq,
                    callback: (response) => {
                        onLoad(response);
                    },
                };
                dispatch(getContainerLookup(option));
            }
        },
        [dispatch, onLoad],
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
                handleClickAppend,
                handleClickLink,
            })),
        );
    }, [handleClickAppend, handleClickLoad, list]);

    useEffect(() => {
        if (show) {
            dispatch(
                getContainerLookupList(
                    changeLookupSearchOption({
                        ...initialState.lookup.search,
                        keyword: seq,
                        searchType: seqType === ITEM_PG ? 'pageSeq' : seqType === ITEM_AP ? 'artPageSeq' : seqType === ITEM_CT ? 'containerSeq' : '',
                        domainId: latestDomainId,
                    }),
                ),
            );
        }
    }, [show, latestDomainId, dispatch, seq, seqType]);

    return (
        <MokaCard titleClassName="mb-0" title="관련 컨테이너" bodyClassName="d-flex flex-column">
            <Form className="mb-2">
                {/* 검색조건, 키워드 */}
                <Form.Row>
                    <Col xs={4} className="p-0 pr-2">
                        <MokaInput
                            as="select"
                            value={search.searchType}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    searchType: e.target.value,
                                });
                            }}
                        >
                            {seqType === ITEM_CT && <option value="containerSeq">컨테이너ID</option>}
                            {seqType === ITEM_PG && <option value="pageSeq">페이지ID</option>}
                            {seqType === ITEM_AP && <option value="artPageSeq">기사페이지ID</option>}
                            {initialState.searchTypeList.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    <Col xs={8} className="p-0">
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

            {/* 버튼 그룹 */}
            {seqType !== ITEM_CT && (
                <div className="d-flex mb-10 justify-content-end">
                    <Button variant="positive" onClick={() => window.open('/container')}>
                        컨테이너 등록
                    </Button>
                </div>
            )}

            {/* ag-grid table */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={seqType === ITEM_CT ? ctColumnDefs : columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.containerSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={3}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['append', 'link', 'load']}
                selected={selected.containerSeq}
            />

            <ContainerHtmlModal
                containerSeq={selected.containerSeq}
                show={showModal}
                containerSave={seqType === ITEM_PG || seqType === ITEM_AP ? true : false}
                onHide={() => {
                    setShowModal(false);
                    setSelected({});
                }}
            />
        </MokaCard>
    );
};

LookupContainerList.propTypes = propTypes;
LookupContainerList.defaultProps = defaultProps;

export default LookupContainerList;
