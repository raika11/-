import React from 'react';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { convertPixel } from '~/utils/styleUtil';

/**
 * 테이블 목록
 * @param {} props classes 스타일
 * @param {} props rows 데이타
 * @param {} props columns 칼럼정의
 * @param {} props currentId 선택된 아이디
 * @param {} props onRowClick Row클릭
 * @param {} props onContextMenuOpen 팝업메뉴 우클릭
 * @param {} props isSelected 체크박스(라디오) 선택여부
 * @param {} props onRowCheckClick 체크박스 선택
 * @param {} props onRowRadioClick 라디오 선택
 */
const WmsTableBody = (props) => {
    const { classes } = props;
    const { rows, columns, currentId } = props;
    const { onRowClick, onContextMenuOpen } = props;
    const { isSelected, onRowCheckClick, onRowRadioClick } = props;

    return (
        <TableBody className={classes.tbody}>
            {rows &&
                rows.map((row, rowIndex) => {
                    const isItemSelected = isSelected(row.id);
                    const isItemCurrent = currentId === row.id;
                    const rowKey = `wms-table-row-${rowIndex}`;

                    return (
                        <TableRow
                            hover
                            onClick={(event) => {
                                return typeof onRowClick === 'function'
                                    ? onRowClick(event, row)
                                    : null;
                            }}
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={rowKey}
                            selected={isItemCurrent}
                            onContextMenu={(event) => {
                                return typeof onContextMenuOpen === 'function'
                                    ? onContextMenuOpen(event, row)
                                    : null;
                            }}
                            classes={{
                                root: clsx(classes.tr, {
                                    [classes.notUseTr]: row.useYn && row.useYn === 'N',
                                    [classes.useTr]: !row.useYn || row.useYn === 'Y'
                                })
                            }}
                        >
                            {columns.map((column, columnIndex) => {
                                const columnKey = `wms-table-column-${columnIndex}`;
                                return (
                                    <TableCell
                                        key={columnKey}
                                        align={column.align}
                                        width={column.width}
                                        className={classes.cell}
                                    >
                                        {column.format === 'checkbox' ? (
                                            // 체크박스
                                            <Checkbox
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': rowKey
                                                }}
                                                onClick={(event) => onRowCheckClick(event, row)}
                                            />
                                        ) : column.format === 'radio' ? (
                                            // 라디오버튼
                                            <Radio
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': rowKey
                                                }}
                                                onChange={(event) => onRowRadioClick(event, row)}
                                            />
                                        ) : column.format === 'component' ? (
                                            // 아이콘버튼(컴포넌트)
                                            column.component(row, {
                                                rowKey,
                                                isItemCurrent,
                                                isItemSelected,
                                                onRowClick,
                                                onRowCheckClick,
                                                onRowRadioClick,
                                                onContextMenuOpen
                                            })
                                        ) : column.format === 'rowspan' ? (
                                            // 병합된 cell
                                            column.list.map((inColumn, inColumnIndex) => {
                                                const inColumnKey = `inColumn-key-${inColumnIndex}`;
                                                return row[inColumn.id] ? (
                                                    <span
                                                        key={inColumnKey}
                                                        style={{
                                                            width: `${convertPixel(
                                                                column.width - 8
                                                            )}`
                                                        }}
                                                    >
                                                        {row[inColumn.id]}
                                                        <br />
                                                    </span>
                                                ) : null;
                                            })
                                        ) : (
                                            // 기본
                                            <Tooltip title={row[column.id] || ''}>
                                                <Typography
                                                    component="p"
                                                    style={{
                                                        width: `${convertPixel(column.width - 8)}`
                                                    }}
                                                >
                                                    {row[column.id]}
                                                </Typography>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
        </TableBody>
    );
};

WmsTableBody.propTypes = {
    /**
     * 스타일
     */
    classes: PropTypes.object.isRequired,
    /**
     * 컬럼정의
     */
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    /**
     * 데이타
     */
    rows: PropTypes.arrayOf(PropTypes.object),
    /**
     * 선택된 아이디
     */
    currentId: PropTypes.string,
    /**
     * Row클릭
     */
    onRowClick: PropTypes.func,
    /**
     * 팝업메뉴 우클릭
     */
    onContextMenuOpen: PropTypes.func,
    /**
     * 체크된 목록
     */
    isSelected: PropTypes.func,
    /**
     * 체크박스 클릭
     */
    onRowCheckClick: PropTypes.func
};

WmsTableBody.defaultProps = {
    rows: null,
    currentId: null,
    onRowClick: null,
    onContextMenuOpen: null,
    isSelected: null,
    onRowCheckClick: null
};

export default WmsTableBody;
