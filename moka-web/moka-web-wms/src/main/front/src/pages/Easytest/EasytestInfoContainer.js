import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import { WmsButton } from '~/components';
import style from '~/assets/jss/pages/Easytest/EasytestInfoStyle';
import EasytestForm from './components/EasytestForm';
import DeleteDialog from './dialog/DeleteDialog';

const CopyDialog = React.lazy(() => import('./dialog/CopyDialog'));
const CreateComponentDialog = React.lazy(() => import('./dialog/CreateComponentDialog'));
const useStyle = makeStyles(style);
const Loading = () => <></>;

/**
 * TemplateInfoContainer
 */
const EasytestInfoContainer = () => {
    const classes = useStyle();

    // 다이얼로그 state
    const [copyOpen, setCopyOpen] = useState(false);
    const [ccOpen, setCcOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                {/* 버튼 */}
                <div className={classes.buttonGroup}>
                    <div className="left">
                        <WmsButton color="wolf" onClick={() => setCcOpen(true)}>
                            <span>Create Test</span>
                        </WmsButton>
                        <WmsButton color="wolf" onClick={() => setCopyOpen(true)}>
                            <span>Copy</span>
                        </WmsButton>
                    </div>
                    <div className="right">
                        <WmsButton color="info">
                            <span>Save</span>
                            <Icon>save</Icon>
                        </WmsButton>
                        <WmsButton color="del" onClick={() => setDelOpen(true)}>
                            <span>Delete</span>
                            <Icon>delete</Icon>
                        </WmsButton>
                    </div>
                </div>

                {/* 폼 */}
                <EasytestForm />
            </div>
        </div>
    );
};

export default EasytestInfoContainer;
