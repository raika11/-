import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@components';
import { GET_MIC_AGENDA_LIST, getMicAgendaList, changeSearchOption } from '@store/mic';
import { messageBox } from '@utils/toastUtil';
import columnDefs from './MicAgendaAgGridColumns';

/**
 * 시민 마이크 아젠다 목록
 */
const MicAgendaAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_MIC_AGENDA_LIST]);
    const { search, total, list, agenda } = useSelector(({ mic }) => ({
        search: mic.search,
        total: mic.total,
        list: mic.list,
        agenda: mic.agenda,
    }));
    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let ns = { ...search, [key]: value };
        if (key !== 'page') {
            ns['page'] = 0;
        }
        dispatch(changeSearchOption(ns));
        dispatch(
            getMicAgendaList({
                search: ns,
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (row) => history.push(`${match.path}/${row.agndSeq}`);

    useEffect(() => {
        setRowData(
            list.map((data) => ({
                ...data,
                regDt: (data.regDt || '').slice(0, -3),
                agndServiceDt: (data.agndServiceDt || '').slice(0, -9),
            })),
        );
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(params) => params.agndSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={agenda.agndSeq}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default MicAgendaAgGrid;
