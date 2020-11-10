import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { MokaTable } from '@components';
import { GET_CODE_MGT_LIST, getCodeMgt, getCodeMgtList, changeSearchOption } from '@store/codeMgt';
import { columnDefs } from './CodeMgtEditAgGridColumns';
import CodeMgtEditModal from './modals/CodeMgtEditModal';

const CodeMgtEditAgGrid = (props) => {
    const { grpCd } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const { onSave, onDelete } = props;
    const { cdList, total, search, loading } = useSelector((store) => ({
        cdList: store.codeMgt.cdList,
        total: store.codeMgt.cdTotal,
        search: store.codeMgt.cdSearch,
        loading: store.loading[GET_CODE_MGT_LIST],
    }));
    const [rowData, setRowData] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (grpCd !== search.grpCd) {
            dispatch(getCodeMgtList(changeSearchOption({ ...search, grpCd })));
        }
    }, [dispatch, grpCd, search]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getCodeMgtList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * table
     */
    useEffect(() => {
        if (grpCd) {
            setRowData(
                cdList.map((data) => ({
                    ...data,
                    grpCd: grpCd,
                    cdSeq: data.seqNo,
                })),
            );
        } else if (!grpCd) {
            setRowData([]);
        }
    }, [cdList, grpCd]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClick = useCallback(
        (cd) => {
            history.push(`/codeMgt/${grpCd}/${cd.cdSeq}`);
            setShowEditModal(true);
            dispatch(getCodeMgt(cd.cdSeq));
        },
        [dispatch, grpCd, history],
    );

    return (
        <>
            {/* table */}
            <MokaTable
                agGridHeight={693}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(cdList) => cdList.cdSeq}
                onRowClicked={handleRowClick}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                selected={cdList.cdSeq}
            />
            <CodeMgtEditModal type="edit" show={showEditModal} onHide={() => setShowEditModal(false)} onSave={onSave} onDelete={onDelete} />
        </>
    );
};

export default CodeMgtEditAgGrid;
