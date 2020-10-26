import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import columnDefs from './ComponentAgGridColums';

import Button from 'react-bootstrap/Button';
import { MokaTable } from '@components';
import { GET_COMPONENT_LIST, getComponentList, changeSearchOption } from '@store/component';

/**
 * 컴포넌트 AgGrid 컴포넌트
 */
const ComponentAgGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { total, list, search, loading, component } = useSelector((store) => ({
        total: store.component.total,
        list: store.component.list,
        search: store.component.search,
        loading: store.loading[GET_COMPONENT_LIST],
        component: store.component.component,
    }));

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getComponentList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (component) => {
            history.push(`/component/${component.componentSeq}`);
        },
        [history],
    );

    return (
        <>
            {/* 버튼 그룹 */}
            <div className="d-flex mb-10 justify-content-end">
                <Button variant="dark" onClick={() => history.push('/component')}>
                    컴포넌트 추가
                </Button>
            </div>

            {/* ag-grid table */}
            <MokaTable
                agGridHeight={512}
                columnDefs={columnDefs}
                rowData={list}
                onRowNodeId={(component) => component.componentSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['delete']}
                selected={component.componentSeq}
            />
        </>
    );
};

export default ComponentAgGrid;
