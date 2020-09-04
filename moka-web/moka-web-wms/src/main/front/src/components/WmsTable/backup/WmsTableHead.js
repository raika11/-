import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';

const WmsTableHead = (props) => {
    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        columns
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead className={classes.thead}>
            <TableRow>
                {columns.map((column, columnIndex) => {
                    const columnKey = `wms-table-column-${columnIndex}`;
                    if (column.format === 'checkbox') {
                        return (
                            <TableCell
                                padding="checkbox"
                                key={columnKey}
                                width={column.width}
                                className={classes.theadCell}
                            >
                                <Checkbox
                                    indeterminate={numSelected > 0 && numSelected < rowCount}
                                    checked={rowCount > 0 && numSelected === rowCount}
                                    onChange={onSelectAllClick}
                                    inputProps={{ 'aria-label': '전체선택' }}
                                />
                            </TableCell>
                        );
                    }
                    return (
                        <TableCell
                            key={columnKey}
                            padding={column.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === column.id ? order : false}
                            width={column.width}
                            className={classes.theadCell}
                        >
                            {column.sort ? (
                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={orderBy === column.id ? order : 'asc'}
                                    onClick={createSortHandler(column.id)}
                                >
                                    {column.label}
                                    {orderBy === column.id ? (
                                        <span className={classes.visuallyHidden}>
                                            {order === 'desc'
                                                ? 'sorted descending'
                                                : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>
                            ) : (
                                column.label
                            )}
                        </TableCell>
                    );
                })}
            </TableRow>
        </TableHead>
    );
};

WmsTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    /**
     * 정렬방법(asc,desc)
     */
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    /**
     * 정렬필드명
     */
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number
};

WmsTableHead.defaultProps = {
    rowCount: 0
};

export default WmsTableHead;
