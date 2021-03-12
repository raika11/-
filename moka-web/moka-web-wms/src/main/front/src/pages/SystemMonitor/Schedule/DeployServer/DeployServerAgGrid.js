import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import columnDefs from './DeployServerAgGridColumns';
import { GET_DISTRIBUTE_SERVER_LIST, getDistributeServerList, changeDeployServerSearchOption } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 배포 서버 목록 AgGrid
 */
const DeployServerAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const total = useSelector((store) => store.schedule.deployServer.total);
    const list = useSelector((store) => store.schedule.deployServer.list);
    const search = useSelector((store) => store.schedule.deployServer.search);
    const server = useSelector((store) => store.schedule.deployServer.server);
    const loading = useSelector((store) => store.loading[GET_DISTRIBUTE_SERVER_LIST]);

    /**
     * 테이블 row 클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`${match.path}/deploy-server/${row.serverSeq}`);
        },
        [history, match.path],
    );

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getDistributeServerList(changeDeployServerSearchOption(temp)));
        },
        [dispatch, search],
    );

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={list}
            onRowNodeId={(row) => row.serverSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={server.serverSeq}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default DeployServerAgGrid;
