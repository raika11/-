import React, { useState, useEffect, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './RelEditFormAgGridColumns';
import { getEditFormList, GET_EDIT_FORM_LIST, changeSearchOption } from '@store/editForm';

/**
 * 편집폼 검색 모달 AgGrid
 */
const RelEditFormAgGrid = ({ onRowClicked, onHide }) => {
    const dispatch = useDispatch();
    const { list, total, search, loading } = useSelector(
        (store) => ({
            editForm: store.editForm.editForm,
            list: store.editForm.list,
            total: store.editForm.total,
            search: store.editForm.search,
            loading: store.loading[GET_EDIT_FORM_LIST],
        }),
        shallowEqual,
    );
    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getEditFormList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 등록 버튼
     * @param {object} data data
     */
    const handleRowClicked = useCallback(
        (data) => {
            if (onRowClicked) {
                onRowClicked(data);
                onHide();
            }
        },
        [onRowClicked, onHide],
    );

    useEffect(() => {
        setRowData(
            list.map((f) => ({
                ...f,
                onClick: handleRowClicked,
            })),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            onRowNodeId={(data) => data.formSeq}
            rowData={rowData}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default RelEditFormAgGrid;
