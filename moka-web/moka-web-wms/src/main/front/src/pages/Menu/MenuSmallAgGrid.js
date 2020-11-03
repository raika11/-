import React, { useEffect } from 'react';
import { MokaTable } from '@components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeSearchOption, getMenuList } from '@store/menu';
import { columnDefs } from './MenuAgGridColumns';
const LIST_HEIGHT = 737;

const MenuSmallAgGrid = (props) => {
    const dispatch = useDispatch();
    const { handleRowClicked, depth, menuId, parentMenuId } = props;
    const { list, loading } = useSelector(
        (store) => ({
            list: store.menu.listSmall,
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (parentMenuId.length > 0) {
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
    }, [depth, dispatch, menuId, parentMenuId]);

    return (
        <>
            <MokaTable
                columnDefs={columnDefs}
                rowData={list}
                onRowNodeId={(rowData) => rowData.menuId}
                loading={loading}
                onRowClicked={handleRowClicked}
                selected={menuId}
                paging={false}
                agGridHeight={LIST_HEIGHT}
            />
        </>
    );
};

export default MenuSmallAgGrid;
