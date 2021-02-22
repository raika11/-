import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
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
    const [searchTypeList, setSearchTypeList] = useState(initialState.searchTypeList);
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
        if (seqType === ITEM_PG) {
            setSearchTypeList(
                produce(initialState.searchTypeList, (draft) => {
                    draft.splice(1, 0, { id: 'pageSeq', name: '페이지ID' });
                }),
            );
        } else if (seqType === ITEM_AP) {
            setSearchTypeList(
                produce(initialState.searchTypeList, (draft) => {
                    draft.splice(1, 0, { id: 'artPageSeq', name: '기사페이지ID' });
                }),
            );
        }
    }, [seqType]);

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
        <MokaCard title="관련 컨테이너" bodyClassName="d-flex flex-column">
            <Form className="mb-14">
                {/* 검색조건, 키워드 */}
                <Form.Row>
                    <div className="mr-2 flex-shrink-0">
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
                            {searchTypeList.map((type) => (
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
            {seqType !== ITEM_CT && (
                <div className="d-flex mb-14 justify-content-end">
                    <Button variant="positive" onClick={() => window.open('/container/add')}>
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
