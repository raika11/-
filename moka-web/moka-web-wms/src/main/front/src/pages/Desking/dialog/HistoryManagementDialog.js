import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { POP_PAGESIZE_OPTIONS, POP_DISPLAY_PAGE_NUM, DB_DATE_FORMAT } from '~/constants';
import { WmsTable, WmsButton, WmsDraggableDialog, WmsDialogAlert } from '~/components';
import { histGroupColums, histDetailcolumns } from './dialogColumns';
import ImportHistDialog from './ImportHistDialog';
import {
    getDeskingHistories,
    getDeskingHistoriesGroup,
    changeSearchOptions,
    clearStore
} from '~/stores/desking/deskingHistoryStore';

import style from '~/assets/jss/pages/Desking/DeskingDialogStyle';

const useStyle = makeStyles(style);

/**
 * 히스토리 관리 다이얼로그
 * @param {boolean} props.open 오픈여부
 * @param {func} props.onClose 클로즈함수
 * @param {object} props.component 컴포넌트 정보
 */
const HistoryManagementDialog = (props) => {
    const { open, onClose, component = {} } = props;
    const classes = useStyle();
    const dispatch = useDispatch();
    const { gList, list, gTotal, gSearch, search, gLoading, loading } = useSelector((store) => ({
        gList: store.deskingHistoryStore.group.list,
        gTotal: store.deskingHistoryStore.group.total,
        gLoading: store.loadingStore['deskingHistoryStore/GET_DESKING_HISTORIES_GROUP'],
        gSearch: store.deskingHistoryStore.group.search,
        search: store.deskingHistoryStore.detail.search,
        loading: store.loadingStore['deskingHistoryStore/GET_DESKING_HISTORIES'],
        list: store.deskingHistoryStore.detail.list
    }));

    // state
    const [groupRows, setGroupRows] = useState([]);
    const [detailRows, setDetailRows] = useState([]);
    const [currentId, setCurrentId] = useState('');
    const [currentRow, setCurrentRow] = useState({});

    const [importHistDialog, setImportHistDialog] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertContent, setContent] = useState(null);

    useEffect(() => {
        if (open) {
            if (component.seq) {
                dispatch(
                    getDeskingHistoriesGroup({
                        actions: [
                            changeSearchOptions({
                                changes: [
                                    { key: 'page', value: 0 },
                                    { key: 'size', value: POP_PAGESIZE_OPTIONS[0] },
                                    { key: 'datasetSeq', value: component.datasetSeq }
                                ],
                                target: 'group'
                            })
                        ],
                        componentWorkSeq: component.seq
                    })
                );
            }
        }
        return () => {
            dispatch(clearStore('group', 'detail'));
            setCurrentRow({});
            setCurrentId('');
        };
    }, [component, open, dispatch]);

    useEffect(() => {
        // 그룹리스트 생성
        if (gList && gList.length > 0) {
            setGroupRows(
                gList.map((l) => {
                    const creatYmdtText = moment(l.createYmdt, DB_DATE_FORMAT).format(
                        'YYYY.MM.DD HH:mm:ss'
                    );
                    return {
                        id: `${l.createYmdt}${l.creator}`,
                        seq: l.seq,
                        createYmdtText: creatYmdtText,
                        createYmdt: l.createYmdt,
                        creator: l.creator
                    };
                })
            );
        } else {
            setGroupRows([]);
        }
    }, [gList]);

    useEffect(() => {
        // 상세리스트 생성
        if (list && list.length > 0) {
            setDetailRows(
                list.map((l) => ({
                    id: l.histSeq,
                    ...l
                }))
            );
        } else {
            setDetailRows([]);
        }
    }, [list]);

    /**
     * row 클릭 콜백
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const onRowClick = (e, row) => {
        const { id, createYmdt, creator } = row;
        setCurrentId(id);
        const cRow = groupRows.find((r) => r.id === id);
        setCurrentRow(cRow || {});
        dispatch(
            getDeskingHistories({
                actions: [
                    changeSearchOptions({
                        changes: [
                            { key: 'createYmdt', value: createYmdt },
                            { key: 'creator', value: creator },
                            { key: 'datasetSeq', value: component.datasetSeq }
                        ],
                        target: 'detail'
                    })
                ],
                componentWorkSeq: component.seq
            })
        );
    };

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값 { key, value }
     */
    const onChangeSearchOption = (payload) => {
        dispatch(
            getDeskingHistoriesGroup({
                actions: [
                    changeSearchOptions({
                        changes: [payload],
                        target: 'group'
                    })
                ],
                componentWorkSeq: component.seq
            })
        );
    };

    // 저장 다이얼로그 오픈
    const handleImportHistDialogOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (search.creator) {
            setImportHistDialog(true);
        } else {
            setContent(
                <Typography variant="subtitle2" className={classes.center}>
                    히스토리를 선택해주세요.
                </Typography>
            );
            setAlert(true);
        }
    };

    // 팝업저장 다이얼로그 종료
    const handleImportHistDialogClose = (isSave) => {
        setImportHistDialog(false);
        if (isSave) {
            onClose(); // 불러온 경우, 히스토리다이얼로그도 종료
        }
    };

    return (
        <>
            <WmsDraggableDialog
                open={open}
                onClose={onClose}
                title="히스토리 관리"
                width={858}
                height={446}
                content={
                    <div className={classes.historyBody}>
                        {/* 히스토리 그룹 테이블 */}
                        <div className={classes.historyLeftTable}>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                className={classes.topInfo}
                            >
                                {component.componentName}
                            </Typography>
                            <div style={{ height: 348 }}>
                                <WmsTable
                                    columns={histGroupColums}
                                    rows={groupRows}
                                    currentId={currentId}
                                    onRowClick={onRowClick}
                                    onChangeSearchOption={onChangeSearchOption}
                                    loading={gLoading}
                                    page={gSearch.page}
                                    size={gSearch.size}
                                    total={gTotal}
                                    pageSizes={POP_PAGESIZE_OPTIONS}
                                    displayPageNum={POP_DISPLAY_PAGE_NUM}
                                    borderTop
                                    borderBottom
                                />
                            </div>
                        </div>
                        {/* 히스토리 상세 테이블 */}
                        <div className={clsx(classes.historyRightTable)}>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                className={classes.topInfo}
                            >
                                {`상세정보 ${currentRow.createYmdtText || ''} ${
                                    currentRow.creator || ''
                                }`}
                            </Typography>
                            <div style={{ height: 306 }}>
                                <WmsTable
                                    columns={histDetailcolumns}
                                    rows={detailRows}
                                    loading={loading}
                                    paging={false}
                                    borderTop
                                    borderBottom
                                />
                            </div>
                            <div className={classes.footerBtn}>
                                <WmsButton
                                    color="info"
                                    size="long"
                                    onClick={handleImportHistDialogOpen}
                                >
                                    불러오기
                                </WmsButton>
                                <WmsButton color="wolf" size="long" onClick={onClose}>
                                    취소
                                </WmsButton>
                            </div>
                        </div>
                    </div>
                }
            />
            {/* Alert */}
            <WmsDialogAlert type="show" open={alert} onClose={() => setAlert(false)}>
                {alertContent}
            </WmsDialogAlert>

            {/** 히스토리 불러오기 */}
            {importHistDialog && (
                <ImportHistDialog
                    open={importHistDialog}
                    onClose={handleImportHistDialogClose}
                    componentWorkSeq={component.seq}
                    datasetSeq={component.datasetSeq}
                    histCreator={search.creator}
                    histCreateYmdt={search.createYmdt}
                />
            )}
        </>
    );
};
export default HistoryManagementDialog;
