/* eslint-disable max-len */
import React, { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { mainEditColumns, relationEditColumns, CellEditor } from '../components';
import { agGrids, getAgGridNodeBeingDraggedOver } from '~/utils/agGridUtil';
import { changeHelperText } from '~/stores/article/relationArticleStore';
import style from '~/assets/jss/pages/Desking/DeskingStyle';

const useStyle = makeStyles(style);

/**
 * 대표기사 / 관련기사 AgGrid
 */
const RelationArticleEdit = (props) => {
    const { deskingWork, deskingRelWorks } = props;
    const classes = useStyle();
    const dispatch = useDispatch();

    const mainRef = useRef(null);
    const relRef = useRef(null);
    const { helperText } = useSelector((store) => ({
        helperText: store.relationArticleStore.helperText
    }));

    // 대표기사 onGridReady
    const onMainGridReady = (params) => {
        agGrids.prototype.change(
            0,
            { api: params.api, columnApi: params.columnApi },
            { target: 'relationArticle', field: 'main' }
        );

        params.api.addRowDropZone({
            getContainer: () => document.getElementById('rel-article-zone'),
            onDragStop: (row) => {
                dispatch(changeHelperText(''));
                // 대표기사 -> 관련기사
                if (relRef.current) {
                    // 관련기사에 없는 데이터일 때만 이동
                    let same = false;
                    if (relRef.current.api.getRowNode(row.node.data.contentsId)) {
                        same = true;
                    }

                    if (!same) {
                        // deskingWork -> deskingRelWork 로 변경
                        let tmp = {
                            seq: '',
                            deskingSeq: deskingWork.deskingSeq,
                            contentsId: '',
                            relContentsId: row.node.data.contentsId,
                            relOrder: 1,
                            relTitle: row.node.data.title
                        };

                        // 관련기사 grid에 row 추가
                        let overIdx = getAgGridNodeBeingDraggedOver(row.event, relRef.current);
                        relRef.current.api.applyTransaction({
                            addIndex: overIdx + 1,
                            add: [tmp]
                        });
                        // 대표기사 grid에 row 삭제
                        params.api.applyTransaction({
                            remove: [row.node.data]
                        });
                    } else {
                        dispatch(changeHelperText('관련기사에 동일한 기사가 존재합니다'));
                    }
                }
            }
        });
    };

    // 관련기사 onGridReady
    const onRelGridReady = (params) => {
        agGrids.prototype.change(
            0,
            { api: params.api, columnApi: params.columnApi },
            { target: 'relationArticle', field: 'rel' }
        );

        params.api.addRowDropZone({
            getContainer: () => document.getElementById('main-article-zone'),
            onDragStop: (row) => {
                dispatch(changeHelperText(''));
                // 관련기사 -> 대표기사 (관련기사가 대표기사로 올라가면, 대표기사가 관련기사로 내려온다)
                if (mainRef.current) {
                    // 대표에 없는 기사일 때만 올라감
                    let same = false;
                    if (mainRef.current.api.getRowNode(row.node.data.relContentsId)) {
                        same = true;
                    }

                    if (!same) {
                        // 내려오는 기사가 다른 관련기사 목록에 있는지 없는지 확인
                        mainRef.current.api.forEachNode((node) => {
                            if (relRef.current) {
                                let relSame = false;
                                if (relRef.current.api.getRowNode(node.data.contentsId)) {
                                    relSame = true;
                                }

                                // 관련기사 목록에 없으면 대표기사를 관련기사 grid에 추가
                                if (!relSame) {
                                    let tmp = {
                                        seq: '',
                                        deskingSeq: node.data.deskingSeq,
                                        contentsId: '',
                                        relContentsId: node.data.contentsId,
                                        relOrder: 1,
                                        relTitle: node.data.title
                                    };

                                    params.api.applyTransaction({
                                        add: [tmp]
                                    });
                                }
                            }
                        });

                        // 대표기사 grid clear
                        mainRef.current.api.setRowData();

                        // deskingRelWork -> deskingWork 데이터 변경
                        let tmp = {
                            ...deskingWork,
                            // 관련기사가 대표기사가 될거라서 관련기사의 relContentsId를 보냄
                            contentsId: row.node.data.relContentsId,
                            title: row.node.data.relTitle
                        };

                        // 대표기사 grid에 row 추가
                        mainRef.current.api.applyTransaction({
                            add: [tmp]
                        });

                        // 관련기사 grid에 row 삭제
                        params.api.applyTransaction({
                            remove: [row.node.data]
                        });

                        // 관련기사 row의 contentsId 업데이트
                        relRef.current.api.forEachNode((relNode) => {
                            relNode.contentsId = row.node.data.relContentsId;
                        });
                    }
                }
            }
        });
    };

    return (
        <>
            <div className={clsx(classes.w100, classes.mb15)} style={{ height: '71px' }}>
                <div className={classes.inLine}>
                    <Typography
                        variant="subtitle1"
                        component="p"
                        className={clsx(classes.mb8, classes.mr8)}
                    >
                        대표기사
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        component="p"
                        className={classes.mb8}
                        style={{ color: 'red' }}
                    >
                        {helperText}
                    </Typography>
                </div>
                <div
                    className={clsx(classes.relArticleEditAgGrid, 'ag-theme-wms-grid')}
                    id="main-article-zone"
                >
                    <AgGridReact
                        ref={mainRef}
                        rowData={[deskingWork]}
                        onGridReady={onMainGridReady}
                        rowDragManaged
                        columnDefs={mainEditColumns}
                        headerHeight={0}
                        rowHeight={33}
                        getRowNodeId={(node) => node.contentsId}
                        frameworkComponents={{
                            cellEditor: CellEditor
                        }}
                        localeText={{
                            noRowsToShow: '대표기사가 없습니다',
                            loadingOoo: '조회 중입니다..'
                        }}
                    />
                </div>
            </div>
            <div className={classes.w100} style={{ height: '567px' }}>
                <Typography variant="subtitle1" component="div" className={classes.mb8}>
                    관련기사
                </Typography>
                <div
                    className={clsx(
                        classes.relArticleEditAgGrid,
                        classes.relArticleEditRelAgGrid,
                        'ag-theme-wms-grid'
                    )}
                    id="rel-article-zone"
                >
                    <AgGridReact
                        ref={relRef}
                        rowData={deskingRelWorks}
                        onGridReady={onRelGridReady}
                        rowDragManaged
                        columnDefs={relationEditColumns}
                        headerHeight={0}
                        rowHeight={33}
                        getRowNodeId={(node) => node.relContentsId}
                        frameworkComponents={{
                            cellEditor: CellEditor
                        }}
                        localeText={{
                            noRowsToShow: '관련기사가 없습니다',
                            loadingOoo: '조회 중입니다..'
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default RelationArticleEdit;
