import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';

const WmsTableHead = (props) => {
    // 스타일
    const { classes } = props;
    // 헤더 정보
    const { columns } = props;
    // 정렬
    const { orderColumnId, orderType, onSort } = props;
    // checkbox
    const { onSelectAllClick, numSelected, rowCount } = props;

    const createSortHandler = (property) => (event) => {
        onSort(event, property);
    };

    return (
        <TableHead className={classes.thead}>
            <TableRow>
                {columns.map((column, columnIndex) => {
                    const columnKey = `wms-table-column-${columnIndex}`;
                    if (column.format === 'checkbox') {
                        return (
                            <TableCell
                                // padding="checkbox"
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
                    if (column.format === 'rowspan') {
                        return (
                            <TableCell
                                key={columnKey}
                                padding={column.disablePadding ? 'none' : 'default'}
                                sortDirection={
                                    column.sort && orderColumnId === column.id ? orderType : false
                                }
                                width={column.width}
                                className={classes.theadCell}
                            >
                                {column.list.map((inColumn, inColumnIndex) => {
                                    const inColumnKey = `inColumn-key-${inColumnIndex}`;
                                    return inColumn.sort ? (
                                        <div key={`span-${inColumnKey}`}>
                                            <TableSortLabel
                                                key={inColumnKey}
                                                active={orderColumnId === inColumn.id}
                                                direction={
                                                    orderColumnId === inColumn.id
                                                        ? orderType
                                                        : 'asc'
                                                }
                                                onClick={createSortHandler(inColumn.id)}
                                            >
                                                {inColumn.label}
                                                {orderColumnId === inColumn.id ? (
                                                    <span className={classes.visuallyHidden}>
                                                        {orderType === 'desc'
                                                            ? 'sorted descending'
                                                            : 'sorted ascending'}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel>
                                            <br />
                                        </div>
                                    ) : (
                                        column.label
                                    );
                                })}
                            </TableCell>
                        );
                    }
                    return (
                        <TableCell
                            key={columnKey}
                            padding={column.disablePadding ? 'none' : 'default'}
                            sortDirection={
                                column.sort && orderColumnId === column.id ? orderType : false
                            }
                            width={column.width}
                            className={classes.theadCell}
                        >
                            {column.sort ? (
                                <TableSortLabel
                                    active={orderColumnId === column.id}
                                    direction={orderColumnId === column.id ? orderType : 'asc'}
                                    onClick={createSortHandler(column.id)}
                                >
                                    {column.label}
                                    {orderColumnId === column.id ? (
                                        <span className={classes.visuallyHidden}>
                                            {orderType === 'desc'
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
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    orderColumnId: PropTypes.string,
    orderType: PropTypes.oneOf(['asc', 'desc']),
    onSort: PropTypes.func,
    onSelectAllClick: PropTypes.func,
    numSelected: PropTypes.number,
    rowCount: PropTypes.number
};

WmsTableHead.defaultProps = {
    rowCount: 0,
    numSelected: 0,
    orderColumnId: undefined,
    orderType: undefined,
    onSelectAllClick: undefined,
    onSort: undefined
};

export default WmsTableHead;
