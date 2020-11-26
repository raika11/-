import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@components';
import columnDefs from './ColumnistAgGridColumns';
import { GET_COLUMNIST_LIST, getColumnistList, getColumnist, changeSearchOption } from '@store/columNist';

const ColumnistAgGrid = () => {
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);

    const { loading, list, search, total } = useSelector((store) => ({
        loading: store.loading[GET_COLUMNIST_LIST],
        list: store.columNist.columnlist_list.list,
        search: store.columNist.columnlist_list.search,
        total: store.columNist.columnlist_list.total,
    }));

    // 목록에서 아이템 클릭시 수정 모드.
    const handleClickListRow = (e) => {
        dispatch(
            getColumnist({
                seqNo: e.seqNo,
            }),
        );
    };

    // FIXME: 신규등록 버튼인데 기자를 선택 하면 신규이기 때문에 어떻게 해야 할지?
    const handleNewColumnlist = () => {
        console.log('handleNewColumnlist');
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
            {/* 버튼 그룹 */}
            <div className="d-flex justify-content-end mb-10">
                <div className="pt-0">
                    <Button variant="positive" onClick={handleNewColumnlist}>
                        신규등록
                    </Button>
                </div>
            </div>

            <MokaTable
                agGridHeight={650}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.seqNo}
                onRowClicked={handleClickListRow}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={3}
                onChangeSearchOption={handleChangeSearchOption}
                selected={null}
            />
        </React.Fragment>
    );
};

export default ColumnistAgGrid;
