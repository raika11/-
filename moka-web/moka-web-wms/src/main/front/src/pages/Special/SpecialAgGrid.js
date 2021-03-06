import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@components';
import columnDefs from './SpecialAgGridColumns';
import { getSpecialList, changeSearchOption, GET_SPECIAL_LIST } from '@store/special';

/**
 * 디지털스페셜 테이블
 */
const SpecialAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const ptRows = useSelector((store) => store.codeMgt.ptRows);
    const { specialList, total } = useSelector((store) => ({
        specialList: store.special.list,
        total: store.special.total,
    }));
    const search = useSelector((store) => store.special.search);
    const loading = useSelector((store) => store.loading[GET_SPECIAL_LIST]);
    const special = useSelector((store) => store.special.special);
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
            dispatch(getSpecialList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row 클릭
     */
    const handleRowClicked = useCallback(
        (special) => {
            history.push(`${match.path}/${special.seqNo}`);
        },
        [history, match.path],
    );

    useEffect(() => {
        if (ptRows) {
            setRowData(
                specialList.map((sp) => ({
                    ...sp,
                    pageSdate: sp.pageSdate && `${sp.pageSdate.substr(0, 4)}-${sp.pageSdate.substr(4, 2)}-${sp.pageSdate.substr(6, 2)}`,
                    pageCdName: ptRows.find((p) => p.dtlCd === String(sp.pageCd))?.cdNm,
                    regDtText: (sp.regDt || '').slice(0, -3),
                })),
            );
        }
    }, [ptRows, specialList]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(data) => data.seqNo}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.sizez}
            onChangeSearchOption={handleChangeSearchOption}
            selected={special.seqNo}
        />
    );
};

export default SpecialAgGrid;
