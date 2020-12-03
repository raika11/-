import React, { useState, useEffect } from 'react';
import { tempColumnDefs, tempRowData } from './FbArtAgGridColumns';
import { MokaTable } from '@components';

const FbArtAgGrid = () => {
    const [rowData, setRowData] = useState([]);

    // 임시
    const handleClickListRow = () => {
        console.log('handleClickListRow');
    };

    // 임시
    const handleChangeSearchOption = () => {
        console.log('handleChangeSearchOption');
    };

    // 임시
    const handleOnRowNodeId = () => {};

    // 최초 로딩.
    useEffect(() => {
        // API 에서 어떻게 내려 오는지를 몰라서 아래 처럼 했습니다.
        setRowData(
            tempRowData.map((element) => {
                let repId = element.repId;
                let repImg = element.repImg;
                let snsTitle = element.snsTitle;
                let useYn = element.useYn;
                let sendDate = element.sendDate && element.sendDate.length > 16 ? element.sendDate.substr(0, 16) : element.sendDate;
                let etcFlag = {
                    articleId: '', // 임시
                };

                return {
                    repId,
                    repImg,
                    snsTitle,
                    useYn,
                    sendDate,
                    etcFlag,
                };
            }),
        );
    }, []);

    return (
        <>
            <MokaTable
                agGridHeight={650}
                columnDefs={tempColumnDefs}
                rowData={rowData}
                rowHeight={65}
                onRowNodeId={handleOnRowNodeId}
                onRowClicked={handleClickListRow}
                loading={null}
                total={tempRowData.length}
                page={1}
                size={10}
                displayPageNum={3}
                onChangeSearchOption={handleChangeSearchOption}
                selected={null}
            />
        </>
    );
};

export default FbArtAgGrid;
