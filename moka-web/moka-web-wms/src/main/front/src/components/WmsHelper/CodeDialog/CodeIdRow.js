import React from 'react';
import clsx from 'clsx';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from '~/assets/jss/commonStyle';

const useStyle = makeStyles(commonStyle);

/**
 * 중분류/대분류 필드
 * @param {object} param.row row 데이터
 * @param {object} param.options table에 props로 전달했던 함수들
 */
const CodeIdRow = ({ row, options }) => {
    const { rowKey, isItemCurrent, onRowClick, onRowRadioClick } = options;
    const classes = useStyle();

    return (
        <div
            role="button"
            className={clsx(classes.inLine, classes.h100)}
            style={{ width: row.width }}
            onClick={(e) => onRowClick(e, row)}
            onKeyUp={(e) => onRowClick(e, row)}
            tabIndex={-1}
        >
            <Radio
                checked={isItemCurrent}
                inputProps={{
                    'aria-labelledby': rowKey
                }}
                style={{ marginLeft: 10, marginRight: 10 }}
                onChange={(e) => onRowRadioClick(e, row)}
            />
            <Typography component="p" variant="body1">
                {row.codeName}
            </Typography>
        </div>
    );
};

export default CodeIdRow;
