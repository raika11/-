import React, { useState, useEffect } from 'react';
import { MokaTable } from '@components';
import { ColumnDefs } from './ContentsListGridColumns';
import { DISPLAY_PAGE_NUM } from '@/constants';

import { tempRows } from '@pages/Boards/BoardConst';

const ContentsListGrid = () => {
    const [rowData, setRowData] = useState([]);

    const loading = false;

    const tempEvent = () => {};

    useEffect(() => {
        const setRowDataState = (element) => {
            setRowData(
                element.map((data) => {
                    let regDt = '2020-12-21';

                    return {
                        boardSeq: data.boardSeq,
                        channelName: data.channelName,
                        titleItem: {
                            title: data.title,
                            usedYn: data.usedYn,
                        },
                        titlePrefix1: data.titlePrefix1,
                        registItem: {
                            regDt: regDt,
                            regId: data.regId,
                        },
                        viewCount: data.viewCount,
                        fileItem: {
                            fileYn: data.fileYn,
                            file: data.file,
                        },
                    };
                }),
            );
        };
        tempRows && setRowDataState(tempRows.list);
    }, []);

    return (
        <>
            <MokaTable
                className="h-100"
                agGridHeight={650}
                columnDefs={ColumnDefs}
                rowData={rowData}
                rowHeight={50}
                onRowNodeId={(data) => data.boardSeq}
                onRowClicked={(e) => tempEvent(e)}
                loading={loading}
                total={tempRows.total}
                page={tempRows.page}
                size={tempRows.size}
                displayPageNum={DISPLAY_PAGE_NUM}
                onChangeSearchOption={() => tempEvent()}
                selected={11774}
            />
        </>
    );
};

export default ContentsListGrid;
