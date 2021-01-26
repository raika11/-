import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@components';
import { GET_EDIT_LOG_LIST, changeSearchOption, getEditLogList } from '@store/editLog';
import { columnDefs } from './EditLogAgGridColumn';

/**
 * 로그 테이블
 */
const EditLogAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_EDIT_LOG_LIST]);
    const { total, search, editLog, list } = useSelector(({ editLog }) => ({
        total: editLog.total,
        search: editLog.search,
        editLog: editLog.editLog,
        list: editLog.list,
    }));

    /**
     * 목록에서 Row클릭
     */
    const handleClickRow = (data) => history.push(`${match.path}/${data.seqNo}`);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(changeSearchOption(temp));
        dispatch(getEditLogList({ search: temp }));
    };

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            loading={loading}
            rowData={list}
            size={search.size}
            page={search.page}
            total={total}
            selected={editLog.seqNo}
            onRowNodeId={(row) => row.seqNo}
            onRowClicked={handleClickRow}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default EditLogAgGrid;
