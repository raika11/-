import React, { useState } from 'react';
import clsx from 'clsx';
import { KeyboardDatePicker } from '@material-ui/pickers';
import DateRangeIcon from '@material-ui/icons/DateRange';
import {
    WmsPickersUtilsProvider,
    WmsSelect,
    WmsTextFieldIcon,
    WmsThumbnailTable,
    WmsButton
} from '~/components';
import { imageTableColumns } from '../components/deskingColumns';

const category = [{ id: 'category', name: '분류' }];

const ImageArchive = ({ classes }) => {
    const [listType, setListType] = useState('thumbnail');

    return (
        <>
            <div className={classes.p8}>
                <WmsPickersUtilsProvider>
                    <KeyboardDatePicker
                        inputVariant="outlined"
                        className={clsx(classes.dateBox, classes.mr8)}
                        format="YYYY-MM-DD"
                        keyboardIcon={<DateRangeIcon />}
                        KeyboardButtonProps={{
                            'aria-label': 'change date'
                        }}
                        okLabel="설정"
                        cancelLabel="취소"
                    />
                    <KeyboardDatePicker
                        inputVariant="outlined"
                        className={clsx(classes.dateBox, classes.mr8)}
                        format="YYYY-MM-DD"
                        keyboardIcon={<DateRangeIcon />}
                        KeyboardButtonProps={{
                            'aria-label': 'change date'
                        }}
                        okLabel="설정"
                        cancelLabel="취소"
                    />
                </WmsPickersUtilsProvider>
                <WmsSelect name="" width="170" rows={category} overrideClassName={classes.mr8} />
                <WmsTextFieldIcon
                    width="calc(100% - 474px)"
                    icon="search"
                    // value={}
                    // onChange={}
                    // onIconClick={}
                    // onEnter={}
                />
            </div>
            <div className={clsx(classes.imgEditTable, classes.pl8, classes.pr8)}>
                <WmsThumbnailTable
                    columns={imageTableColumns}
                    // rows={}
                    total
                    paging
                    boxWidth={190}
                    boxHeight={178}
                    // loading={loading}
                    // error={error}
                />
            </div>
            <div className={clsx(classes.imgEditFooter, classes.mt8)}>
                <WmsButton color="info" size="long">
                    불러오기
                </WmsButton>
                <WmsButton color="wolf" size="long">
                    취소
                </WmsButton>
            </div>
        </>
    );
};

export default ImageArchive;
