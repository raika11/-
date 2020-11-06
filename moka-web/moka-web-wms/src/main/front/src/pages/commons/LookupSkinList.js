import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { ITEM_SK } from '@/constants';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaTable } from '@components';
import { initialState, getContainerLookupList, changeLookupSearchOption, clearLookup, GET_CONTAINER_LOOKUP_LIST } from '@store/container';
import columnDefs from './LookupSkinListColumns';
import { defaultContainerSearchType, LookupAgGridHeight } from '@pages/commons';
// import ContainerHtmlModal from './ContainerHtmlModal';

const propTypes = {
    /**
     * seq의 타입
     */
    seqType: PropTypes.oneOf([ITEM_SK]),
    /**
     * seq
     */
    seq: PropTypes.number,
    /**
     * show === true이면 리스트를 조회한다
     */
    show: PropTypes.bool,
};
const defaultProps = {
    show: true,
};

/**
 * seq, seqType을 검색조건으로 사용하는 Lookup 기사타입 리스트
 */
const LookupSkinList = (props) => {
    const { seq, seqType, show } = props;
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
     * 링크 버튼 클릭
     * @param {object} data row data
     */
    const handleClickLink = (data) => {
        window.open(`/skin/${data.skinSeq}`);
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
                handleClickLink,
            })),
        );
    }, [list]);

    useEffect(() => {
        if (show) {
            dispatch(
                getContainerLookupList(
                    changeLookupSearchOption({
                        ...initialState.lookup.search,
                        keyword: seq,
                        searchType: seqType === ITEM_SK ? 'skinSeq' : '',
                        domainId: latestDomainId,
                    }),
                ),
            );
        }
    }, [show, latestDomainId, dispatch, seq, seqType]);

    return (
        <>
            <MokaCard titleClassName="mb-0" title="기사타입 검색">
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
                                {seqType === ITEM_SK && <option value="skinSeq">기사타입ID</option>}
                                {defaultContainerSearchType.map((type) => (
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

                {/* 버튼 그룹 */}
                <div className="d-flex mb-10 justify-content-end">
                    <Button variant="dark" onClick={() => window.open('/skin')}>
                        기사타입 추가
                    </Button>
                </div>

                {/* ag-grid table */}
                <MokaTable
                    agGridHeight={LookupAgGridHeight}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onRowNodeId={(data) => data.skinSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    preventRowClickCell={['link']}
                    selected={selected.skinSeq}
                />
            </MokaCard>
            {/* <ContainerHtmlModal
                containerSeq={selected.skinSeq}
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setSelected({});
                }}
            /> */}
        </>
    );
};

LookupSkinList.propTypes = propTypes;
LookupSkinList.defaultProps = defaultProps;

export default LookupSkinList;
