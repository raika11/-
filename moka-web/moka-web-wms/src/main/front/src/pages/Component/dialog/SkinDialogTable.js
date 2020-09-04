import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTable } from '~/components';
import { skinColumns } from './dialogColumns';
import style from '~/assets/jss/pages/DialogStyle';
import { POP_PAGESIZE_OPTIONS, POP_DISPLAY_PAGE_NUM } from '~/constants';

const useStyle = makeStyles(style);

/**
 * 추후 작업 (06/17)
 */
const SkinDialogTable = () => {
    const classes = useStyle();
    const [skinRows] = useState([]);

    return (
        <div className={classes.table}>
            <WmsTable
                columns={skinColumns}
                rows={skinRows}
                total={0}
                page={0}
                size={20}
                pageSizes={POP_PAGESIZE_OPTIONS}
                displayPageNum={POP_DISPLAY_PAGE_NUM}
                // onRowClick={handleRowClick}
                // onChangeSearchOption={handleChangePagingSearchOption}
                // currentId={selectedRow && String(selectedRow.apiId)}
                // loading={loading}
                // error={error}
                borderTop
                borderBottom
                popupPaging
                // selected={selected}
                // onRowRadioClick={onRowRadioClick}
                // otherHeight={String(otherHeight)}
            />
        </div>
    );
};

export default SkinDialogTable;
