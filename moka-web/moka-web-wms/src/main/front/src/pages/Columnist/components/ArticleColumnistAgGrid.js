import React, { useState, useCallback, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import columnDefs from './ArticleColumnistAgGridColumns';
import { GET_COLUMNIST_LIST, getColumnistList, changeSearchOption } from '@store/columnist';
import { DISPLAY_PAGE_NUM } from '@/constants';

const ArticleColumnistAgGrid = forwardRef((props, ref) => {
    const { onDragStop, dropTargetAgGrid } = props;
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);

    const { loading, list, search, total, columnist } = useSelector((store) => ({
        loading: store.loading[GET_COLUMNIST_LIST],
        columnist: store.columnist.columnist,
        list: store.columnist.columnlist_list.list,
        search: store.columnist.columnlist_list.search,
        total: store.columnist.columnlist_list.total,
    }));

    // 목록에서 아이템 클릭시 수정 모드.
    const handleClickListRow = (data) => {
        // history.push(`${match.path}/${data.seqNo}`);
    };

    // 검색
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getColumnistList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    // store 변경 되었을떄.
    useEffect(() => {
        setRowData(
            list.map((data) => {
                let regDt = data.regDt && data.regDt.length > 10 ? data.regDt.substr(0, 10) : data.regDt;
                let modDt = data.modDt && data.modDt.length > 10 ? data.modDt.substr(0, 10) : data.modDt;
                return {
                    ...data,
                    regDt,
                    modDt,
                };
            }),
        );
    }, [list]);

    return (
        <React.Fragment>
            <MokaTable
                ref={ref}
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.seqNo}
                onRowClicked={handleClickListRow}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={DISPLAY_PAGE_NUM}
                onChangeSearchOption={handleChangeSearchOption}
                selected={columnist.seqNo}
                dragManaged={false}
                animateRows={false}
            />
        </React.Fragment>
    );
});

export default ArticleColumnistAgGrid;
