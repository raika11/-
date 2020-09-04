import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsIconButton } from '~/components/WmsButtons';
import style from '~/assets/jss/pages/RelationStyle';

const useStyle = makeStyles(style);

const TemplateRelationBar = (props) => {
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
                    id="pg"
                    name={relationBarInfo[1].name}
                    title={relationBarInfo[1].name}
                />
                <WmsIconButton
                    onClick={childFunction}
                    icon="description"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: componentToggleState[2] })}
                    id="cs"
                    name={relationBarInfo[2].name}
                    title={relationBarInfo[2].name}
                />
                <WmsIconButton
                    onClick={childFunction}
                    icon="view_compact"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: componentToggleState[3] })}
                    id="ct"
                    name={relationBarInfo[3].name}
                    title={relationBarInfo[3].name}
                />
                <WmsIconButton
                    onClick={childFunction}
                    icon="ballot"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: componentToggleState[4] })}
                    id="cp"
                    name={relationBarInfo[4].name}
                    title={relationBarInfo[4].name}
                />
                <WmsIconButton
                    onClick={childFunction}
                    icon="schedule"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: componentToggleState[5] })}
                    id="hist"
                    name={relationBarInfo[5].name}
                    title={relationBarInfo[5].name}
                />
            </div>
        </>
    );
};

export default TemplateRelationBar;
