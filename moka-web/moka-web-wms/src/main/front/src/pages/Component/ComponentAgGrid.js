import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import columnDefs from './ComponentAgGridColumns';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@components';
import { GET_COMPONENT_LIST, getComponentList, changeSearchOption } from '@store/component';

/**
 * 컴포넌트 관리 > 컴포넌트 목록 > AgGrid
 */
const ComponentAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_COMPONENT_LIST]);
    const { total, list, search, component } = useSelector(({ component }) => component);
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
            dispatch(getComponentList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (component) => {
            history.push(`${match.path}/${component.componentSeq}`);
        },
        [history, match.path],
    );

    useEffect(() => {
        setRowData(
            list.map((data) => ({
                ...data,
            })),
        );
    }, [list]);

    return (
        <>
            {/* 버튼 그룹 */}
            <div className="d-flex mb-14 justify-content-end">
                <Button variant="positive" onClick={() => history.push(`${match.path}/add`)}>
                    컴포넌트 등록
                </Button>
            </div>

            {/* ag-grid table */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(component) => component.componentSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                selected={component.componentSeq}
            />
        </>
    );
};

export default ComponentAgGrid;
