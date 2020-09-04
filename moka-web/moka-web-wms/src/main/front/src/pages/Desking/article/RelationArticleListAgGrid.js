import React, { useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { DB_DATE_FORMAT } from '~/constants';
import { agGrids, getAgGridNodeBeingDraggedOver } from '~/utils/agGridUtil';
import { relationArticleColumns, localeText } from '../components/deskingColumns';
import { changeHelperText } from '~/stores/article/relationArticleStore';

import RelationArticleListView from './RelationArticleListView';

/**
 * 관련기사 AgGrid
 * @param {objet} props.classes 스타일
 * @param {boolean} props.loading 로딩여부
 * @param {array} props.data 관련기사 리스트
 * @param {string} props.contentsId 대표기사 아이디
 * @param {object} props.deskingWork 데스킹워크
 */
const RelationArticleListAgGrid = (props) => {
    const { classes, loading, data, contentsId, deskingWork } = props;
    const dispatch = useDispatch();
    const agGridRef = useRef(null);

    // state
    const [rowData, setRowData] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState({});

    // getRowNodeId (agGrid)
    const getRowNodeId = (node) => node.contentsId;

    // onCellClicked (agGrid)
    const onCellClicked = (instance) => {
        if (instance.colDef.field === 'title') {
            // 팝업 띄우기
            setOpen(true);
            setCurrentArticle(instance.data);
        }
    };

    // getRowStyle (agGrid)
    const getRowStyle = (instance) => {
        if (instance.node.data.contentsId === contentsId) {
            return { background: '#EBF8FF' };
        }
        return undefined;
    };

    // onGridReady
    const onGridReady = (params) => {
        const { main, rel } = agGrids.prototype.rgrids;
        const mainDropZone = {
            getContainer: () => document.getElementById('main-article-zone'),
            onDragStop: (row) => {
                let possible = true;
                if (!main.api) {
                    possible = false;
                    return;
                }

                // 대표기사와 동일할 때
                if (main.api.getRowNode(row.node.data.contentsId)) {
                    possible = false;
                    dispatch(changeHelperText('동일한 대표기사입니다.'));
                    return;
                }

                if (possible) {
                    dispatch(changeHelperText(''));

                    // Article 데이터 -> DeskingWork 데이터로 변경 (필수 데이터만 변경)
                    let newWork = {
                        ...deskingWork,
                        contentsId: row.node.data.contentsId,
                        title: row.node.data.title
                    };

                    // 대표기사 그리드 클리어 후 새로 추가
                    main.api.setRowData([]);
                    main.api.applyTransaction({
                        add: [newWork]
                    });
                }

                if (rel.api) {
                    // 관련기사의 contentsId 업데이트
                    rel.api.forEachNode((node) => {
                        node.contentsId = row.node.data.contentsId;
                    });
                }
            }
        };
        const relDropZone = {
            getContainer: () => document.getElementById('rel-article-zone'),
            onDragStop: (row) => {
                let possible = true;
                if (!rel.api) {
                    possible = false;
                    return;
                }

                // 대표기사, 관련기사에 없는 기사만 추가함
                if (rel.api.getRowNode(row.node.data.contentsId)) {
                    possible = false;
                    dispatch(changeHelperText('동일한 관련기사가 존재합니다.'));
                    return;
                }
                if (main.api) {
                    if (main.api.getRowNode(row.node.data.contentsId)) {
                        dispatch(
                            changeHelperText(
                                '대표기사와 동일한 기사는 관련기사로 등록할 수 없습니다'
                            )
                        );
                        possible = false;
                        return;
                    }
                }

                if (possible) {
                    dispatch(changeHelperText(''));
                    // Article 데이터 -> DeskingRelWork 데이터로 변경
                    let newRelWork = {
                        seq: '',
                        deskingSeq: deskingWork.deskingSeq,
                        contentsId: deskingWork.contentsId, // 데스킹워크의 컨텐츠아이디
                        relContentsId: row.node.data.contentsId,
                        relOrder: 1,
                        relTitle: row.node.data.title
                    };

                    // 몇번째인지 인덱스 구함
                    let overIdx = getAgGridNodeBeingDraggedOver(row.event, rel);
                    rel.api.applyTransaction({
                        addIndex: overIdx + 1,
                        add: [newRelWork]
                    });
                }
            }
        };
        params.api.addRowDropZone(mainDropZone);
        params.api.addRowDropZone(relDropZone);
    };

    useEffect(() => {
        setRowData(
            data.map((d) => ({
                ...d,
                cellDate: moment(d.distYmdt, DB_DATE_FORMAT).format('MM/DD hh:mm')
            }))
        );
    }, [data]);

    useEffect(() => {
        if (agGridRef.current) {
            if (loading) {
                agGridRef.current.api.showLoadingOverlay();
            } else {
                agGridRef.current.api.hideOverlay();
                if (agGridRef.current.gridOptions.rowData.length > 0) {
                    // 데이터있을때
                } else {
                    agGridRef.current.api.showNoRowsOverlay();
                }
            }
        }
    }, [loading]);

    return (
        <>
            <AgGridReact
                onGridReady={onGridReady}
                ref={agGridRef}
                columnDefs={relationArticleColumns}
                rowData={rowData}
                rowDragManaged
                headerHeight={33}
                rowHeight={33}
                localeText={localeText}
                suppressMoveWhenRowDragging
                suppressRowClickSelection
                getRowNodeId={getRowNodeId}
                onCellClicked={onCellClicked}
                getRowStyle={getRowStyle}
            />
            <RelationArticleListView
                open={open}
                setOpen={setOpen}
                classes={classes}
                article={currentArticle}
            />
        </>
    );
};

export default RelationArticleListAgGrid;
