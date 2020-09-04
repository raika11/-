import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import WmsPagination from './WmsPagination';
import WmsTableHead from './WmsTableHead';
import WmsTableBody from './WmsTableBody';
import styles from '~/assets/jss/components/WmsTable/WmsTableStyle';
import { WmsLoader, WmsAlertError } from '~/components';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '~/constants';
import { convertPixel } from '~/utils/styleUtil';

const useStyles = makeStyles(styles);

/**
 * 테이블
 * @param {} props rows 데이타
 * @param {} props columns 컬럼정의
 * @param {} props currentId 선택된 아이디
 *
 * @param {} props onRowClick Row클릭
 * @param {} props onContextMenuOpen 컨텍스트메뉴 오픈
 *
 * 테이블 형태 설정
 * @param {} props border 테두리 넣을지(기본 true)
 * @param {} props borderTop 상단 테두리(true일때 왼우하 테두리 없음)
 * @param {} props borderBottom 하단 테두리(true일 때 왼우상 테두리 없음)
 *
 * 페이징 설정
 * @param {} props header 헤더 넣을지(기본 true)
 * @param {} props paging 페이징 여부
 * @param {} props pagingPopup 팝업 테이블의 페이징
 * @param {} props rowHeight 한 라인의 높이
 * @param {} props otherHeight 테이블을 제외한 다른 영역의 높이 값
 *
 * @param {} props total 총갯수
 * @param {} props page 페이지번호( zero base )
 * @param {} props size 페이지당 데이타 건수
 * @param {} props pageSizes 데이타 건수 옵션 목록
 * @param {} props displayPageNum 그룹당 페이지 개수
 * @param {} props onChangeSearchOption 페이징 검색조건 변경 ( 페이지, 데이타건수 변경 )
 *
 * @param {} props error 테이블 조회 후 에러 정보. Json형태
 * @param {} props loading 로딩여부. 로딩중이면 true
 *
 * @param {} props orderColumnId 정렬필드
 * @param {} props orderType 정렬타입(asc,desc)
 * @param {} props onSort 정렬클릭
 *
 * @param {} props onSelectAllClick 체크박스 전체선택
 * @param {} props selected 체크된 목록
 * @param {} props onRowCheckClick 체크박스 클릭
 * @param {} props onRowRadioClick 라디오 클릭
 */
const WmsTable = (props) => {
    // 목록정보
    const { rows, columns, currentId, onRowClick, onContextMenuOpen } = props;
    // 페이징
    const { header, paging, popupPaging, rowHeight, otherHeight } = props;
    const { total, page, size, pageSizes, displayPageNum, onChangeSearchOption } = props;
    // 상태
    const { error, loading } = props;
    // 정렬
    const { orderColumnId, orderType, onSort } = props;
    // 체크박스
    const { onSelectAllClick, selected, onRowCheckClick, onRowRadioClick } = props;
    // 테이블 형태(border 설정)
    const { border = true, borderTop, borderBottom } = props;

    const classes = useStyles({
        header,
        paging,
        popupPaging,
        border: {
            top: border || borderTop,
            bottom: border || borderBottom,
            left: border && !borderTop && !borderBottom,
            right: border && !borderTop && !borderBottom
        },
        rowHeight: convertPixel(rowHeight),
        otherHeight: convertPixel(otherHeight)
    });

    if (error) {
        return <WmsAlertError error={error} />;
    }

    const isSelected = (rowId) => selected.indexOf(rowId) !== -1;

    return (
        <div className={classes.root}>
            {loading && (
                <div className={classes.loadingContainer}>
                    <WmsLoader loading={loading} />
                </div>
            )}
            {/** 테이블 */}
            <TableContainer className={classes.tableContainer}>
                <Table className={classes.table} size="small">
                    {/** 테이블 head */}
                    {header && (
                        <WmsTableHead
                            classes={classes}
                            columns={columns}
                            // 정렬조건
                            orderColumnId={orderColumnId}
                            orderType={orderType}
                            onSort={onSort}
                            // 체크박스
                            onSelectAllClick={onSelectAllClick}
                            numSelected={selected.length}
                            rowCount={rows && rows.length}
                        />
                    )}
                    {/** 테이블 body */}
                    {rows && (
                        <WmsTableBody
                            classes={classes}
                            rows={rows}
                            columns={columns}
                            currentId={currentId}
                            onRowClick={onRowClick}
                            // 컨텍스트 메뉴
                            onContextMenuOpen={onContextMenuOpen}
                            // 체크박스
                            isSelected={isSelected}
                            onRowCheckClick={onRowCheckClick}
                            onRowRadioClick={onRowRadioClick}
                        />
                    )}
                </Table>
            </TableContainer>

            {/** 테이블 페이징 */}
            {paging && (
                <WmsPagination
                    popup={popupPaging}
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
     * 컬럼정의: format=> '', 'component', 'checkbox'
     */
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    /**
     * Row 클릭
     */
    onRowClick: PropTypes.func,
    /**
     * 컨텍스트 메뉴 클릭
     */
    onContextMenuOpen: PropTypes.func,
    /**
     * 선택된 아이디
     */
    currentId: PropTypes.string,
    /**
     * 헤더 여부
     */
    header: PropTypes.bool,
    /**
     * 페이징 여부
     */
    paging: PropTypes.bool,
    /**
     * 팝업 여부
     */
    popup: PropTypes.bool,
    /**
     * 테이블을 한 라인의 높이 값.
     */
    rowHeight: PropTypes.string,
    /**
     * 테이블을 제외한 다른 영역의 높이 값.
     */
    otherHeight: PropTypes.string,
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
    onChangeSearchOption: PropTypes.func,
    /**
     * 정펼필드
     */
    orderColumnId: PropTypes.string,
    /**
     * 정렬타입(asc,desc)
     */
    orderType: PropTypes.string,
    /**
     * 정렬클릭
     */
    onSort: PropTypes.func,
    /**
     * 정렬클릭
     */
    onSelectAllClick: PropTypes.func,
    /**
     * 정렬클릭
     */
    selected: PropTypes.arrayOf(PropTypes.string),
    /**
     * 체크박스 클릭
     */
    onRowCheckClick: PropTypes.func,
    /**
     * 라디오 클릭
     */
    onRowRadioClick: PropTypes.func
};

WmsTable.defaultProps = {
    rows: null,
    onRowClick: null,
    onContextMenuOpen: null,
    currentId: null,
    header: true,
    paging: true,
    popup: false,
    rowHeight: '32px',
    otherHeight: null,
    loading: false,
    error: null,
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    pageSizes: PAGESIZE_OPTIONS,
    displayPageNum: DISPLAY_PAGE_NUM,
    onChangeSearchOption: null,
    orderColumnId: null,
    orderType: 'asc',
    onSort: null,
    onSelectAllClick: null,
    selected: [],
    onRowCheckClick: null,
    onRowRadioClick: null
};

export default WmsTable;
