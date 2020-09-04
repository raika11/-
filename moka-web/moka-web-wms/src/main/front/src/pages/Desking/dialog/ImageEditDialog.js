import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsDraggableDialog, WmsTab, WmsButton } from '~/components';
import style from '~/assets/jss/pages/Desking/DeskingDialogStyle';
import ImageEditLeft from './ImageEditLeft';
import ImageArchive from './ImageArchive';

const useStyle = makeStyles(style);

/**
 * 대표이미지 변경 다이얼로그
 * @param {boolean} props.open 오픈 여부
 * @param {func} props.onClose 클로즈함수
 */
const ImageEditDialog = (props) => {
    const { open, onClose } = props;
    const classes = useStyle();

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="대표이미지 변경"
            maxWidth="xl"
            height={771}
            content={
                <div className={classes.imageEditBody}>
                    <ImageEditLeft classes={classes} />
                    <WmsTab
                        tab={[
                            { label: '이미지편집', content: '이미지 편집기' },
                            { label: '사진', content: <ImageArchive classes={classes} /> },
                            { label: '영상', content: '영상 아카이브' },
                            { label: '그래픽', content: '그래픽 아카이브' }
                        ]}
                        tabWidth={195}
                        swipeable={false}
                        // overrideClassName={classes.tabBody}
                        overrideRootClassName={classes.imageEditRightRow}
                    />
                </div>
            }
        />
    );
};
export default ImageEditDialog;
