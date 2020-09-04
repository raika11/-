import React, { useState, Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { WmsCard, WmsTab } from '~/components';
import DeskingListContainer from './DeskingListContainer';
import style from '~/assets/jss/pages/Desking/DeskingStyle';

const useStyles = makeStyles(style);
const ComponentEditDialog = React.lazy(() => import('./dialog/ComponentEditDialog'));
const Loading = () => <></>;

/**
 * 화면편집 편집화면/예약화면/My화면
 */
const DeskingTabContainer = () => {
    const classes = useStyles();
    const [componentEditDialog, setComponentEditDialog] = useState(false);

    return (
        <>
            <WmsCard overrideClassName={classes.tabCard} header={false}>
                <WmsTab
                    tab={[
                        {
                            label: '편집화면',
                            content: <DeskingListContainer />
                        },
                        { label: '예약화면', content: '1111' },
                        { label: 'My화면', content: '2222' }
                    ]}
                    tabWidth="135"
                    icon={<SettingsOutlinedIcon />}
                    onIconClick={() => setComponentEditDialog(true)}
                    overrideRootClassName={classes.tabCardRoot}
                />
            </WmsCard>

            <Suspense fallback={<Loading />}>
                {componentEditDialog && (
                    <ComponentEditDialog
                        open={componentEditDialog}
                        onClose={() => setComponentEditDialog(false)}
                    />
                )}
            </Suspense>
        </>
    );
};

export default DeskingTabContainer;
