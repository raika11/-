import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsIconButton } from '~/components/WmsButtons';
import style from '~/assets/jss/pages/RelationStyle';

const useStyle = makeStyles(style);

const EasytestRelationBar = (props) => {
    const { showComponent, componentToggleState, relationBarInfo } = props;
    const classes = useStyle();

    const childFunction = (e) => {
        e.preventDefault();
        e.stopPropagation();
        showComponent(e.currentTarget.id);
    };

    return (
        <>
            <div className={classes.relbarRoot}>
                <WmsIconButton
                    onClick={childFunction}
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: componentToggleState[0] })}
                    id="if"
                    name={relationBarInfo[0].name}
                    title={relationBarInfo[0].name}
                >
                    <span>Info</span>
                </WmsIconButton>
                <WmsIconButton
                    onClick={childFunction}
                    icon="note"
                    bar
                    color="grey"
                    overrideClassName={clsx(classes.site, {
                        [classes.active]: componentToggleState[1]
                    })}
                    id="ps"
                    name={relationBarInfo[1].name}
                    title={relationBarInfo[1].name}
                />
                <WmsIconButton
                    onClick={childFunction}
                    icon="description"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: componentToggleState[2] })}
                    id="ht"
                    name={relationBarInfo[2].name}
                    title={relationBarInfo[2].name}
                />
            </div>
        </>
    );
};

export default EasytestRelationBar;
