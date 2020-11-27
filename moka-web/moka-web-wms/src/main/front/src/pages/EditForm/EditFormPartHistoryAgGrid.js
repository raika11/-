import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { changeEditFormPart, exportEditFormPartHistoryXml, GET_EDIT_FORM_HISTORY_LIST, initialState } from '@/store/editForm';
import EditRecoveryButton from './EditRecoveryButton';
import EditExportButton from './EditExportButton';
import toast from '@utils/toastUtil';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };

/**
 * 편집폼 Part 이력 조회 AgGrid 목록
 */
const EditFormPartHistoryAgGrid = (props) => {
    const columnDefs = [
        {
            headerName: 'ID',
            field: 'seqNo',
            width: 50,
        },
        {
            headerName: '작성자',
            field: 'regNm',
            resizable: true,
            tooltipField: 'regNm',
            flex: 1,
        },
        {
            headerName: '작성일시',
            field: 'regDt',
            resizable: true,
            tooltipField: 'regDt',
            width: 170,
        },
        {
            headerName: '유형',
            field: 'status',
            tooltipField: 'status',
            resizable: true,
            width: 100,
        },
        {
            headerName: '배포여부',
            field: 'approvalYn',
            width: 100,
            cellStyle: { textAlign: 'center' },
        },
        {
            headerName: '복구',
            field: 'edit',
            width: 80,
            cellStyle: { fontSize: '12px' },
            cellRendererFramework: (row) => {
                return <EditRecoveryButton {...row} onClick={() => handleClickRecovery(row.data)} />;
            },
        },
        {
            headerName: 'Export',
            field: 'edit',
            width: 80,
            cellStyle: { fontSize: '12px' },
            cellRendererFramework: (row) => {
                return <EditExportButton {...row} onClick={() => handleClickExportXml(row.data)} />;
            },
        },
    ];
    const dispatch = useDispatch();
    const [historySearch, setHistorySearch] = useState(initialState);
    const [editFormRows, setEditFormRows] = useState([]);
    const { historyList, total, search: storeSearch, loading } = useSelector(
        (store) => ({
            historyList: store.editForm.historyList,
            total: store.editForm.total,
            search: store.editForm.historySearch,
            loading: store.loading[GET_EDIT_FORM_HISTORY_LIST],
        }),
        shallowEqual,
    );

    /**
     * 추가 버튼 클릭
     */
    const handleClickRecovery = (recoveryData) => {
        dispatch(changeEditFormPart(recoveryData));
        toast.success('복구되었습니다.');
    };

    /**
     * 추가 버튼 클릭
     */
    const handleClickExportXml = (history) => {
        dispatch(exportEditFormPartHistoryXml(history));
    };

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...historySearch, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
        },
        [historySearch],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((rowData) => {}, []);

    useEffect(() => {
        setHistorySearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        setEditFormRows(
            historyList.map((row) => ({
                seqNo: String(row.seqNo),
                regDt: row.regDt,
                regNm: row.regMember.memberNm,
                formSeq: row.editFormPart.formSeq,
                partSeq: row.editFormPart.partSeq,
                status: row.status,
                approvalYn: row.approvalYn,
                formData: row.formData,
            })),
        );
    }, [historyList]);

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={editFormRows}
            onRowNodeId={(rowData) => rowData.seqNo}
            agGridHeight={500}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={historySearch.page}
            size={historySearch.size}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default EditFormPartHistoryAgGrid;
