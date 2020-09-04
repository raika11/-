import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { WmsTextField } from '~/components';
import Core from './Core';

/**
 * 컴포넌트 미리보기 화면 리소스 설정
 * @param {object} props.classes classes
 * @param {boolean} props.disabled disabled check
 */
const ComponentPreviewSet = (props) => {
    const { classes, disabled } = props;
    const { edit } = useSelector((state) => ({
        edit: state.componentStore.edit
    }));

    // 패널 확장
    const [expanded, setExpanded] = useState(false);
    // 데이터
    const [previewRsrc, setPreviewRsrc] = useState('');

    useEffect(() => {
        setExpanded(disabled);
    }, [disabled, edit]);

    const onChangeExpanded = (event, isExpanded) => {
        if (disabled) {
            setExpanded(isExpanded);
        }
    };

    useEffect(() => {
        setPreviewRsrc(edit.previewRsrc || '');
    }, [edit]);

    useEffect(() => {
        Core.prototype.push('save', { key: 'previewRsrc', value: previewRsrc });
    }, [previewRsrc]);

    return (
        <ExpansionPanel
            className={classes.expansionPanelRoot}
            square
            elevation={0}
            expanded={expanded}
            onChange={onChangeExpanded}
        >
            {/* Summary */}
            <ExpansionPanelSummary
                className={classes.expansionPanelSummary}
                expandIcon={<ExpandMoreIcon />}
                IconButtonProps={{ disableRipple: true }}
                aria-controls="component-list-content"
                id="component-list-header"
            >
                <Typography
                    variant="subtitle2"
                    className={clsx({ [classes.disabledText]: !disabled })}
                >
                    미리보기 화면 리소스
                </Typography>
            </ExpansionPanelSummary>

            {/* Details */}
            <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                <div className={clsx(classes.panelContents, classes.w100)}>
                    <WmsTextField
                        fullWidth
                        multiline
                        rows={4}
                        name="previewRsrc"
                        value={previewRsrc}
                        onChange={(e) => setPreviewRsrc(e.target.value)}
                    />
                </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

export default ComponentPreviewSet;
