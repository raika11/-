import React, { useState, useEffect } from 'react';
import { tempColumnDefs } from './SnsMataAgGridColumns';
import { MokaTable } from '@components';
import { useDispatch } from 'react-redux';
import { changeSNSMetaSearchOptions } from '@store/snsManage/snsAction';

const SnsMataAgGrid = ({ rows, total, searchOptions, loading }) => {
    const dispatch = useDispatch();
    // 임시
    const [rowData, setRowData] = useState([]);

    // 임시
    const handleClickListRow = () => {
        console.log('handleClickListRow');
    };

    // 임시
    const handleChangeSearchOption = (option) => {
        dispatch(changeSNSMetaSearchOptions({ ...searchOptions, [option.key]: option.value }));
    };

    // 임시
    const handleOnRowNodeId = () => {};

    // 최초 로딩.
    useEffect(() => {
        // API 에서 어떻게 내려 오는지 몰라서 아래 처럼 했습니다.

        const viewRows = rows.map((viewRow) => {
            console.log(viewRow);
            /*const { articleBasic } = viewRow;

            const id = `${viewRow.id.snsType}-${viewRow.id.totalId}`;
            const date = articleBasic.pressDate;
            const year = date.substring(0, 4);
            const month = date.substring(4, 6);
            const day = date.substring(6, 8);
            const pressDate = `${year}-${month}-${day}`;

            const snsType = viewRow.id.snsType;
            const sendFb = snsType === 'FB' ? 'Y' : 'N';
            const sendTw = snsType === 'TW' ? 'Y' : 'N';
            const sendStatus = viewRow.snsArtSts;
            console.log(id, viewRow);

            return { ...articleBasic, pressDate, id, sendFb, sendTw, sendStatus };*/
        });
        console.log(viewRows);
        setRowData(rows);

        /*setRowData(
            rows.map((element) => {
                let repId = element.id.totalId;
                let source = element.source;
                let insStatus = element.insStatus;
                let listOutDate = element.outDate && element.outDate.length > 10 ? element.outDate.substr(0, 10) : element.outDate;
                let senddate = element.sendDate && element.sendDate.length > 16 ? element.sendDate.substr(0, 16) : element.sendDate;
                let sendflag = element.sendFlag;
                let listRepImg = {
                    image_url: element.repImg && element.repImg.length > 0 ? element.repImg : 'http://pds.joins.com/news/search_direct_link/000.jpg',
                    new_flag: element.newflag,
                };
                let listTitle = {
                    repId: repId,
                    articleTitle: element.articleTitle,
                    snsTitle: element.snsTitle,
                    reservation: element.reservation,
                };
                let listOutStatus = {
                    sendFlag: element.sendFlag,
                    facebook: element.facebook,
                    twitter: element.twitter,
                };

                return {
                    repId,
                    source,
                    listOutDate,
                    listRepImg,
                    listTitle,
                    insStatus,
                    sendflag,
                    senddate,
                    listOutStatus,
                };
            }),
        );*/
    }, [rows]);

    return (
        <>
            <MokaTable
                agGridHeight={650}
                columnDefs={tempColumnDefs}
                rowData={rowData}
                rowHeight={65}
                onRowNodeId={(row) => row.totalId}
                onRowClicked={handleClickListRow}
                loading={loading}
                total={total}
                page={searchOptions.page}
                size={searchOptions.size}
                onChangeSearchOption={handleChangeSearchOption}
                selected={(data) => {
                    console.log(data);
                }}
            />
        </>
    );
};

export default SnsMataAgGrid;
