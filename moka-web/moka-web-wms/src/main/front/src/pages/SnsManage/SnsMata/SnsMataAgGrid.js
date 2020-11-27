import React, { useState, useEffect } from 'react';
import { tempColumnDefs, tempRowData } from './SnsMataAgGridColumns';
import { MokaTable } from '@components';
import MataModal from './modal/MataModal';

const SnsMataAgGrid = () => {
    const [rowData, setRowData] = useState([]);

    const handleClickListRow = () => {
        console.log('handleClickListRow');
    };
    const handleChangeSearchOption = () => {
        console.log('handleChangeSearchOption');
    };
    const handleOnRowNodeId = () => {};

    const [modalShow, setModalShow] = useState(false);

    // 최초 로딩.
    useEffect(() => {
        // API 에서 어떻게 내려 오는지를 몰라서 아래 처럼 했습니다.
        setRowData(
            tempRowData.map((element) => {
                let repId = element.repId;
                let listOutDate = element.outDate && element.outDate.length > 10 ? element.outDate.substr(0, 10) : element.outDate;
                let listRepImg = element.repImg && element.repImg.length > 0 ? element.repImg : 'http://pds.joins.com/news/search_direct_link/000.jpg';
                let listTitle = {
                    repId: repId,
                    article: element.articleTitle,
                    sns: element.snsTitle,
                };
                let listArticleStatus = {
                    status: element.insStatus,
                    senddate: element.sendDate,
                    sendflag: element.sendFlag,
                };
                let listOutStatus = {
                    sendFlag: element.sendFlag,
                    facebook: element.facebook,
                    twitter: element.twitter,
                };

                return {
                    repId,
                    listOutDate,
                    listRepImg,
                    listTitle,
                    listArticleStatus,
                    listOutStatus,
                };
            }),
        );
    }, []);

    return (
        <React.Fragment>
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
            <MataModal show={modalShow} onHide={() => setModalShow(false)} onClickSave={null} />
        </React.Fragment>
    );
};

export default SnsMataAgGrid;
