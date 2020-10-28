import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { MokaModal, MokaInputLabel, MokaSearchInput, MokaTable } from '@components';
import { GET_DATASET_LIST, clearStore, getDatasetList, changeSearchOption } from '@store/dataset';
import columnDefs from './DatasetListModalColums';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';

export const defaultDatasetSearchType = [
    { id: 'all', name: '전체' },
    { id: 'datasetSeq', name: '데이터셋ID' },
    { id: 'datasetName', name: '데이터셋명' },
];

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

    const { latestDomainId, search, total, list, error, loading } = useSelector((store) => ({
        latestDomainId: store.auth.latestDomainId,
        search: store.dataset.search,
        total: store.dataset.total,
        list: store.dataset.list,
        error: store.dataset.error,
        loading: store.loading[GET_DATASET_LIST],
    }));

    // state
    const [selected, setSelected] = useState('');
    const [selectedDataset, setSelectedDataset] = useState({});
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        // 선택된 값 셋팅
        setSelected(defaultSelected);
    }, [defaultSelected]);

    useEffect(() => {
        // unmount 시 스토어 초기화
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    /**
     * 등록 버튼 클릭
     */
    const handleClickSave = () => {
        if (onClickSave) onClickSave(selectedDataset);
        onHide();
    };

    /**
     * 취소 버튼 클릭
     */
    const handleClickCancle = () => {
        if (onClickCancle) onClickCancle();
        onHide();
    };

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(
            getDatasetList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, search]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getDatasetList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((data) => {
        setSelectedDataset(data);
        setSelected(data.datasetSeq);
    }, []);

    useEffect(() => {
        dispatch(
            changeSearchOption({
                ...search,
                domainId: latestDomainId,
                size: MODAL_PAGESIZE_OPTIONS[0],
                page: 0,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, latestDomainId]);

    useEffect(() => {
        // rowData 변경
        if (list.length > 0) {
            setRowData(
                list.map((data) => ({
                    ...data,
                    autoCreateYnName: data.autoCreateYn === 'Y' ? '자동형' : '수동형',
                })),
            );
        } else {
            setRowData([]);
        }
    }, [list]);

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            title="데이터셋 검색"
            size="md"
            buttons={[
                { text: '등록', onClick: handleClickSave },
                { text: '취소', variant: 'gray150', onClick: handleClickCancle },
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
                                dispatch(
                                    changeSearchOption({
                                        ...search,
                                        searchType: e.target.value,
                                    }),
                                );
                            }}
                        >
                            {defaultDatasetSearchType.map((type) => (
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
                                dispatch(
                                    changeSearchOption({
                                        ...search,
                                        keyword: e.target.value,
                                    }),
                                );
                            }}
                            onSearch={handleSearch}
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
                onRowNodeId={(dataset) => dataset.datasetSeq}
                onRowClicked={handleRowClicked}
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
