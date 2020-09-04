import React from 'react';
import clsx from 'clsx';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { WmsLoader } from '~/components';
import styles from '~/assets/jss/components/WmsCard/WmsCardStyle';

/**
 * Card Style
 */
const useStyles = makeStyles(styles);

/**
 * WMS Card
 * @param {string} props.title 헤더텍스트
 * @param {node} props.action 헤더 액션
 * @param {node} props.children 컨텐츠
 * @param {string|number} props.width 카드 width
 * @param {string} props.overrideClassName 카드컨텐츠에 추가되는 css
 * @param {string} props.overrideRootClassName 카드 root에 추가되는 css
 * @param {bool} props.header 헤더
 * @param {bool} props.loading 로딩
 */
const WmsCard = (props) => {
    const {
        title,
        action,
        width,
        children,
        overrideClassName,
        overrideRootClassName,
        header = true,
        loading
    } = props;
    const classes = useStyles({ width, header });

    return (
        <Card elevation={0} className={clsx(classes.MuiCard, overrideRootClassName)}>
            {header && (
                <CardHeader className={classes.MuiCardHeaderRoot} title={title} action={action} />
            )}
            <CardContent className={clsx(classes.MuiCardContentRoot, overrideClassName)}>
                {loading && <WmsLoader overrideClassName={classes.loader} />}
                {children}
            </CardContent>
        </Card>
    );
};

export default WmsCard;
