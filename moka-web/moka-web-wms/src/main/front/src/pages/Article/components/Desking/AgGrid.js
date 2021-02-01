import React, { useState, useEffect, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaTable } from '@components';
import { unescapeHtml } from '@utils/convertUtil';
import { addDeskingWorkDropzone } from '@utils/deskingUtil';
import columnDefs from './AgGridColumns';
import GroupNumberRenderer from './GroupNumberRenderer';
import ChangeArtTitleModal from '@pages/Article/modals/ChangeArtTitleModal';

/**
 * 기사관리 ag-grid 컴포넌트 (페이지편집)
 */
const AgGrid = forwardRef((props, ref) => {
    const { search, list, total, loading, onDragStop, dropTargetAgGrid, onChangeSearchOption, onSearch } = props;
    const { PDS_URL, IR_URL } = useSelector((store) => ({
        PDS_URL: store.app.PDS_URL,
        IR_URL: store.app.IR_URL,
    }));

    // state
    const [rowData, setRowData] = useState([]);
    const [gridInstance, setGridInstance] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [selected, setSelected] = useState({});

    /**
     * row 클릭
     * @param {object} data data
     * @param {object} params 클릭시 aggrid에서 넘겨주는 데이터
     */
    const handleRowClicked = (data, params) => {
        if (params.column.colId === 'escapeTitle') {
            setSelected(data);
            setModalShow(true);
        }
    };

    useEffect(() => {
        setRowData(
            list.map((art) => {
                // 기자명 replace
                let reportersText = art.artReporter;
                const reporters = art.artReporter.split('.');
                if (reporters.length > 1) reportersText = `${reporters[0]} 외 ${reporters.length - 1}명`;

                // ID, 기사유형
                let artIdType = `${art.totalId}\n${art.artTypeName}`;

                // 제목 replace
                let escapeTitle = art.artTitle;
                if (escapeTitle && escapeTitle !== '') escapeTitle = unescapeHtml(escapeTitle);

                // 면판 replace
                let myunPan = '';
                myunPan = `${art.pressMyun || ''}/${art.pressPan || ''}`;

                // 출고시간/수정시간 replace
                let articleDt = moment(art.serviceDaytime, DB_DATEFORMAT).format('MM-DD HH:mm');
                if (art.artModDt) {
                    articleDt = `${articleDt}\n${moment(art.artModDt, DB_DATEFORMAT).format('MM-DD HH:mm')}`;
                } else {
                    articleDt = `${articleDt}\n `;
                }

                // 이미지경로
                let artPdsThumb = `${PDS_URL}${art.artThumb}`;
                // let artThumb = `${IR_URL}?t=k&w=100&h=100u=//${PDS_URL}${art.artThumb}`;
                let artThumb = artPdsThumb;

                return {
                    ...art,
                    escapeTitle,
                    artIdType,
                    myunPan,
                    articleDt,
                    reportersText,
                    gridType: 'ARTICLE',
                    artThumb,
                    artPdsThumb,
                };
            }),
        );
    }, [IR_URL, PDS_URL, list]);

    useEffect(() => {
        // 드롭 타겟 ag-grid에 drop-zone 설정
        if (gridInstance) {
            if (Array.isArray(dropTargetAgGrid)) {
                // 타겟이 리스트인 경우
                dropTargetAgGrid.forEach((targetGrid, agGridIndex) => {
                    addDeskingWorkDropzone(onDragStop, gridInstance, targetGrid, agGridIndex);
                });
            } else {
                // 타겟이 1개인 경우
                addDeskingWorkDropzone(onDragStop, gridInstance, dropTargetAgGrid);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dropTargetAgGrid, gridInstance, onDragStop]);

    return (
        <React.Fragment>
            <MokaTable
                ref={ref}
                className="article-list overflow-hidden flex-fill"
                setGridInstance={setGridInstance}
                headerHeight={50}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(article) => article.totalId}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                showTotalString={false}
                onChangeSearchOption={onChangeSearchOption}
                frameworkComponents={{ GroupNumberRenderer: GroupNumberRenderer }}
                dragManaged={false}
                animateRows={false}
                rowSelection="multiple"
            />
            <ChangeArtTitleModal show={modalShow} onHide={() => setModalShow(false)} artData={selected} />
        </React.Fragment>
    );
});

export default AgGrid;
