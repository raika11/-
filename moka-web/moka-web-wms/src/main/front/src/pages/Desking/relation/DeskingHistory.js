import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

import { WmsTable } from '~/components';
import { DB_DATE_FORMAT } from '~/constants';
import { histGroupColumns, histDetailColums } from '../components/tableColumns';
import {
    changeSearchOptions,
    getAllDeskingHistoriesGroup,
    getAllDeskingHistories
} from '~/stores/desking/deskingHistoryStore';

/**
 * 데스킹 히스토리
 * @param {object} props.open 오픈여부
 * @param {object} props.classes DeskingStyle
 * @param {object} props.pageInfo 페이지정보
 * @param {object} props.component 현재 컴포넌트 정보
 */
const DeskingHistory = (props) => {
    const { open, classes, pageInfo, component } = props;
    const dispatch = useDispatch();
    const { gList, gTotal, gSearch, gLoading, dList, dLoading } = useSelector((store) => ({
        gList: store.deskingHistoryStore.allGroup.list,
        gTotal: store.deskingHistoryStore.allGroup.total,
        gSearch: store.deskingHistoryStore.allGroup.search,
        gLoading: store.loadingStore['deskingHistoryStore/GET_ALL_DESKING_HISTORIES_GROUP'],
        dList: store.deskingHistoryStore.allDetail.list,
        dLoading: store.loadingStore['deskingHistoryStore/GET_ALL_DESKING_HISTORIES']
    }));

    // state
    const [allGroupRows, setAllGroupRows] = useState([]);
    const [allDetailRows, setAllDetailRows] = useState([]);
    const [currentId, setCurrentId] = useState('');
    const [currentRow, setCurrentRow] = useState({});

    useEffect(() => {
        if (gList.length > 0) {
            setAllGroupRows(
                gList.map((l) => ({
                    ...l,
                    id: String(l.seq),
                    createYmdtText: moment(l.createYmdt, DB_DATE_FORMAT).format(
                        'YYYY.MM.DD HH:mm:ss'
                    )
                }))
            );
        } else {
            setAllGroupRows([]);
        }
    }, [gList]);

    useEffect(() => {
        if (dList.length > 0) {
            setAllDetailRows(
                dList.map((l) => ({
                    ...l,
                    id: String(l.histSeq)
                }))
            );
        } else {
            setAllDetailRows([]);
        }
    }, [dList]);

    useEffect(() => {
        if (pageInfo.pageSeq && open) {
            dispatch(
                getAllDeskingHistoriesGroup({
                    actions: [
                        changeSearchOptions({
                            changes: [{ key: 'page', value: 0 }],
                            target: 'allGroup'
                        })
                    ],
                    pageSeq: pageInfo.pageSeq
                })
            );
        }
        setCurrentId('');
        setCurrentRow({});
        setAllDetailRows([]);
    }, [dispatch, pageInfo, open]);

    /**
     * row 클릭 콜백
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleRowClick = (e, row) => {
        const { id, createYmdt, creator, datasetSeq } = row;
        setCurrentId(id);
        const cRow = allGroupRows.find((r) => r.id === id);
        setCurrentRow(cRow || {});
        dispatch(
            getAllDeskingHistories({
                actions: [
                    changeSearchOptions({
                        changes: [
                            { key: 'createYmdt', value: createYmdt },
                            { key: 'creator', value: creator },
                            { key: 'datasetSeq', value: datasetSeq }
                        ],
                        target: 'allDetail'
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
    const handleChangeSearchOption = (payload) => {
        dispatch(
            getAllDeskingHistoriesGroup({
                actions: [
                    changeSearchOptions({
                        changes: [payload],
                        target: 'allGroup'
                    })
                ],
                pageSeq: pageInfo.pageSeq
            })
        );
    };

    return (
        <div className={clsx(classes.pl8, classes.pr8)}>
            <Typography component="div" variant="h2" className={classes.histPageName}>
                {pageInfo.pageName || ''}
            </Typography>
            <div className={classes.inLine}>
                <div className={classes.hist1}>
                    <WmsTable
                        currentId={currentId}
                        columns={histGroupColumns}
                        rows={allGroupRows}
                        total={gTotal}
                        page={gSearch.page}
                        size={gSearch.size}
                        loading={gLoading}
                        onChangeSearchOption={handleChangeSearchOption}
                        onRowClick={handleRowClick}
                        borderTop
                        borderBottom
                    />
                </div>
                <div className={classes.hist2}>
                    <Typography component="p" variant="subtitle1" className={classes.topInfo}>
                        {`상세정보 ${currentRow.createYmdtText || ''} ${currentRow.creator || ''}`}
                    </Typography>
                    <WmsTable
                        columns={histDetailColums}
                        rows={allDetailRows}
                        loading={dLoading}
                        borderTop
                        borderBottom
                        paging={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeskingHistory;
