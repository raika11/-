import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GRID_ROW_HEIGHT } from '@/style_constants';
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
    const jplusRepRows = useSelector(({ codeMgt }) => codeMgt.jplusRepRows);
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
        if (jplusRepRows) {
            setRowData(
                list.map((data) => {
                    let setJplusRepDivNm = () => {
                        let jplusRepDiv = jplusRepRows.find((code) => code.dtlCd === data.jplusRepDiv);
                        if (data.repSeq) {
                            if (jplusRepDiv) {
                                return jplusRepDiv.cdNm.slice(0, 2);
                            } else {
                                return '일보';
                            }
                        } else {
                            return '외부';
                        }
                    };

                    return {
                        ...data,
                        jplusRepDivNm: setJplusRepDivNm(),
                        repSeqText: data.repSeq || '   -',
                        regMember: data.regMember ? `${data.regMember.memberNm}(${data.regMember.memberId})` : '',
                        regDt: (data.regDt || '').slice(0, -3),
                    };
                }),
            );
        }
    }, [list, jplusRepRows]);

    return (
        <React.Fragment>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                rowHeight={GRID_ROW_HEIGHT.C[0]}
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
