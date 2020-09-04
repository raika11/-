import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { WmsIconButton } from '~/components/WmsButtons';
import style from '~/assets/jss/pages/RelationStyle';

const useStyle = makeStyles(style);

/**
 * 화면편집 릴레이션 바 컨텐츠
 */
const DeskingRelationBar = (props) => {
    const { showComponent, deskingToggleState, infoDisabled } = props;
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
                    overrideClassName={clsx({ [classes.active]: deskingToggleState[0] })}
                    id="info"
                    name="화면편집 정보"
                    title="화면편집 정보"
                    disabled={infoDisabled}
                >
                    <span>Info</span>
                </WmsIconButton>
                <WmsIconButton
                    onClick={childFunction}
                    icon="note"
                    bar
                    color="grey"
                    overrideClassName={clsx(classes.site, {
                        [classes.active]: deskingToggleState[1]
                    })}
                    id="article"
                    name="기사리스트"
                    title="기사리스트"
                />
                <WmsIconButton
                    onClick={childFunction}
                    icon="image"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: deskingToggleState[2] })}
                    id="image"
                    name="이미지"
                    title="이미지"
                />
                <WmsIconButton
                    onClick={childFunction}
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: deskingToggleState[3] })}
                    id="video"
                    name="동영상"
                    title="동영상"
                >
                    <PlayCircleFilledIcon />
                </WmsIconButton>
                <WmsIconButton
                    onClick={childFunction}
                    icon="insert_chart"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: deskingToggleState[4] })}
                    id="graphic"
                    name="그래픽"
                    title="그래픽"
                />
                <WmsIconButton
                    onClick={childFunction}
                    icon="turned_in"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: deskingToggleState[5] })}
                    id="bookmark"
                    name="북마크"
                    title="북마크"
                />
                <WmsIconButton
                    onClick={childFunction}
                    icon="schedule"
                    bar
                    color="grey"
                    overrideClassName={clsx({ [classes.active]: deskingToggleState[6] })}
                    id="hist"
                    name="히스토리"
                    title="히스토리 "
                />
            </div>
        </>
    );
};

export default DeskingRelationBar;
