import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { GET_EDIT_FORM_LIST, getEditFormList, initialState } from '@store/editForm';
import { columnDefs } from './EditFormAgGridColumns';

/**
 * 편집폼 AgGrid 목록
 */
const EditFormAgGrid = (props) => {
    const { onDelete } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const [search, setSearch] = useState(initialState);
    const [editFormRows, setEditFormRows] = useState([]);
    const { editForm, list, total, search: storeSearch, loading } = useSelector(
        (store) => ({
            editForm: store.editForm.editForm,
            list: store.editForm.list,
            total: store.editForm.total,
            search: store.editForm.search,
            loading: store.loading[GET_EDIT_FORM_LIST],
        }),
        shallowEqual,
    );

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getEditFormList());
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((rowData) => history.push(`/edit-form/${rowData.formSeq}`), [history]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getEditFormList());
    }, [dispatch]);

    useEffect(() => {
        setEditFormRows(
            list.map((row) => ({
                formSeq: String(row.formSeq),
                formId: row.formId,
                formName: row.formName,
                serviceUrl: row.serviceUrl,
                delete: onDelete,
            })),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={editFormRows}
            onRowNodeId={(rowData) => rowData.formSeq}
            agGridHeight={600}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={editForm.formSeq}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default EditFormAgGrid;
