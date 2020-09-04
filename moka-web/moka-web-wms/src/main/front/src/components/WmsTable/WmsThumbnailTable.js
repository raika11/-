import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import WmsPagination from './WmsPagination';
import WmsThumbnailTableBody from './WmsThumbnailTableBody';
import styles from '~/assets/jss/components/WmsTable/WmsTableStyle';
import { WmsLoader, WmsAlertError } from '~/components';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '~/constants';
import { convertPixel } from '~/utils/styleUtil';

const useStyles = makeStyles(styles);

/**
 * 썸네일 테이블
 * @param {} props boxWidth 이미지영역의 가로
 * @param {} props boxHeight 이미지영역의 세로
 * @param {} props rows 데이타
 * @param {} props currentId 선택된 아이디
 * @param {} props onRowClick Row클릭
 * @param {} props onActionBtnClick 우클릭
 * @parma {} props actionButtons 액션버튼(array)
 * @param {} props paging 페이징 여부
 * @param {} props popupPaging 팝업용 페이징
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
const WmsThumbnailTable = (props) => {
    // 목록정보
    const { boxWidth, boxHeight } = props;
    const { rows, currentId, onRowClick, onActionBtnClick, actionButtons } = props;
    // 페이징
    const { paging, popupPaging, otherHeight } = props;
    const { total, page, size, pageSizes, displayPageNum, onChangeSearchOption } = props;
    // 상태
    const { error, loading } = props;

    const classes = useStyles({
        paging,
        otherHeight: convertPixel(otherHeight),
        border: {
            top: true,
            bottom: true,
            left: true,
            right: true
        },
        thumbnail: true
    });

    if (error) {
        return <WmsAlertError error={error} />;
    }

    return (
        <div className={classes.root}>
            {loading && (
                <div className={classes.loadingContainer}>
                    <WmsLoader loading={loading} />
                </div>
            )}
            {/** 테이블 */}
            <TableContainer className={classes.tableContainer}>
                {/** 테이블 body */}
                {rows && (
                    <WmsThumbnailTableBody
                        classes={classes}
                        boxWidth={boxWidth}
                        boxHeight={boxHeight}
                        rows={rows}
                        currentId={currentId}
                        onRowClick={onRowClick}
                        onActionBtnClick={onActionBtnClick}
                        actionButtons={actionButtons}
                    />
                )}
            </TableContainer>

            {/** 테이블 페이징 */}
            {paging && (
                <WmsPagination
                    total={total}
                    page={page}
                    size={size}
                    popup={popupPaging}
                    pageSizes={pageSizes}
                    displayPageNum={displayPageNum}
                    onChangeSearchOption={onChangeSearchOption}
                />
            )}
        </div>
    );
};

WmsThumbnailTable.propTypes = {
    /**
     * 이미지영역의 가로
     */
    boxWidth: PropTypes.number,
    /**
     * 이미지영역의 세로
     */
    boxHeight: PropTypes.number,
    /**
     * 데이타
     */
    rows: PropTypes.arrayOf(PropTypes.object),
    /**
     * 컬럼정의: format=> '', 'component', 'checkbox'
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
     * 팝업 여부
     */
    popup: PropTypes.bool,
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
     * 액션 버튼들
     */
    actionButtons: PropTypes.arrayOf(PropTypes.any)
};

WmsThumbnailTable.defaultProps = {
    boxWidth: 183,
    boxHeight: 130,
    columns: null,
    rows: null,
    onRowClick: null,
    currentId: null,
    paging: true,
    popup: false,
    otherHeight: null,
    loading: false,
    error: null,
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    pageSizes: PAGESIZE_OPTIONS,
    displayPageNum: DISPLAY_PAGE_NUM,
    onChangeSearchOption: null,
    actionButtons: []
};

export default WmsThumbnailTable;
