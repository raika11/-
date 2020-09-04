import React from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import { WmsTextField, WmsButton, WmsSwitch } from '~/components';
import style from '~/assets/jss/pages/Reserved/ReservedFormStyle';

/**
 * DatasetForm Style
 */
const useStyle = makeStyles(style);

/**
 * DomainForm
 * @param {object} props.match
 */
const ReservedForm = (props) => {
    const classes = useStyle();

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={clsx(classes.serviceForm, classes.ml8, classes.mr8, classes.mb8)}>
                    <div className={classes.serviceWhether}>
                        <WmsSwitch label="사용 여부" labelWidth="70" />
                    </div>
                    <div className="btnForm">
                        <WmsButton color="info">
                            <span>저장</span>
                            <Icon>save</Icon>
                        </WmsButton>
                        <WmsButton color="del">
                            <span>삭제</span>
                            <Icon>delete</Icon>
                        </WmsButton>
                    </div>
                </div>
                <div className={clsx(classes.lineForm, classes.ml8)}>
                    <WmsTextField
                        label="코드"
                        labelWidth="75"
                        placeholder="코드명을 입력하세요."
                        width="370"
                        value=""
                        required
                    />
                </div>
                <div className={clsx(classes.lineForm, classes.ml8)}>
                    <WmsTextField
                        label="값"
                        labelWidth="75"
                        placeholder="img.ssc.co.kr"
                        width="370"
                        value=""
                        required
                    />
                </div>
                <div className={clsx(classes.lineForm, classes.ml8)}>
                    <WmsTextField
                        label="코드 설명"
                        labelWidth="75"
                        placeholder="이미지 경로"
                        width="752"
                        value=""
                    />
                </div>
            </div>
        </div>
    );
};

export default withRouter(ReservedForm);
