import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTextFieldIcon, WmsButton, WmsTable, WmsSelect, WmsDraggableDialog } from '~/components';
import { apiSearchTypes, apiSearchColumns } from './apiColumns';
import style from '~/assets/jss/pages/DialogStyle';
import { POP_PAGESIZE_OPTIONS, POP_DISPLAY_PAGE_NUM } from '~/constants';
import { getApiList, clearApi, initialState } from '~/stores/dataset/apiStore';

const useStyle = makeStyles(style);

const ApiDialog = (props) => {
    const classes = useStyle();
    const { open, onClose, onSave } = props;
    const dispatch = useDispatch();
    const { apiCodeId } = useSelector((store) => store.datasetStore.search);
    const { orgSearch, list, total, error, loading } = useSelector(
        ({ apiStore, loadingStore }) => ({
            orgSearch: apiStore.search,
            list: apiStore.list,
            total: apiStore.total,
            error: apiStore.error,
            loading: loadingStore['apiStore/GET_API_LIST']
        })
    );
    const [listRows, setListRows] = useState([]);
    const [search, setSearch] = useState(initialState.search);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        return () => {
            dispatch(clearApi());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // api목록조회
    useEffect(() => {
        // apiCodeId가 없으면 조회하지 않는다.
        if (!apiCodeId) return;

        if (search.apiCodeId !== apiCodeId) {
            const option = {
                ...search,
                apiCodeId
            };
            dispatch(getApiList(option));
        }
    }, [dispatch, apiCodeId, search]);

    // 검색조건 로컬화
    useEffect(() => {
        setSearch(orgSearch);
    }, [orgSearch]);

    // 목록 로컬화
    useEffect(() => {
        if (list) {
            setListRows(
                list.map((d) => {
                    return {
                        id: String(d.id),
                        apiId: d.id,
                        description: d.description,
                        parameter: d.parameter
                    };
                })
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
            dispatch(getApiList(option));
        },
        [dispatch, search]
    );

    const onSearch = useCallback(
        (e) => {
            e.preventDefault();
            const option = {
                ...search,
                page: 0
            };
            dispatch(getApiList(option));
        },
        [dispatch, search]
    );

    // 등록버튼 클릭
    const handleSelect = useCallback(() => {
        if (selected.length > 0) {
            const row = list.find((d) => String(d.id) === selected[0]);
            onSave(row);
        }
        onClose();
    }, [list, onClose, onSave, selected]);

    // 라디오 버튼 클릭
    const onRowRadioClick = useCallback((event, row) => {
        setSelected([row.id]);
    }, []);

    // 목록에서 아이템 클릭
    const handleRowClick = useCallback(
        (e, row) => {
            onRowRadioClick(e, row);
        },
        [onRowRadioClick]
    );

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="자동 데이터셋 검색"
            maxWidth="sm"
            content={
                <div className={clsx(classes.popupBody, classes.pl8, classes.pt8, classes.pr8)}>
                    <div className={classes.mb8}>
                        <WmsSelect
                            rows={apiSearchTypes}
                            label="구분"
                            labelWidth="40"
                            width="170"
                            overrideClassName={classes.mr8}
                            name="searchType"
                            currentId={search.searchType}
                            onChange={handleChangeSearchOption}
                        />
                        <WmsTextFieldIcon
                            placeholder="검색어를 입력하세요."
                            width="268"
                            icon="search"
                            name="keyword"
                            onChange={handleChangeSearchOption}
                            onIconClick={onSearch}
                            onEnter={onSearch}
                        />
                    </div>
                    <div className={classes.table}>
                        <WmsTable
                            columns={apiSearchColumns}
                            rows={listRows}
                            total={total}
                            page={search.page}
                            size={search.size}
                            pageSizes={POP_PAGESIZE_OPTIONS}
                            displayPageNum={POP_DISPLAY_PAGE_NUM}
                            onRowClick={handleRowClick}
                            onChangeSearchOption={handleTableSearchOption}
                            // currentId={selectedRow && String(selectedRow.apiId)}
                            selected={selected}
                            onRowRadioClick={onRowRadioClick}
                            loading={loading}
                            error={error}
                            popupPaging
                            borderTop
                            borderBottom
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

export default ApiDialog;
