import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeSearchOption, getMenuList } from '@store/menu';
import { getDisplayedRows } from '@utils/agGridUtil';
import commonUtil from '@utils/commonUtil';
import { MokaTable } from '@components';
import { columnDefs } from './MenuDraggableAgGridColumns';

/**
 * 메뉴 관리 > AgGrid
 */
const MenuDraggableAgGrid = ({ onRowClicked, depth, menuId, parentMenuId, onChange, list }) => {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState({});

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
        } else {
            setSelected({});
        }
    }, [depth, dispatch, parentMenuId, menuId]);

    useEffect(() => {
        return () => {
            setSelected({});
        };
    }, []);

    return (
        <MokaTable
            rowData={list}
            columnDefs={columnDefs}
            onRowClicked={(data) => {
                onRowClicked(data);
                setSelected(data);
            }}
            className="overflow-hidden flex-fill"
            paging={false}
            onRowDragEnd={handleRowDragEnd}
            onRowNodeId={(params) => params.menuId}
            selected={selected?.menuId}
            suppressRowClickSelection
            suppressMoveWhenRowDragging
            rowDragManaged
            animateRows
            dragStyle
        />
    );
};

export default MenuDraggableAgGrid;
