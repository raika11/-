import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import columnDefs from './ColumnistAgGridColumns';
import { GET_COLUMNIST_LIST, getColumnistList, changeSearchOption } from '@store/columnist';

/**
 * 칼럼니스트 > AgGrid
 */
const ColumnistAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_COLUMNIST_LIST]);
    const { list, search, total, columnist } = useSelector(({ columnist }) => columnist);
    const [rowData, setRowData] = useState([]);

    /**
     * row 클릭
     * @param {object} data 데이터
     */
    const handleRowClicked = (data) => history.push(`${match.path}/${data.seqNo}`);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') temp['page'] = 0;

            dispatch(changeSearchOption(temp));
            dispatch(getColumnistList({ search: temp }));
        },
        [dispatch, search],
    );

    useEffect(() => {
        const nt = new Date().getTime();
        setRowData(
            list.map((data) => {
                return {
                    ...data,
                    // 이미지가 변경되어도 링크가 같기 때문에 캐싱된 이미지를 계속 사용하는 문제 수정
                    profilePhoto: data.profilePhoto ? `${data.profilePhoto}?t=${nt}` : null,
                    repSeqText: data.repSeq || '   -',
                    regMember: `${data.regMember.memberNm}(${data.regMember.memberId})`,
                    regDt: (data.regDt || '').slice(0, -3),
                };
            }),
        );
    }, [list]);

    return (
        <React.Fragment>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                rowHeight={45}
                onRowNodeId={(data) => data.seqNo}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                selected={columnist.seqNo}
            />
        </React.Fragment>
    );
};

export default ColumnistAgGrid;
