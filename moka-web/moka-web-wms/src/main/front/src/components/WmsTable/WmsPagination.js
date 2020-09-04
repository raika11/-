import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import WmsPaginationActions from './WmsPaginationActions';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '~/constants';
import styles from '~/assets/jss/components/WmsTable/WmsPaginationStyle';

const useStyles = makeStyles(styles);

const WmsPagination = (props) => {
    const { popup } = props;
    const { total, page, size, pageSizes, displayPageNum, onChangeSearchOption } = props;
    const classes = useStyles({ popup });

    const handleChangeRowsPerPage = useCallback(
        (event) => {
            onChangeSearchOption({ key: 'size', value: Number(event.target.value) });
        },
        [onChangeSearchOption]
    );

    const handleChangePage = useCallback(
        (event, newPage) => {
            onChangeSearchOption({ key: 'page', value: Number(newPage) });
        },
        [onChangeSearchOption]
    );

    const labelDisplayedRows = useCallback(() => '', []);

    const actionProps = {
        total,
        page,
        size,
        displayPageNum,
        onChangeSearchOption
    };

    // 데이터가 없거나 로딩 중이면 아무것도 보여주지 않음
    // if (!total) return null;

    return (
        <TablePagination
            component="div"
            count={total}
            page={page}
            rowsPerPage={size}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={() => <WmsPaginationActions {...actionProps} />}
            onChangePage={handleChangePage}
            classes={classes}
            rowsPerPageOptions={pageSizes}
            labelDisplayedRows={labelDisplayedRows}
            SelectProps={{ native: true }}
        />
    );
};

WmsPagination.propTypes = {
    /**
     * 팝업 여부
     */
    popup: PropTypes.bool,
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
     * 검색조건 변경 ( 페이지, 데이타건수 변경 )
     */
    onChangeSearchOption: PropTypes.func
};

WmsPagination.defaultProps = {
    popup: false,
    total: 0,
    page: 0,
    size: PAGESIZE_OPTIONS[0],
    pageSizes: PAGESIZE_OPTIONS,
    displayPageNum: DISPLAY_PAGE_NUM,
    onChangeSearchOption: null
};

export default WmsPagination;
