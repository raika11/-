import React, { useCallback, useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Group/GroupAgGridColumns';
import { useHistory } from 'react-router-dom';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {changeSearchOption, GET_GROUP_LIST, getGroupList, initialState} from '@store/group';

/**
 * group AgGrid 목록
 */
const GroupAgGrid = (props) => {
    const { onDelete } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const [search, setSearch] = useState(initialState);
    const [groupRows, setGroupRows] = useState([]);

    const { group, list, total, search: storeSearch, loading } = useSelector(
        (store) => ({
            group: store.group.group,
            list: store.group.list,
            total: store.group.total,
            search: store.group.search,
            loading: store.loading[GET_GROUP_LIST],
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
            dispatch(getGroupList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getGroupList());
    }, [dispatch]);

    useEffect(() => {
        setGroupRows(
            list.map((row) => ({
                id: String(row.groupCd),
                groupCd: row.groupCd,
                groupNm: row.groupNm,
                groupKorNm: row.groupKorNm,
                regId: row.regId,
                regDt: row.regDt, // 현재 서버에컬럼없음.
                onDelete,
            })),
        );
    }, [list, onDelete]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((list) =>{
        //console.log("list::" + this.list.id);
        history.push(`/group/${list.id}`);
    } , [history]);

    let count = 0;
    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={groupRows}
            onRowNodeId={(rowData) =>
            {
                //console.log("groupCd::" + rowData.groupCd);
                return parseInt(rowData.groupCd.replace('G',''));
            }
            }
            agGridHeight={600}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={group.id}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default GroupAgGrid;
