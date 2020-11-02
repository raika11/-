import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { ITEM_PG, ITEM_SK } from '@/constants';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaTable } from '@components';
import { initialState, getContainerList, changeSearchOption, clearStore, GET_CONTAINER_LIST } from '@store/container';
import { columnDefs } from './RelationContainerListColumns';
import { defaultContainerSearchType, relationUNAgGridHeight } from '@pages/commons';
import ContainerHtmlModal from './ContainerHtmlModal';

const propTypes = {
    /**
     * relSeq의 타입
     */
    relSeqType: PropTypes.oneOf([ITEM_PG, ITEM_SK]),
    /**
     * relSeq
     */
    relSeq: PropTypes.number,
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
 * relSeq와
 * 관련된 하위(자식의) 컨테이너 리스트
 */
const RelationContainerList = (props) => {
    const { relSeq, relSeqType, show, onAppend } = props;
    const dispatch = useDispatch();

    const { list, search: storeSearch, total, loading, latestDomainId } = useSelector((store) => ({
        list: store.container.list,
        search: store.container.search,
        total: store.container.total,
        loading: store.loading[GET_CONTAINER_LIST],
        latestDomainId: store.auth.latestDomainId,
    }));

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    // state
    const [search, setSearch] = useState(initialState.search);
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
        dispatch(getContainerList(changeSearchOption(temp)));
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
        window.open(`/container/${data.containerSeq}`);
    };

    useEffect(() => {
        return () => {
            dispatch(clearStore());
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
                getContainerList(
                    changeSearchOption({
                        ...initialState.search,
                        keyword: relSeq,
                        searchType: relSeqType === ITEM_PG ? 'pageSeq' : 'skinSeq',
                        domainId: latestDomainId,
                    }),
                ),
            );
        }
    }, [show, latestDomainId, dispatch, relSeq, relSeqType]);

    return (
        <>
            <MokaCard titleClassName="mb-0" title="컨테이너 검색">
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
                                {relSeqType === ITEM_PG && <option value="pageSeq">페이지ID</option>}
                                {relSeqType === ITEM_SK && <option value="skinSeq">기사타입ID</option>}
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
                    <Button variant="dark" onClick={() => window.open('/container')}>
                        컨테이너 추가
                    </Button>
                </div>

                {/* ag-grid table */}
                <MokaTable
                    agGridHeight={relationUNAgGridHeight}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onRowNodeId={(data) => data.containerSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    preventRowClickCell={['append', 'link']}
                />
            </MokaCard>
            <ContainerHtmlModal containerSeq={selected.containerSeq} show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

RelationContainerList.propTypes = propTypes;
RelationContainerList.defaultProps = defaultProps;

export default RelationContainerList;
