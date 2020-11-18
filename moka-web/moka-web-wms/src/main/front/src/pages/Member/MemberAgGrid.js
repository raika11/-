import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { GET_MEMBER_LIST, changeSearchOption, getMemberList } from '@store/member';
import { columnDefs } from './MemberAgGridColumns';

/**
 * 도메인 AgGrid 목록
 */
const MemberAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [memberRows, setMemberRows] = useState([]);
    const { member, list, total, search, loading, statusList } = useSelector(
        (store) => ({
            member: store.member.member,
            list: store.member.list,
            total: store.member.total,
            search: store.member.search,
            loading: store.loading[GET_MEMBER_LIST],
            statusList: store.app.MEMBER_STATUS_CODE,
        }),
        shallowEqual,
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((rowData) => history.push(`/member/${rowData.memberId}`), [history]);

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getMemberList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    const getStatusName = useCallback(
        (code) => {
            let statusName = '';
            for (let i = 0; i < statusList.length; i++) {
                const status = statusList[i];
                if (status.code === code) {
                    statusName = status.name;
                }
            }
            return statusName;
        },
        [statusList],
    );

    useEffect(() => {
        setMemberRows(
            list.map((row) => ({
                memberId: row.memberId,
                memberNm: row.memberNm,
                email: row.email,
                status: getStatusName(row.status),
                dept: row.dept,
                mobilePhone: row.mobilePhone,
                remark: row.remark,
            })),
        );
    }, [getStatusName, list]);

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={memberRows}
            onRowNodeId={(rowData) => rowData.memberId}
            agGridHeight={639}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={member.memberId}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default MemberAgGrid;
