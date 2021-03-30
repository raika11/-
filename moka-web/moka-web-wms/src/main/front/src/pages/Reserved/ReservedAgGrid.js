import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@components';
import { columnDefs } from './ReservedAgGridColumns';
import { changeSearchOption, getReservedList, GET_RESERVED_LIST } from '@store/reserved';

/**
 * 예약어 관리 > 예약어 목록 > AgGrid
 */
const ReservedAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector(({ loading }) => loading[GET_RESERVED_LIST]);
    const { total, list, search, reserved } = useSelector(({ reserved }) => reserved);

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getReservedList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((reserved) => history.push(`${match.path}/${reserved.reservedSeq}`), [history, match.path]);

    /**
     * 예약어 등록 버튼 클릭
     */
    const handleAddClick = useCallback(() => history.push(`${match.path}/add`), [history, match.path]);

    return (
        <>
            <div className="d-flex justify-content-end mb-14">
                <Button variant="positive" onClick={handleAddClick}>
                    예약어 등록
                </Button>
            </div>
            {/* table */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={list}
                onRowNodeId={(reserved) => reserved.reservedSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={3}
                selected={reserved.reservedSeq}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </>
    );
};

export default ReservedAgGrid;
