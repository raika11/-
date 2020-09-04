import React, { Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { ColumnTwo } from '~/layouts';
import { WmsLoader } from '~/components';
import style from '~/assets/jss/pages/Volume/VolumeStyle';

const useStyles = makeStyles(style);
const VolumeListContainer = React.lazy(() => import('./VolumeListContainer'));
const VolumeInfoContainer = React.lazy(() => import('./VolumeInfoContainer'));

const VolumePage = (props) => {
    const classes = useStyles();

    return (
        <>
            <Helmet>
                <title>볼륨관리</title>
                <meta name="description" content="볼륨관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            <ColumnTwo {...props} widthOne={412} widthTwo={838}>
                {/* 볼륨 관리 */}
                <Suspense fallback={<WmsLoader />}>
                    <VolumeListContainer classes={classes} />
                </Suspense>

                {/* 볼륨 정보 */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/volume', '/volume/:volumeId']}
                            exact
                            render={() => <VolumeInfoContainer classes={classes} />}
                        />
                    </Switch>
                </Suspense>
            </ColumnTwo>
        </>
    );
};

export default VolumePage;
