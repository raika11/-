import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DeskingComponentButtonGroup from './DeskingComponentButtonGroup';
import DeskingAgGrid from './DeskingAgGrid';
import style from '~/assets/jss/pages/Desking/DeskingListStyle';

const useStyles = makeStyles(style);

/**
 * 편집화면 > 개별 컴포넌트
 * @param {array} props.component 컴포넌트 데이터
 * @param {array} props.components Work컴포넌트목록
 * @param {number} props.agGridIndex 해당 컴포넌트가 데스킹 AgGrid 중에서 몇번째인지 알려주는 인덱스
 */
const DeskingComponent = (props) => {
    const { component, agGridIndex, onRowClicked } = props;
    const classes = useStyles();

    return (
        <div className={classes.deskingComponent} id={`agGrid-${component.seq}`}>
            <DeskingComponentButtonGroup component={component} agGridIndex={agGridIndex} />
            <DeskingAgGrid
                component={component}
                agGridIndex={agGridIndex}
                onRowClicked={onRowClicked}
            />
        </div>
    );
};

export default DeskingComponent;
