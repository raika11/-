import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsThumbnailCard, WmsTextFieldIcon, WmsSelect } from '~/components';
import style from '~/assets/jss/pages/Desking/Dialog/ComponentInfoDialogStyle';

/**
 * Dialog Style
 */
const useStyle = makeStyles(style);

const TemplateTabDialog = (props) => {
    const { open, onClose } = props;
    const classes = useStyle();

    return (
        <>
            <div className={classes.mb8}>
                <WmsSelect
                    // rows={defaultSearchType}
                    // currentId={search.searchType}
                    width={153}
                    overrideClassName={classes.mr8}
                    // onChange={onChangeSearchType}
                />
                <WmsSelect
                    // rows={defaultSearchType}
                    // currentId={search.searchType}
                    width={73}
                    overrideClassName={classes.mr8}
                    // onChange={onChangeSearchType}
                />
                <WmsSelect
                    // rows={defaultSearchType}
                    // currentId={search.searchType}
                    width={94}
                    overrideClassName={classes.mr8}
                    // onChange={onChangeSearchType}
                />

                <WmsTextFieldIcon
                    placeholder="탬플릿명을 입력하세요."
                    width="calc(100% - 344px)"
                    icon="search"
                    name="keyword"
                    // onChange={onChangeKeyword}
                    // onIconClick={onSearch}
                    // onEnter={onSearch}
                />
            </div>
            <div>
                <WmsThumbnailCard
                // key={row.id}
                // img={row.imageSrc}
                // width={boxWidth}
                // height={boxHeight}
                // useYn={useYn}
                // title={row.title}
                // body={row.body}
                // overlayText={row.overlayText}
                // overrideClassName={classes.imageCell}
                // onClick={(event) => onRowClick(event, row)}
                // onActionBtnClick={onActionBtnClickWithParam}
                // actionButtons={actionButtonsWidthData}
                // selected={currentId === row.id}
                />
            </div>
        </>
    );
};
export default TemplateTabDialog;
