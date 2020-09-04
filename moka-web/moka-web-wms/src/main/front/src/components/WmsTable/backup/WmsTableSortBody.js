import React from 'react';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { stableSort, getComparator } from '~/utils/sortUtil';
import { PAGESIZE_OPTIONS } from '../../constants';

const WmsTableBody = (props) => {
    const { classes } = props;
    const { rows, columns } = props;
    const { page, rowsPerPage } = props;
    const { order, orderBy } = props;
    const { isSelected, rowClick } = props;
    const { emptyRows } = props;

    return (
        <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => {
                    const isItemSelected = isSelected(row.id);
                    const rowKey = `wms-table-row-${rowIndex}`;

                    return (
                        <TableRow
                            hover
                            onClick={(event) => rowClick(event, row.id)}
                            // role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={rowKey}
                            selected={isItemSelected}
                        >
                            {columns.map((column, columnIndex) => {
                                const columnKey = `wms-table-column-${columnIndex}`;
                                if (column.format === 'checkbox') {
                                    return (
                                        <TableCell
                                            padding="checkbox"
                                            key={columnKey}
                                            align={column.align}
                                            className={classes.cell}
                                        >
                                            <Checkbox
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': rowKey
                                                }}
                                            />
                                        </TableCell>
                                    );
                                }
                                return (
                                    <TableCell
                                        key={columnKey}
                                        align={column.align}
                                        className={classes.cell}
                                    >
                                        {row[column.id]}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                    <TableCell colSpan={6} />
                </TableRow>
            )}
        </TableBody>
    );
};

WmsTableBody.propTypes = {
    /**
     * 스타일
     */
    classes: PropTypes.object,
    /**
     * 컬럼정의
     */
    columns: PropTypes.arrayOf(PropTypes.object),
    /**
     * 데이타
     */
    rows: PropTypes.arrayOf(PropTypes.object),
    /**
     * 페이지번호 (zero base)
     */
    page: PropTypes.number,
    /**
     * 한 페이지당 데이타 건수
     */
    rowsPerPage: PropTypes.number,
    /**
     * 정렬방법(asc,desc)
     */
    order: PropTypes.string,
    /**
     * 정렬필드명
     */
    orderBy: PropTypes.string,
    /**
     * 체크된 목록
     */
    isSelected: PropTypes.arrayOf(PropTypes.object),
    /**
     * 체크박스 클릭
     */
    rowClick: PropTypes.func,
    /**
     * 빈 row의 수
     */
    emptyRows: PropTypes.number
};

WmsTableBody.defaultProps = {
    classes: null,
    rows: null,
    columns: null,
    page: 0,
    rowsPerPage: PAGESIZE_OPTIONS,
    order: 'asc',
    orderBy: '',
    isSelected: null,
    rowClick: null,
    emptyRows: 0
};

export default WmsTableBody;
