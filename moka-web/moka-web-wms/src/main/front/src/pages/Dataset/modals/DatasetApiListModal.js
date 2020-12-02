import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { MokaModal, MokaInputLabel, MokaSearchInput, MokaTable } from '@components';
import { initialState, GET_DATASET_LIST_MODAL, getDatasetApiList } from '@store/dataset';
import columnDefs from './DatasetApiListModalColumns';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';

export const { searchTypeList } = initialState;

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * 등록 버튼 클릭
     * @param {object} template 선택한 데이터셋데이터
     */
    onClickSave: PropTypes.func,
    /**
     * 취소 버튼 클릭
     */
    onClickCancle: PropTypes.func,
    /**
     * 선택된 데이터셋아이디
     */
    selected: PropTypes.number,
    /**
     * 제외 데이터셋아이디
     */
    exclude: PropTypes.any,
};
const defaultProps = {};

/**
 * 데이터셋 리스트 공통 모달
 */
const DatsetListModal = (props) => {
    const { show, onHide, onClickSave, onClickCancle, selected: defaultSelected, exclude } = props;
    const dispatch = useDispatch();

    const { apiCodeId, loading } = useSelector((store) => ({
        apiCodeId: store.dataset.search.apiCodeId,
        loading: store.loading[GET_DATASET_LIST_MODAL],
    }));

    // state
    const [search, setSearch] = useState(initialState.search);
    const [total, setTotal] = useState(initialState.total);
    const [error, setError] = useState(initialState.error);
    const [selected, setSelected] = useState('');
    const [selectedDataset, setSelectedDataset] = useState({});
    const [rowData, setRowData] = useState([]);
    const [cnt, setCnt] = useState(0);

    useEffect(() => {
        // 선택된 값 셋팅
        setSelected(defaultSelected);
    }, [defaultSelected]);

    /**
     * 리스트 조회 콜백
     */
    const responseCallback = ({ header, body }) => {
        if (header.success) {
            setRowData(
                body.list.map((data) => ({
                    ...data,
                    autoCreateYnName: data.autoCreateYn === 'Y' ? '자동형' : '수동형',
                })),
            );
            setTotal(body.totalCnt);
            setError(initialState.error);
        } else {
            setRowData([]);
            setTotal(initialState.total);
            setError(body);
        }
    };

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setRowData([]);
        setTotal(initialState.total);
        setError(null);
        setCnt(0);
        onHide();
    };

    /**
     * 등록 버튼 클릭
     */
    const handleClickSave = () => {
        if (onClickSave) onClickSave(selectedDataset, handleHide);
    };

    /**
     * 취소 버튼 클릭
     */
    const handleClickCancle = () => {
        setSearch(initialState.search);
        if (onClickCancle) onClickCancle();
        handleHide();
    };

    /**
     * 검색
     */
    const handleSearch = (search) => {
        dispatch(
            getDatasetApiList({
                search: { ...search, apiCodeId: apiCodeId, size: 100, page: 0, exclude },
                callback: responseCallback,
            }),
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
        setSearch(temp);
    };

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((data) => {
        setSelectedDataset(data);
        setSelected(data.id);
    }, []);

    const handleSelectionChanged = useCallback(
        (selectedNodes) => {
            if (selectedNodes.length > 0) {
                const sd = selectedNodes[0].data;
                if (sd.id !== selected) {
                    setSelectedDataset(sd);
                    setSelected(sd.id);
                }
            }
        },
        [selected],
    );

    useEffect(() => {
        if (show && cnt < 1) {
            handleSearch({
                ...search,
                apiCodeId: apiCodeId,
                size: 100,
                page: 0,
                exclude,
            });
            setCnt(cnt + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiCodeId, show, exclude, cnt]);

    return (
        <MokaModal
            show={show}
            onHide={handleHide}
            title="API 검색"
            size="md"
            width={600}
            buttons={[
                { text: '등록', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickCancle },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <Form.Row className="mb-2">
                    {/* 검색 조건 */}
                    <Col xs={4} className="p-0 pr-2">
                        <MokaInputLabel
                            label="구분"
                            labelWidth={45}
                            as="select"
                            className="mb-0"
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
                    {/* 키워드 */}
                    <Col xs={8} className="p-0">
                        <MokaSearchInput
                            value={search.keyword}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    keyword: e.target.value,
                                });
                            }}
                            onSearch={() => {
                                handleSearch(search);
                            }}
                        />
                    </Col>
                </Form.Row>
            </Form>

            {/* ag-grid table */}
            <MokaTable
                agGridHeight={501}
                error={error}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(dataset) => dataset.id}
                onRowClicked={handleRowClicked}
                onSelectionChanged={handleSelectionChanged}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                selected={selected}
                pageSizes={MODAL_PAGESIZE_OPTIONS}
            />
        </MokaModal>
    );
};

DatsetListModal.propTypes = propTypes;
DatsetListModal.defaultProps = defaultProps;

export default DatsetListModal;
