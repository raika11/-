import React, { useEffect } from 'react';
import { MokaTable } from '@components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getMenuList, changeSearchOption } from '@store/menu';
import { columnDefs } from './MenuAgGridColumns';

// const LIST_HEIGHT = 737;

const MenuLargeAgGrid = (props) => {
    const dispatch = useDispatch();
    const { handleRowClicked, depth, menuId, parentMenuId } = props;
    const { list, loading } = useSelector(
        (store) => ({
            list: store.menu.listLarge,
        }),
        shallowEqual,
    );

    useEffect(() => {
        dispatch(
            getMenuList(
                changeSearchOption({
                    depth: depth,
                    parentMenuId: parentMenuId,
                    useTotal: false,
                }),
            ),
        );
    }, [depth, dispatch, parentMenuId, menuId]);

    return (
        <>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={list}
                onRowNodeId={(rowData) => rowData.menuId}
                loading={loading}
                onRowClicked={handleRowClicked}
                selected={menuId}
                paging={false}
            />
        </>
    );
};

export default MenuLargeAgGrid;
