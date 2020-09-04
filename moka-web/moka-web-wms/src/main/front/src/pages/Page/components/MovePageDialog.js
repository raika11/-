import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextFieldIcon, WmsButton, WmsTable, WmsSelect, WmsDraggableDialog } from '~/components';
import {
    clearRelationPage as clear,
    getRelationPageList as getList,
    initialState
} from '~/stores/page/pageRelationPGStore';
import {
    movePageSearchTypes as searchTypes,
    movePageColumns as searchColumns
} from './movePageColumns';
import style from '~/assets/jss/pages/DialogStyle';
import { POP_PAGESIZE_OPTIONS, POP_DISPLAY_PAGE_NUM } from '~/constants';

/**
 * MovePageDialog Style
 */
const useStyle = makeStyles(style);

const MovePageDialog = (props) => {
    const classes = useStyle();
    const { open, onClose, onSave } = props;
    const dispatch = useDispatch();
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const { orgSearch, list, total, error, loading } = useSelector(
        ({ pageRelationPGStore, loadingStore }) => ({
            orgSearch: pageRelationPGStore.search,
            list: pageRelationPGStore.list,
            total: pageRelationPGStore.total,
            error: pageRelationPGStore.error,
            loading: loadingStore['pageRelationPGStore/GET_CHILD_RELATION_LIST']
        })
    );
    const [listRows, setListRows] = useState([]);
    const [search, setSearch] = useState(initialState.search);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        return () => {
            dispatch(clear());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 검색조건 로컬화
    useEffect(() => {
        const option = {
            ...initialState.search,
            domainId: latestDomainId
        };
        dispatch(getList(option));
    }, [dispatch, latestDomainId]);

    // 검색조건 로컬화
    useEffect(() => {
        setSearch(orgSearch);
    }, [orgSearch]);

    // 목록 로컬화
    useEffect(() => {
        if (list) {
            setListRows(
                list.map((t) => ({
                    id: String(t.pageSeq),
                    pageSeq: t.pageSeq,
                    pageName: t.pageName,
                    pageUrl: t.pageUrl
                }))
            );
        }
    }, [list]);

    // 검색조건 변경
    const handleChangeSearchOption = useCallback(
        (e) => {
            setSearch({
                ...search,
                [e.target.name]: e.target.value
            });
        },
        [search]
    );

    // 테이블에서 검색옵션 변경하는 경우(즉시조회)
    const handleTableSearchOption = useCallback(
        (payload) => {
            const option = {
                ...search,
                [payload.key]: payload.value
            };
            dispatch(getList(option));
        },
        [dispatch, search]
    );

    // 검색버튼 클릭(즉시조회)
    const onSearch = useCallback(
        (e) => {
            e.preventDefault();
            const option = {
                ...search,
                page: 0
            };
            dispatch(getList(option));
        },
        [dispatch, search]
    );

    // 테이블에서 Row클릭
    const handleRowClick = useCallback((e, row) => {
        setSelectedRow(row);
    }, []);

    // 등록버튼 클릭
    const handleSelect = useCallback(() => {
        if (selected.length > 0) {
            const row = listRows.find((d) => String(d.id) === selected[0]);
            onSave(row);
        }
        onClose();
    }, [onClose, onSave, selected, listRows]);

    // 라디오 버튼 클릭
    const onRowRadioClick = useCallback(
        (event, row) => {
            const selectedIndex = selected.indexOf(row);
            if (selectedIndex === -1) {
                setSelected([row.id]);
            }
        },
        [selected]
    );

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="이동페이지 검색"
            maxWidth="sm"
            content={
                <div className={clsx(classes.popupBody, classes.pl8, classes.pt8, classes.pr8)}>
                    <div className={classes.mb8}>
                        <WmsSelect
                            label="구분"
                            labelWidth="40"
                            width="170"
                            overrideClassName={clsx(classes.mr8, classes.mb8)}
                            name="searchType"
                            rows={searchTypes}
                            currentId={search.searchType}
                            onChange={handleChangeSearchOption}
                        />
                        <WmsTextFieldIcon
                            placeholder="검색어를 입력하세요"
                            width="268px"
                            icon="search"
                            name="keyword"
                            value={search.keyword}
                            onChange={handleChangeSearchOption}
                            onIconClick={onSearch}
                            onEnter={onSearch}
                        />
                    </div>
                    <div className={classes.table}>
                        <WmsTable
                            columns={searchColumns}
                            rows={listRows}
                            total={total}
                            page={search.page}
                            size={search.size}
                            pageSizes={POP_PAGESIZE_OPTIONS}
                            displayPageNum={POP_DISPLAY_PAGE_NUM}
                            onRowClick={handleRowClick}
                            onChangeSearchOption={handleTableSearchOption}
                            currentId={selectedRow && String(selectedRow.pageSeq)}
                            loading={loading}
                            error={error}
                            popupPaging
                            selected={selected}
                            onRowRadioClick={onRowRadioClick}
                        />
                    </div>
                </div>
            }
            actions={
                <div className={classes.popupFooter}>
                    <WmsButton color="info" size="long" onClick={handleSelect}>
                        등록
                    </WmsButton>
                    <WmsButton color="wolf" size="long" onClick={onClose}>
                        취소
                    </WmsButton>
                </div>
            }
        />
    );
};

export default withRouter(MovePageDialog);
