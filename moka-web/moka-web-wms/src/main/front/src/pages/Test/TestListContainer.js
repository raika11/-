import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { WmsTable, WmsCard, WmsMessageBox, WmsThumbnailTable } from '~/components';
import { getDatasetList, deleteDataset, defaultSearch } from '~/stores/dataset/datasetStore';
import { datasetColumns, boxWidth, boxHeight, rowHeight, otherHeight } from './DatasetListColumn';
// import { PAGESIZE_OPTIONS } from '~/constants';

// const initialPos = {
//     mouseX: null,
//     mouseY: null
// };

const TestListContainer = ({ history }) => {
    const dispatch = useDispatch();
    // const domains = useSelector((store) => store.authStore.domains);
    // const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const { datasets, total, error, loading, latestDatasetSeq, search } = useSelector(
        ({ datasetStore, loadingStore }) => ({
            datasets: datasetStore.list,
            total: datasetStore.total,
            error: datasetStore.error,
            loading: loadingStore['datasetStore/GET_DATASET_LIST'],
            latestDatasetSeq: datasetStore.latestDatasetSeq,
            search: datasetStore.search
        })
    );

    // const [pos, setPos] = useState(initialPos);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [orderColumnId, setOrderColumnId] = useState(datasetColumns && datasetColumns[0].id);
    const [orderType, setOrderType] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [listType, setListType] = useState('list');

    useEffect(() => {
        const option = {
            ...defaultSearch,
            apiCodeId: 'DEMO_API',
            apiHost: 'http://dps.msp.com',
            apiPath: 'demo_api',
            listType: 'list'
        };
        dispatch(getDatasetList(option));
    }, [dispatch]);

    // Store데이타셋정보 -> WmsSelect데이타로 변경
    const datasetRows =
        datasets &&
        datasets.map((d) => {
            return {
                id: String(d.datasetSeq),
                datasetSeq: d.datasetSeq,
                datasetName: d.datasetName,
                dataApi: d.dataApi,
                autoCreateYn: d.autoCreateYn === 'Y' ? '자동' : '수동',
                useYn: d.useYn,
                link: `/test/${d.datasetSeq}`,
                imageSrc: '',
                title: `${d.datasetSeq}_${d.datasetName}`
            };
        });

    // 목록에서 아이템 클릭 (상세 조회)
    const handleRowClick = useCallback(
        (e, row) => {
            history.push(row.link);
        },
        [history]
    );

    // 컨텍스트 팝업메뉴 오픈
    // const handleContextMenuOpen = (event, row) => {
    //     event.preventDefault();
    //     setPos({
    //         mouseX: event.clientX - 2,
    //         mouseY: event.clientY - 4
    //     });
    //     setSelectedRow(row);
    // };

    //  팝업메뉴 오픈
    const handleActionBtnClick = (row, a) => {
        setAnchorEl(a);
        setSelectedRow(row);
    };

    // 팝업메뉴 종료
    const handleClickClose = () => {
        console.log('handleClickClose');
        // setPos(initialPos);
        setAnchorEl(null);
    };

    // 데이타셋 복사
    const handleClickClone = () => {
        console.log('handleClickClone');
        // setPos(initialPos);
        console.log(selectedRow);
        setAnchorEl(null);
    };

    // 데이타셋 삭제
    const handleClickDelete = useCallback(() => {
        console.log('handleClickDelete');
        // setPos(initialPos);
        console.log(selectedRow);
        setAnchorEl(null);
        if (selectedRow && selectedRow.id) {
            WmsMessageBox.confirm('삭제하시겠습니까?', () => {
                dispatch(
                    deleteDataset({
                        datasetSeq: selectedRow.id,
                        callback: (result) => {
                            if (result) history.push('/test');
                        }
                    })
                );
            });
        }
    }, [selectedRow, dispatch, history]);

    // 리스트타입 변경
    const handleListTypeChange = useCallback((event, nextListType) => {
        setListType(nextListType);
    }, []);

    const handleChangeSearchOption = useCallback(
        (payload) => {
            const option = {
                ...search,
                [payload.key]: payload.value
            };
            dispatch(getDatasetList(option));
        },
        [dispatch, search]
    );

    // 정렬
    const handleSort = useCallback(
        (event, property) => {
            const isAsc = orderColumnId === property && orderType === 'asc';
            const type = isAsc ? 'desc' : 'asc';
            setOrderType(type);
            setOrderColumnId(property);
            const sortValue = `${property},${type}`;

            const option = {
                ...search,
                sort: sortValue
            };
            dispatch(getDatasetList(option));
            setSelected([]); // 체크박스 사용시 실행
        },
        [dispatch, orderColumnId, orderType, search]
    );

    // 체크박스 모두 선택
    const handleSelectAllClick = useCallback(
        (event) => {
            if (event.target.checked) {
                const newSelecteds = datasetRows.map((row) => row.id);
                setSelected(newSelecteds);
                return;
            }
            setSelected([]);
        },
        [datasetRows]
    );

    const handleRowCheckClick = useCallback(
        (event, row) => {
            console.log(row);
            const selectedIndex = selected.indexOf(row.id);
            let newSelected = [];

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, row.id);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1)
                );
            }

            setSelected(newSelected);
        },
        [selected]
    );

    const onRowRadioClick = useCallback(
        (event, row) => {
            console.log(row);
            const selectedIndex = selected.indexOf(row.id);
            if (selectedIndex === -1) {
                setSelected([row.id]);
            }
        },
        [selected]
    );

    return (
        <WmsCard title="데이타셋 검색">
            <ToggleButtonGroup
                size="small"
                value={listType}
                exclusive
                onChange={handleListTypeChange}
            >
                <ToggleButton value="list" aria-label="list">
                    <ViewListIcon />
                </ToggleButton>
                <ToggleButton value="module" aria-label="module">
                    <ViewModuleIcon />
                </ToggleButton>
            </ToggleButtonGroup>
            {/** 목록 */}
            <div style={{ height: '700px', width: '100%' }}>
                {listType === 'list' ? (
                    <WmsTable
                        columns={datasetColumns}
                        rows={datasetRows}
                        onRowClick={handleRowClick}
                        currentId={String(latestDatasetSeq)}
                        total={total}
                        page={search && search.page}
                        size={search && search.size}
                        onChangeSearchOption={handleChangeSearchOption}
                        loading={loading}
                        error={error}
                        rowHeight={String(rowHeight)}
                        otherHeight={String(otherHeight)}
                        // paging={false}   // 페이징여부
                        // onContextMenuOpen={handleContextMenuOpen}    // 컨텍스트메뉴
                        // 정렬
                        orderColumnId={orderColumnId}
                        orderType={orderType}
                        onSort={handleSort}
                        // 체크박스
                        onSelectAllClick={handleSelectAllClick}
                        selected={selected}
                        onRowCheckClick={handleRowCheckClick}
                        onRowRadioClick={onRowRadioClick}
                    />
                ) : (
                    <WmsThumbnailTable
                        boxWidth={boxWidth}
                        boxHeight={boxHeight}
                        rows={datasetRows}
                        onRowClick={handleRowClick}
                        currentId={String(latestDatasetSeq)}
                        total={total}
                        page={search && search.page}
                        size={search && search.size}
                        onChangeSearchOption={handleChangeSearchOption}
                        loading={loading}
                        error={error}
                        otherHeight={String(otherHeight)}
                        // paging={false}
                        onActionBtnClick={handleActionBtnClick}
                    />
                )}
            </div>
            {/** 리스트 컨텍스트팝업메뉴 */}
            {/* <Menu
                keepMounted
                open={pos.mouseY !== null}
                onClose={handleClickClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    pos.mouseY !== null && pos.mouseX !== null
                        ? { top: pos.mouseY, left: pos.mouseX }
                        : undefined
                }
            >
                <MenuItem
                    onClick={handleClickClone}
                    style={{ fontSize: '12px', minHeight: '32px' }}
                >
                    복사본 생성
                </MenuItem>
                <MenuItem
                    onClick={handleClickDelete}
                    style={{ fontSize: '12px', minHeight: '32px' }}
                >
                    삭제
                </MenuItem>
            </Menu> */}
            {/** 썸네일 리스트 팝업메뉴 */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClickClose}
                variant="menu"
                elevation={0}
                style={{
                    paper: "border: '1px solid #757575'"
                }}
            >
                <MenuItem
                    key="anchor01"
                    onClick={handleClickClone}
                    style={{ fontSize: '12px', minHeight: '32px' }}
                >
                    복사본 생성
                </MenuItem>
                <MenuItem
                    key="anchor02"
                    onClick={handleClickDelete}
                    style={{ fontSize: '12px', minHeight: '32px' }}
                >
                    삭제
                </MenuItem>
            </Menu>
        </WmsCard>
    );
};

export default withRouter(TestListContainer);
