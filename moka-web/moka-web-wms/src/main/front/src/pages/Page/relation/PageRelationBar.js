import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsIconButton } from '~/components/WmsButtons';
import style from '~/assets/jss/pages/RelationStyle';

const useStyle = makeStyles(style);

const PageRelationBar = (props) => {
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
                    id="info"
                    name={relationBarInfo[0].name}
                    title={relationBarInfo[0].name}
                >
                    <span>info</span>
                </WmsIconButton>
                <WmsIconButton
                    onClick={childFunction}
                    icon="note"
                    bar
                    color="grey"
                    overrideClassName={clsx(classes.site, {
                        [classes.active]: componentToggleState[1]
                    })}
                    id="pg"
                    name={relationBarInfo[1].name}
                    title={relationBarInfo[1].name}
                />
                <WmsIconButton
                    onClick={childFunction}
                    icon="view_quilt"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: componentToggleState[2] })}
                    id="ct"
                    name={relationBarInfo[2].name}
                    title={relationBarInfo[2].name}
                />
                <WmsIconButton
                    onClick={childFunction}
                    icon="ballot"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: componentToggleState[3] })}
                    id="cp"
                    name={relationBarInfo[3].name}
                    title={relationBarInfo[3].name}
                />
                <WmsIconButton
                    onClick={childFunction}
                    icon="art_track"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: componentToggleState[4] })}
                    id="tp"
                    name={relationBarInfo[4].name}
                    title={relationBarInfo[4].name}
                />
                <WmsIconButton
                    onClick={childFunction}
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: componentToggleState[5] })}
                    id="ad"
                    name={relationBarInfo[5].name}
                    title={relationBarInfo[5].name}
                >
                    AD
                </WmsIconButton>
                <WmsIconButton
                    onClick={childFunction}
                    icon="schedule"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: componentToggleState[6] })}
                    id="hist"
                    name={relationBarInfo[6].name}
                    title={relationBarInfo[6].name}
                />
            </div>
        </>
    );
};

export default PageRelationBar;
