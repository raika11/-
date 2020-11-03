import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';
import { MokaTable } from '@components';
import columnDefs from './ContainerAgGridColumns';
import { GET_CONTAINER_LIST, getContainerList, changeSearchOption } from '@store/container';

const ContainerAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { total, list, search, container, loading } = useSelector((store) => ({
        total: store.container.total,
        list: store.container.list,
        search: store.container.search,
        container: store.container.container,
        loading: store.loading[GET_CONTAINER_LIST],
    }));

    /**
     * 예약어 추가 버튼 클릭
     */
    const handleAddClick = useCallback(() => history.push('/container'), [history]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClick = useCallback((container) => history.push(`/container/${container.containerSeq}`), [history]);

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getContainerList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                <Button variant="dark" onClick={handleAddClick}>
                    컨테이너 추가
                </Button>
            </div>
            {/* table */}
            <MokaTable
                columnDefs={columnDefs}
                rowData={list}
                onRowNodeId={(container) => container.containerSeq}
                agGridHeight={550}
                onRowClicked={handleRowClick}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                selected={container.containerSeq}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['delete']}
            />
        </>
    );
};

export default ContainerAgGrid;
