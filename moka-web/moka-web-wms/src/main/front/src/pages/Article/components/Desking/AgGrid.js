import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { DB_DATEFORMAT, ARTICLE_URL, CHANNEL_TYPE } from '@/constants';
import { GRID_HEADER_HEIGHT, GRID_ROW_HEIGHT } from '@/style_constants';
import { MokaTable } from '@components';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { addDeskingWorkDropzone } from '@utils/deskingUtil';
import columnDefs from './AgGridColumns';
import GroupNumberRenderer from './GroupNumberRenderer';
import ChangeArtTitleModal from '@pages/Article/modals/ChangeArtTitleModal';

/**
 * 페이지편집 > 기사 목록 > AgGrid
 */
const AgGrid = forwardRef(
    ({ search, list, total, loading, onDragStop, dropTargetAgGrid, onChangeSearchOption, getArticleList, movie, suppressChangeArtTitle, addColumnDefs }, ref) => {
        const { PDS_URL, IR_URL } = useSelector(({ app }) => app);
        const [rowData, setRowData] = useState([]);
        const [gridInstance, setGridInstance] = useState(null);
        const [modalShow, setModalShow] = useState(false);
        const [selected, setSelected] = useState({});

        /**
         * row 클릭
         * @param {object} data data
         * @param {object} params 클릭시 ag-grid에서 넘겨주는 데이터
         */
        const handleRowClicked = (data, params) => {
            if (suppressChangeArtTitle) return;
            if (params.column.colId === 'artTitle') {
                setSelected(data);
                setModalShow(true);
            }
        };

        /**
         * 컬럼 명세
         * @returns {array} columnDefs
         */
        const makeDefs = useCallback(() => {
            let newDefs = [...columnDefs];
            if (!dropTargetAgGrid) newDefs.splice(0, 2);
            if (addColumnDefs) {
                addColumnDefs.forEach((nd) => {
                    var copy = Object.assign({}, nd);
                    delete copy.index;
                    newDefs.splice(nd.index, 0, copy);
                });
            }
            return newDefs;
        }, [addColumnDefs, dropTargetAgGrid]);

        /**
         * 기사 제목 저장 후 리스트 다시 조회
         */
        const afterChangeTitle = () => {
            getArticleList();
            setModalShow(false);
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
                        artTitle: unescapeHtmlArticle(art.artTitle),
                        artSubTitle: unescapeHtmlArticle(art.artSubTitle),
                        artSummary: unescapeHtmlArticle(art.artSummary),
                        artUrl: `${ARTICLE_URL}${art.totalId}`,
                        artIdType,
                        myunPan,
                        articleDt,
                        reportersText,
                        channelType: movie ? CHANNEL_TYPE.M.code : CHANNEL_TYPE.A.code,
                        artThumb,
                        artPdsThumb,
                    };
                }),
            );
        }, [IR_URL, PDS_URL, list, movie]);

        useEffect(() => {
            // 드롭 타겟 ag-grid에 drop-zone 설정
            if (gridInstance && dropTargetAgGrid) {
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
                    headerHeight={GRID_HEADER_HEIGHT[1]}
                    rowHeight={GRID_ROW_HEIGHT.C[1]}
                    columnDefs={makeDefs()}
                    rowData={rowData}
                    onRowNodeId={(article) => article.totalId}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={onChangeSearchOption}
                    frameworkComponents={{ GroupNumberRenderer: GroupNumberRenderer }}
                    rowSelection="multiple"
                    refreshCellsParams={{ force: true }}
                    applyColumnDefOrder
                />

                {/* 제목 변경 모달 */}
                <ChangeArtTitleModal show={modalShow} onHide={() => setModalShow(false)} artData={selected} onSave={afterChangeTitle} />
            </React.Fragment>
        );
    },
);

export default AgGrid;
