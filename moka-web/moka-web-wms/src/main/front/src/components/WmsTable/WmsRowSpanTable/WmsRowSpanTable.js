import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import WmsPagination from '../WmsPagination';
import WmsRowSpanTableHead from './WmsRowSpanTableHead';
import styles from '~/assets/jss/components/WmsTable/WmsTableStyle';
import { WmsLoader, WmsAlertError } from '~/components';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '~/constants';

const useStyles = makeStyles(styles);

/**
 * 테이블
 * @param {} props rows 데이터
 * @param {} props columns 컬럼정의
 * @param {} props currentId 선택된 아이디
 * @param {} props onRowClick Row클릭
 * @param {} props paging 페이징 여부
 * @param {} props otherHeight 테이블을 제외한 다른 영역의 높이 값
 * @param {} props total 총갯수
 * @param {} props page 페이지번호( zero base )
 * @param {} props size 페이지당 데이터 건수
 * @param {} props pageSizes 데이터 건수 옵션 목록
 * @param {} props displayPageNum 그룹당 페이지 개수
 * @param {} props onChangeSearchOption 페이징 검색조건 변경 ( 페이지, 데이터건수 변경 )
 * @param {} props error 테이블 조회 후 에러 정보. Json형태
 * @param {} props loading 로딩여부. 로딩중이면 true
 */
const WmsTable = (props) => {
    // 목록정보
    const { rows, columns, currentId, onRowClick, onContextMenuOpen } = props;
    // 페이징
    const { paging, otherHeight } = props;
    const { total, page, size, pageSizes, displayPageNum, onChangeSearchOption } = props;
    // 상태
    const { error, loading } = props;

    const classes = useStyles({ paging, otherHeight });

    if (loading) {
        return (
            <div className={classes.root}>
                <WmsLoader loading={loading} />
            </div>
        );
    }

    if (error) {
        return (
            <div className={classes.root}>
                <WmsAlertError error={error} />
            </div>
        );
    }

    const renderTableHead = (column, idx) => (
        <WmsRowSpanTableHead key={`${column}-${idx}`} classes={classes} columns={column}>
            {Array.isArray(column) ? column.map(renderTableHead) : null}
        </WmsRowSpanTableHead>
    );

    return (
        <div className={classes.root}>
            {/** 테이블 */}
            <TableContainer className={classes.tableContainer}>
                <Table className={classes.table} size="small">
                    {/** 테이블 head */}
                    <TableHead className={classes.thead}>{columns.map(renderTableHead)}</TableHead>

                    {/** 테이블 body */}
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
     * 데이터
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
     * 페이지당 데이터 건수
     */
    size: PropTypes.number,
    /**
     * 데이터 건수 옵션 목록
     */
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    /**
     * 그룹당 페이지 개수
     */
    displayPageNum: PropTypes.number,
    /**
     * 페이징 검색조건 변경 ( 페이지, 데이터건수 변경 )
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
