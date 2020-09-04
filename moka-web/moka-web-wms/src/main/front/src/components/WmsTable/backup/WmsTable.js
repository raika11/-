import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import WmsPagination from './WmsPagination';
import WmsTableHead from './WmsTableHead';
import WmsTableBody from './WmsTableBody';
import TableStyle from '~/assets/jss/components/Table/TableStyle';
import { WmsLoader, WmsAlertError } from '~/components';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '~/constants';

const useStyles = makeStyles(TableStyle);

/**
 * 테이블
 * @param {} props rows 데이타
 * @param {} props columns 컬럼정의
 * @param {} props currentId 선택된 아이디
 * @param {} props onRowClick Row클릭
 * @param {} props paging 페이징 여부
 * @param {} props otherHeight 테이블을 제외한 다른 영역의 높이 값
 * @param {} props total 총갯수
 * @param {} props page 페이지번호( zero base )
 * @param {} props size 페이지당 데이타 건수
 * @param {} props pageSizes 데이타 건수 옵션 목록
 * @param {} props displayPageNum 그룹당 페이지 개수
 * @param {} props onChangeSearchOption 페이징 검색조건 변경 ( 페이지, 데이타건수 변경 )
 * @param {} props error 테이블 조회 후 에러 정보. Json형태
 * @param {} props loading 로딩여부. 로딩중이면 true
 */
const WmsTable = (props) => {
    // 목록정보
    const { rows, columns, currentId, onRowClick } = props;
    // 페이징
    const { paging, otherHeight } = props;
    const { total, page, size, pageSizes, displayPageNum, onChangeSearchOption } = props;
    // 상태
    const { error, loading } = props;

    const classes = useStyles({ paging, otherHeight });
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(columns && columns[0].id);
    const [selected, setSelected] = React.useState([]);

    if (loading) {
        return <WmsLoader loading={loading} />;
    }

    if (error) {
        return <WmsAlertError error={error} />;
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // const handleClick = (event, name) => {
    //     const selectedIndex = selected.indexOf(name);
    //     let newSelected = [];

    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, name);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1)
    //         );
    //     }

    //     setSelected(newSelected);
    // };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    return (
        <div className={classes.root}>
            {/* <WmsTableToolbar numSelected={selected.length} /> */}

            {/** 테이블 */}
            <TableContainer className={classes.tableContainer}>
                <Table className={classes.table} size="small">
                    {/** 테이블 head */}
                    <WmsTableHead
                        classes={classes}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows && rows.length}
                        columns={columns}
                    />
                    {/** 테이블 body */}
                    {rows && (
                        <WmsTableBody
                            classes={classes}
                            rows={rows}
                            columns={columns}
                            currentId={currentId}
                            // page={page}
                            // rowsPerPage={size}
                            order={order}
                            orderBy={orderBy}
                            isSelected={isSelected}
                            onRowClick={onRowClick}
                        />
                    )}
                </Table>
            </TableContainer>

            {/** 테이블 페이징 */}
            {paging && (
                <WmsPagination
                    total={total}
                    page={page}
                    size={size}
                    pageSizes={pageSizes}
                    displayPageNum={displayPageNum}
                    onChangeSearchOption={onChangeSearchOption}
                />
            )}
        </div>
    );
};

WmsTable.propTypes = {
    /**
     * 데이타
     */
    rows: PropTypes.arrayOf(PropTypes.object),
    /**
     * 컬럼정의: format=> '', 'component', 'checkbox'(미구현)
     */
    columns: PropTypes.arrayOf(PropTypes.object),
    /**
     * Row 클릭
     */
    onRowClick: PropTypes.func,
    /**
     * 선택된 아이디
     */
    currentId: PropTypes.string,
    /**
     * 페이징 여부
     */
    paging: PropTypes.bool,
    /**
     * 테이블을 제외한 다른 영역의 높이 값.
     */
    otherHeight: PropTypes.number,
    /**
     * 로딩여부. 로딩중이면 true
     */
    loading: PropTypes.bool,
    /**
     * 테이블 조회 후 에러 정보. Json형태
     */
    error: PropTypes.object,
    /**
     * 총갯수
     */
    total: PropTypes.number,
    /**
     * 페이지번호( zero base )
     */
    page: PropTypes.number,
    /**
     * 페이지당 데이타 건수
     */
    size: PropTypes.number,
    /**
     * 데이타 건수 옵션 목록
     */
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    /**
     * 그룹당 페이지 개수
     */
    displayPageNum: PropTypes.number,
    /**
     * 페이징 검색조건 변경 ( 페이지, 데이타건수 변경 )
     */
    onChangeSearchOption: PropTypes.func
};

WmsTable.defaultProps = {
    rows: null,
    columns: null,
    onRowClick: null,
    currentId: null,
    paging: true,
    otherHeight: null,
    loading: false,
    error: null,
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    pageSizes: PAGESIZE_OPTIONS,
    displayPageNum: DISPLAY_PAGE_NUM,
    onChangeSearchOption: null
};

export default WmsTable;
