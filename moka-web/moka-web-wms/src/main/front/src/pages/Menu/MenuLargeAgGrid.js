import React, { useEffect } from 'react';
import { MokaTable } from '@components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getMenuList, changeSearchOption } from '@store/menu';
import { columnDefs } from './MenuAgGridColumns';

const LIST_HEIGHT = 737;

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
    }, [depth, dispatch, parentMenuId]);

    useEffect(() => {
        dispatch(getMenuList());
    }, [dispatch]);

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

export default MenuLargeAgGrid;
