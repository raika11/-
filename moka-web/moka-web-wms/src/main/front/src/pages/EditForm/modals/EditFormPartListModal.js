import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { MokaModal, MokaInputLabel, MokaSearchInput, MokaTable } from '@components';
import columnDefs from './EditFormPartListModalColumns';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';
import { initialState, getEditFormPartListModal, GET_EDIT_FORM_PART_LIST_MODAL } from '@store/editForm';

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
};
const defaultProps = {};

/**
 * 폼의 파트 리스트 공통 모달
 */
const EditFormPartListModal = (props) => {
    const { show, onHide, onClickSave, onClickCancle, selected: defaultSelected, exclude } = props;
    const dispatch = useDispatch();

    const { loading } = useSelector((store) => ({
        loading: store.loading[GET_EDIT_FORM_PART_LIST_MODAL],
    }));

    // state
    const [search, setSearch] = useState(initialState.partSearch);
    const [total, setTotal] = useState(initialState.total);
    const [error, setError] = useState(initialState.error);
    const [selected, setSelected] = useState('');
    const [selectedEditForm, setSelectedEditForm] = useState({});
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
                body.list.map((b) => ({
                    ...b,
                    formName: b.editForm?.formName,
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
     * input 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'searchType') {
            setSearch({ ...search, searchType: value });
        } else if (name === 'keyword') {
            setSearch({ ...search, keyword: value });
        }
    };

    /**
     * 등록 버튼 클릭
     */
    const handleClickSave = () => {
        if (onClickSave) onClickSave(selectedEditForm);
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
        let ns = { ...search, page: 0 };

        if (ns.searchType === 'partSeq') {
            ns.partSeq = ns.keyword;
            delete ns.searchType;
            delete ns.keyword;
        } else {
            delete ns.partSeq;
        }

        dispatch(
            getEditFormPartListModal({
                search: ns,
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
        dispatch(
            getEditFormPartListModal({
                search: temp,
                callback: responseCallback,
            }),
        );
    };

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((data) => {
        setSelectedEditForm(data);
        setSelected(data.partSeq);
    }, []);

    /**
     * 체크박스 변경
     */
    const handleSelectionChanged = useCallback(
        (selectedNodes) => {
            if (selectedNodes.length > 0) {
                const sd = selectedNodes[0].data;
                if (sd.partSeq !== selected) {
                    setSelectedEditForm(sd);
                    setSelected(sd.partSeq);
                }
            }
        },
        [selected],
    );

    useEffect(() => {
        if (show && cnt < 1) {
            const ns = {
                ...initialState.partSearch,
                size: MODAL_PAGESIZE_OPTIONS[0],
                page: 0,
            };
            setSearch(ns);
            dispatch(
                getEditFormPartListModal({
                    search: ns,
                    callback: responseCallback,
                }),
            );
            setCnt(cnt + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, exclude, cnt]);

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleHide}
            title="폼 검색"
            size="md"
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
                        <MokaInputLabel as="select" className="mb-0" value={search.searchType} name="searchType" onChange={handleChangeValue}>
                            {initialState.searchTypeList.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                    {/* 키워드 */}
                    <Col xs={8} className="p-0">
                        <MokaSearchInput name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />
                    </Col>
                </Form.Row>
            </Form>

            {/* ag-grid table */}
            <MokaTable
                agGridHeight={501}
                error={error}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.partSeq}
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

EditFormPartListModal.propTypes = propTypes;
EditFormPartListModal.defaultProps = defaultProps;

export default EditFormPartListModal;
