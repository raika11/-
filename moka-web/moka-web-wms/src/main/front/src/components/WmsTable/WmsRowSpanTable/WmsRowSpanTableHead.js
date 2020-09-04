import React from 'react';
import clsx from 'clsx';
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
        <TableRow>
            {columns.map((column, columnIndex) => {
                const columnKey = `wms-table-column-${columnIndex}`;
                if (column.format === 'checkbox') {
                    return (
                        <TableCell
                            padding="checkbox"
                            key={columnKey}
                            width={column.width}
                            className={clsx(classes.theadCell, {
                                [classes.rowSpan]: !column.rowspan || column.rowspan === 1
                            })}
                            rowSpan={column.rowspan}
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
                        className={clsx(classes.theadCell, {
                            [classes.rowSpan]: !column.rowspan || column.rowspan === 1
                        })}
                        rowSpan={column.rowspan}
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
    );
};

export default WmsTableHead;
