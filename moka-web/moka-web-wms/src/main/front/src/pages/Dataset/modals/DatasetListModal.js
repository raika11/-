import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInputLabel, MokaSearchInput, MokaTable } from '@components';
import { initialState, getDatasetListModal, GET_DATASET_LIST_MODAL } from '@store/dataset';
import columnDefs from './DatasetListModalColumns';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';

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
const DatsetListModal = ({ show, onHide, onClickSave, onClickCancle, selected: defaultSelected, exclude, id }) => {
    const dispatch = useDispatch();
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const loading = useSelector(({ loading }) => loading[GET_DATASET_LIST_MODAL]);
    const [search, setSearch] = useState(initialState.search);
    const [total, setTotal] = useState(initialState.total);
    const [error, setError] = useState(initialState.error);
    const [selected, setSelected] = useState('');
    const [selectedDataset, setSelectedDataset] = useState({});
    const [rowData, setRowData] = useState([]);
    const [cnt, setCnt] = useState(0);

    /**
     * 리스트 조회 콜백
     */
    const responseCallback = ({ header, body }) => {
        if (header.success) {
            setRowData(
                body.list.map((data) => ({
                    ...data,
                    autoCreateYnName: data.autoCreateYn === 'Y' ? '자동형' : '편집형',
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
        setSelected('');
        setSelectedDataset({});
        setCnt(0);
        onHide();
    };

    /**
     * 등록 버튼 클릭
     */
    const handleClickSave = () => {
        if (onClickSave) onClickSave(selectedDataset);
        handleHide();
    };

    /**
     * 취소 버튼 클릭
     */
    const handleClickCancle = () => {
        if (onClickCancle) onClickCancle();
        handleHide();
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        dispatch(
            getDatasetListModal({
                search: {
                    ...search,
                    page: 0,
                },
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
        dispatch(getDatasetListModal({ search: temp, callback: responseCallback }));
    };

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((data) => {
        setSelectedDataset(data);
        setSelected(data.datasetSeq);
    }, []);

    /**
     * 체크박스 변경
     */
    const handleSelectionChanged = useCallback(
        (selectedNodes) => {
            if (selectedNodes.length > 0) {
                const sd = selectedNodes[0].data;
                if (sd.datasetSeq !== selected) {
                    setSelectedDataset(sd);
                    setSelected(sd.datasetSeq);
                }
            }
        },
        [selected],
    );

    useEffect(() => {
        // 선택된 값 셋팅
        setSelected(defaultSelected);
    }, [defaultSelected]);

    useEffect(() => {
        if (show && cnt < 1) {
            const ns = {
                ...initialState.search,
                domainId: latestDomainId,
                size: MODAL_PAGESIZE_OPTIONS[0],
                page: 0,
                exclude,
            };
            setSearch(ns);
            dispatch(
                getDatasetListModal({
                    search: ns,
                    callback: responseCallback,
                }),
            );
            setCnt(cnt + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latestDomainId, show, exclude, cnt]);

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleHide}
            title="데이터셋 검색"
            size="md"
            id={id}
            buttons={[
                { text: '등록', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickCancle },
            ]}
            draggable
            centered
        >
            <Form.Row className="mb-14">
                {/* 검색 조건 */}
                <div className="flex-shrink-0 mr-2">
                    <MokaInputLabel
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
                    </MokaInputLabel>
                </div>
                {/* 키워드 */}
                <MokaSearchInput
                    value={search.keyword}
                    className="flex-fill"
                    onChange={(e) => {
                        setSearch({
                            ...search,
                            keyword: e.target.value,
                        });
                    }}
                    onSearch={handleSearch}
                />
            </Form.Row>

            {/* ag-grid table */}
            <MokaTable
                agGridHeight={501}
                error={error}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(dataset) => dataset.datasetSeq}
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
