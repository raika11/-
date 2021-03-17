import React, { useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Survey/Poll/PollAgGridColumns';
import produce from 'immer';
import { useHistory } from 'react-router-dom';
import PollPreviewModal from '@pages/Survey/Poll/modals/PollPreviewModal';
import { messageBox } from '@utils/toastUtil';

const PollAgGrid = ({ searchOptions, total, pollSeq, rows, loading, onChangeSearchOption, onDelete }) => {
    const history = useHistory();
    const [rowData, setRowData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [previewModalShow, setPreviewModalShow] = useState(false);
    const [previewId, setPreviewId] = useState(null);

    const handleChangeSearchOptions = (option) => {
        if (onChangeSearchOption instanceof Function) {
            onChangeSearchOption(
                produce(searchOptions, (draft) => {
                    draft[option.key] = option.value;
                }),
            );
        }
    };

    const handleClickRow = ({ id }) => {
        history.push(`/poll/${id}`);
    };

    const handleClickPreview = (id) => {
        messageBox.alert('미리보기 기능은 준비중입니다.');
        //TODO: 추후 미리보기 기획 및 디자인 확정시 처리
        setPreviewModalShow(false);
        setPreviewId(id);
    };

    useEffect(() => {
        setRowData(rows.map((row) => ({ ...row, onDelete, onPreview: handleClickPreview })));
    }, [onDelete, rows]);

    useEffect(() => {
        if (rowData.length > 0) {
            setSelected(pollSeq);
        }
    }, [pollSeq, rowData.length]);

    return (
        <>
            <MokaTable
                columnDefs={columnDefs}
                onRowNodeId={(row) => row.id}
                headerHeight={50}
                rowData={rowData}
                page={searchOptions.page}
                size={searchOptions.size}
                total={total}
                rowHeight={46}
                loading={loading}
                onChangeSearchOption={handleChangeSearchOptions}
                onRowClicked={handleClickRow}
                selected={selected}
                className="ag-grid-align-center flex-fill custom-scroll"
                preventRowClickCell={['delete', 'preview']}
            />
            <PollPreviewModal pollSeq={previewId} show={previewModalShow} onHide={() => setPreviewModalShow(false)} />
        </>
    );
};

export default PollAgGrid;
