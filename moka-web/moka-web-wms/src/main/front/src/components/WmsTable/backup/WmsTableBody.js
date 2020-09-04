import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'clsx';

const initialMenuPos = {
    mouseX: null,
    mouseY: null
};

/**
 * 테이블 목록
 * @param {} props classes 스타일
 * @param {} props rows 데이타
 * @param {} props columns 칼럼정의
 * @param {} props currentId 선택된 아이디
 * @param {} props onRowClick Row클릭
 */
const WmsTableBody = (props) => {
    const { classes } = props;
    const { rows, columns, currentId } = props;
    // const { isSelected, onRowClick } = props;
    const { onRowClick } = props;
    const [menuPos, setMenuPos] = React.useState(initialMenuPos);

    const handleContentMenuOpen = (event, row) => {
        event.preventDefault();
        setMenuPos({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4
        });
        console.log('handleContentMenuOpen');
        console.log(row);
    };

    const handleClose = () => {
        setMenuPos(initialMenuPos);
    };

    const handleCloneClick = () => {
        setMenuPos(initialMenuPos);
    };

    const handleDeleteClick = () => {
        setMenuPos(initialMenuPos);
    };

    return (
        <TableBody className={classes.tbody}>
            {rows &&
                rows.map((row, rowIndex) => {
                    // const isItemSelected = isSelected(row.id) || currentId === row.id;
                    const isItemSelected = currentId === row.id;
                    const rowKey = `wms-table-row-${rowIndex}`;

                    return (
                        <TableRow
                            hover
                            onClick={(event) => onRowClick(event, row)}
                            // role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={rowKey}
                            selected={isItemSelected}
                            onContextMenu={(event) => handleContentMenuOpen(event, row)}
                        >
                            {columns.map((column, columnIndex) => {
                                const columnKey = `wms-table-column-${columnIndex}`;
                                // 체크박스
                                if (column.format === 'checkbox') {
                                    return (
                                        <TableCell
                                            padding="checkbox"
                                            key={columnKey}
                                            align={column.align}
                                            width={column.width}
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
                                // 아이콘버튼
                                if (column.format === 'component') {
                                    return (
                                        <TableCell
                                            key={columnKey}
                                            align={column.align}
                                            width={column.width}
                                            className={classes.cell}
                                        >
                                            {column.component(row)}
                                        </TableCell>
                                    );
                                }
                                // 텍스트. useYn==='N'일 경우 글자 회색처리
                                return (
                                    <TableCell
                                        key={columnKey}
                                        align={column.align}
                                        width={column.width}
                                        className={clsx(classes.cell, {
                                            [classes.notUseCell]: row.useYn && row.useYn === 'N'
                                        })}
                                    >
                                        {row[column.id]}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            <Menu
                keepMounted
                open={menuPos.mouseY !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    menuPos.mouseY !== null && menuPos.mouseX !== null
                    ? { top: menuPos.mouseY, left: menuPos.mouseX }
                    : undefined
                }
            >
                <MenuItem onClick={handleCloneClick}>복사본생성</MenuItem>
                <MenuItem onClick={handleDeleteClick}>삭제</MenuItem>
            </Menu>
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
     * 선택된 아이디
     */
    currentId: PropTypes.string,
    /**
     * 체크된 목록
     */
    // isSelected: PropTypes.func,
    /**
     * Row클릭
     */
    onRowClick: PropTypes.func
};

WmsTableBody.defaultProps = {
    classes: null,
    columns: null,
    rows: null,
    currentId: null,
    // order: 'asc',
    // orderBy: '',
    // isSelected: null,
    onRowClick: null
};

export default WmsTableBody;
