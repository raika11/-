import React from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { WmsButton } from '~/components';

const ImageEditLeft = ({ classes }) => {
    return (
        <div className={classes.imageEditLeftRow}>
            <Typography variant="subtitle1" component="p">
                대표사진
            </Typography>
            <div className={classes.imgEditLeftList}>사진</div>
            <div className={classes.imgEditLeftBtn}>
                <WmsButton color="info" size="long">
                    저장
                </WmsButton>
                <WmsButton color="wolf" size="long">
                    취소
                </WmsButton>
            </div>
        </div>
    );
};

export default ImageEditLeft;
