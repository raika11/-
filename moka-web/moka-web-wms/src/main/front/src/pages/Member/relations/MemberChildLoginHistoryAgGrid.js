import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { getLoginHistoryList, GET_LOGIN_HISTORY_LIST, initialState, changeHistorySearchOption, clearHistoryList } from '@store/member';
import { historyColumnDefs } from '../MemberAgGridColumns';

/**
 * 사용자 로그인 이력
 * @param history rect-router-dom useHisotry
 */
const MemberChildLoginHistoryAgGrid = () => {
    const { memberId: paramId } = useParams();
    const dispatch = useDispatch();
    const { historyList, loading } = useSelector(
        (store) => ({
            historyList: store.member.historyList,
            loading: store.loading[GET_LOGIN_HISTORY_LIST],
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (paramId) {
            dispatch(
                getLoginHistoryList(
                    clearHistoryList(),
                    changeHistorySearchOption({
                        ...initialState.historySearch,
                        memberId: paramId,
                    }),
                ),
            );
        } else {
            dispatch(clearHistoryList());
        }
    }, [dispatch, paramId]);

    useEffect(() => {
        if (paramId) {
        }
    }, [dispatch, paramId]);

    return <MokaTable agGridHeight={733} columnDefs={historyColumnDefs} rowData={historyList} onRowNodeId={(rowData) => rowData.seqNo} loading={loading} paging={false} />;
};

export default MemberChildLoginHistoryAgGrid;
