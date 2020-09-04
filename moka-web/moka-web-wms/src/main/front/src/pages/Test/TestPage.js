import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import { ColumnTwo } from '~/layouts';
import { WmsLoader } from '~/components';
import style from '~/assets/jss/pages/Dataset/DatasetStyle';

// const TestListContainer = React.lazy(() => import('./TestListContainer'));
const TestAgListContainer = React.lazy(() => import('./TestAgListContainer'));
const TestEditContainer = React.lazy(() => import('./TestEditContainer'));

const useStyles = makeStyles(style);

/**
 * width
 */
const widthOne = 422;

const TestPage = (props) => {
    const classes = useStyles();

    return (
        <>
            <Helmet>
                <title>Test</title>
                <meta name="description" content="Test관리입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            <ColumnTwo
                {...props}
                sidebarSize="normal"
                widthOne={widthOne}
                widthTwo={`calc(100% - ${widthOne}px`}
            >
                <div className={classes.list}>
                    <Suspense fallback={<WmsLoader />}>
                        <TestAgListContainer />
                    </Suspense>
                </div>
                <div className={classes.edit}>
                    <Suspense fallback={<WmsLoader />}>
                        <TestEditContainer />
                    </Suspense>
                </div>
            </ColumnTwo>
        </>
    );
};

export default TestPage;
