import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from '@pages/Menu/MenuAgGridColumns';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeSearchOption, getMenuList } from '@store/menu';
import { MokaLoader } from '@components';
import { getDisplayedRows } from '@utils/agGridUtil';
import commonUtil from '@utils/commonUtil';

const MenuDraggableAgGrid = ({ onRowClicked, depth, menuId, parentMenuId, onChange, list }) => {
    const [instance, setInstance] = useState(null);
    const dispatch = useDispatch();
    const { loading } = useSelector(
        (store) => ({
            list: store.menu.listLarge,
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (!commonUtil.isEmpty(parentMenuId)) {
            dispatch(
                getMenuList(
                    changeSearchOption({
                        depth: depth,
                        parentMenuId: parentMenuId,
                        useTotal: false,
                    }),
                ),
            );
        }
    }, [depth, dispatch, parentMenuId, menuId]);

    const handleGridReady = (api) => {
        setInstance(api);
    };

    const handleRowDragEnd = (params) => {
        const displayedRows = getDisplayedRows(params.api);
        const changeDisplayedRows = displayedRows.map((row, index) => ({
            ...row,
            menuOrder: index + 1,
        }));

        params.api.applyTransaction({ update: changeDisplayedRows });
        if (onChange instanceof Function) {
            onChange(changeDisplayedRows);
        }
    };

    return (
        <div className="ag-theme-moka-dnd-grid position-relative overflow-hidden flex-fill">
            {loading && <MokaLoader />}
            <AgGridReact
                onRowDragEnd={handleRowDragEnd}
                immutableData
                rowData={list}
                getRowNodeId={(params) => params.menuId}
                columnDefs={columnDefs}
                localeText={{ noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' }}
                animateRows
                rowDragManaged
                onRowClicked={(data) => {
                    onRowClicked(data.data);
                }}
            />
        </div>
    );
};

export default MenuDraggableAgGrid;
