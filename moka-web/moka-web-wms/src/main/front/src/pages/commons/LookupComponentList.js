import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { ITEM_PG, ITEM_CT, ITEM_SK } from '@/constants';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaTable } from '@components';
import { getComponentLookupList, changeLookupSearchOption, initialState, clearLookup, GET_COMPONENT_LOOKUP_LIST } from '@store/component';
import columnDefs from './LookupComponentListColums';
import { defaultComponentSearchType, LookupAgGridHeight } from '@pages/commons';
import TemplateHtmlModal from './TemplateHtmlModal';

const propTypes = {
    /**
     * seq의 타입
     */
    seqType: PropTypes.oneOf([ITEM_SK, ITEM_PG]),
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
};
const defaultProps = {
    show: true,
};

/**
 * seq, seqType을 검색조건으로 사용하는 Lookup 컴포넌트 리스트
 */
const LookupComponentList = (props) => {
    const { seq, seqType, show, onAppend } = props;
    const dispatch = useDispatch();

    const { list, search: storeSearch, total, loading, latestDomainId } = useSelector((store) => ({
        list: store.component.lookup.list,
        search: store.component.lookup.search,
        total: store.component.lookup.total,
        loading: store.loading[GET_COMPONENT_LOOKUP_LIST],
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
    const handlechangeLookupSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getComponentLookupList(changeLookupSearchOption(temp)));
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        handlechangeLookupSearchOption({ key: 'page', value: 0 });
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
                onAppend(data);
            }
        },
        [onAppend],
    );

    /**
     * 링크 버튼 클릭
     * @param {object} data row data
     */
    const handleClickLink = (data) => {
        window.open(`/component/${data.componentSeq}`);
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
                handleClickAppend,
                handleClickLink,
            })),
        );
    }, [handleClickAppend, list]);

    useEffect(() => {
        if (show) {
            dispatch(
                getComponentLookupList(
                    changeLookupSearchOption({
                        ...initialState.lookup.search,
                        keyword: seq,
                        searchType: seqType === ITEM_PG ? 'pageSeq' : seqType === ITEM_SK ? 'skinSeq' : seqType === ITEM_CT ? 'containerSeq' : '',
                        domainId: latestDomainId,
                    }),
                ),
            );
        } else {
            dispatch(clearLookup());
        }
    }, [show, latestDomainId, dispatch, seq, seqType]);

    return (
        <>
            <MokaCard titleClassName="mb-0" title="컴포넌트 검색">
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
                                {seqType === ITEM_PG && <option value="pageSeq">페이지ID</option>}
                                {seqType === ITEM_SK && <option value="skinSeq">기사타입ID</option>}
                                {seqType === ITEM_CT && <option value="containerSeq">컨테이너ID</option>}
                                {defaultComponentSearchType.map((type) => (
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
                    <Button variant="dark" onClick={() => window.open('/component')}>
                        컴포넌트 추가
                    </Button>
                </div>

                {/* ag-grid table */}
                <MokaTable
                    agGridHeight={LookupAgGridHeight}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onRowNodeId={(data) => data.componentSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onchangeLookupSearchOption={handlechangeLookupSearchOption}
                    preventRowClickCell={['append', 'link']}
                />
            </MokaCard>
            <TemplateHtmlModal templateSeq={selected.templateSeq} show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

LookupComponentList.propTypes = propTypes;
LookupComponentList.defaultProps = defaultProps;

export default LookupComponentList;
