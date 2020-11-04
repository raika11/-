import React, { useCallback, useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Group/GroupAgGridColumns';
import { useHistory } from 'react-router-dom';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {changeSearchOption, GET_GROUP_LIST, getGroupList, initialState} from '@store/group';


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

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((rowData) => history.push(`/group/${rowData.groupCd}`), [history]);

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
                regDt: row.regDt, // 현재 안나옴.
                onDelete,
            })),
        );
    }, [list]);

    return (
        <MokaTable
            columnDefs={columnDefs}
            agGridHeight={600}
            page={search.page}
            size={search.size}
            total={total}
            rowData={groupRows}
            onRowNodeId={(rowData) => {
                //console.log("aaaaaaaaaaaaaa:" + rowData);
                return rowData.groupCd}
            }
            //onRowClicked={handleRowClicked}
            //selected={group.groupCd}
            selected={group.groupCd}
            loading={loading}
            onChangeSearchOption={handleChangeSearchOption} // 페이지 아래 목록건수인데 동작을 안하네
        />
    );
};

export default GroupAgGrid;
