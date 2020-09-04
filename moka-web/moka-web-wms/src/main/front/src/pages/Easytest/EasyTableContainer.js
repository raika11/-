import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTable } from '~/components';
import style from '~/assets/jss/pages/Easytest/EasytestStyle';

const useStyles = makeStyles(style);

// 테스트 테이블 list
const EasyTableContainer = () => {
    const classes = useStyles(); // 클래스 이름

    return (
        <>
            <div className={classes.listTable}>
                <WmsTable columns={2} rows={2} />
                <>
                    <WmsThumbnailTable boxWidth={180} boxHeight={186} />
                    <TemplateActionMenu />
                </>
            </div>
        </>
    );
};

export default EasyTableContainer;
