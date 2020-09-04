import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Core from './Core';
import { WmsSwitch, WmsRadioGroup, WmsTextField } from '~/components';
import ComponentAds from '../components/ComponentAds';

/**
 * 컴포넌트 목록설정
 * @param {object} props.classes classes
 * @param {boolean} props.disabled disabled check
 * @param {func} props.scrollHeight 스크롤 함수
 */
const ComponentListSet = (props) => {
    const { classes, disabled, scrollHeight } = props;
    const { edit } = useSelector((state) => ({
        edit: state.componentStore.edit
    }));

    // 패널 확장
    const [expanded, setExpanded] = useState(false);
    // 페이징 설정
    const [pagingSwitchOn, setPagingSwitchOn] = useState(false);
    const [pagingYn, setPagingYn] = useState('N');
    const [pagingType, setPagingType] = useState('');
    const [perPageCount, setPerPageCount] = useState(0); // 이전다음, 더보기 둘 다 사용
    const [maxPageCount, setMaxPageCount] = useState(''); // 이전다음
    const [dispPageCount, setDispPageCount] = useState(''); // 이전다음
    const [moreCount, setMoreCount] = useState(''); // 더보기
    // 광고 설정
    const [componentAds, setComponentAds] = useState([]);

    useEffect(() => {
        setExpanded(disabled);
    }, [disabled]);

    const onChangeExpanded = (event, isExpanded) => {
        if (disabled) {
            setExpanded(isExpanded);
        }
    };

    /**
     * 페이징 사용여부 스위치 온오프
     */
    const onChangePagingSwitchOn = () => {
        if (pagingSwitchOn) {
            setPagingSwitchOn(false);
            setPagingYn('N');
            setPagingType('');
        } else {
            setPagingSwitchOn(true);
            setPagingYn('Y');
            setPagingType(edit.pagingType || 'N');
        }
    };

    useEffect(() => {
        setComponentAds(edit.componentAdList || []);
        if (edit.pagingYn === 'Y') {
            setPagingYn('Y');
            setPagingSwitchOn(true);
            setPagingType(edit.pagingType || 'N');
        } else {
            setPagingYn('N');
            setPagingSwitchOn(false);
            setPagingType('');
        }
        setPerPageCount(edit.perPageCount || '');
        setMaxPageCount(edit.maxPageCount || '');
        setDispPageCount(edit.dispPageCount || '');
        setMoreCount(edit.moreCount || '');
    }, [edit]);

    useEffect(() => {
        // 모듈 값 변경
        Core.prototype.push('save', {
            key: 'componentAdList',
            value: componentAds.filter((a) => a.ad && a.ad.adSeq)
        });
        Core.prototype.push('save', { key: 'pagingYn', value: pagingYn });
    }, [componentAds, pagingYn]);

    useEffect(() => {
        // 모듈 값 변경
        if (pagingType && pagingType !== '') {
            Core.prototype.push('save', { key: 'pagingType', value: pagingType });
        } else {
            Core.prototype.push('save', { key: 'pagingType', value: undefined });
        }
        if (perPageCount && perPageCount !== '') {
            Core.prototype.push('save', { key: 'perPageCount', value: perPageCount });
        } else {
            Core.prototype.push('save', { key: 'perPageCount', value: null });
        }
        if (maxPageCount && maxPageCount !== '') {
            Core.prototype.push('save', { key: 'maxPageCount', value: maxPageCount });
        } else {
            Core.prototype.push('save', { key: 'maxPageCount', value: undefined });
        }
        if (dispPageCount && dispPageCount !== '') {
            Core.prototype.push('save', { key: 'dispPageCount', value: dispPageCount });
        } else {
            Core.prototype.push('save', { key: 'dispPageCount', value: undefined });
        }
        if (moreCount && moreCount !== '') {
            Core.prototype.push('save', { key: 'moreCount', value: moreCount });
        } else {
            Core.prototype.push('save', { key: 'moreCount', value: undefined });
        }
    }, [pagingType, perPageCount, maxPageCount, dispPageCount, moreCount]);

    return (
        <>
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
                        목록설정
                    </Typography>
                </ExpansionPanelSummary>

                {/* Details */}
                <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                    <div className={classes.panelContents}>
                        {/* 페이징 설정 */}
                        <div className={clsx(classes.inLine, classes.w100)}>
                            {/* <Typography component="p" variant="subtitle1" className={classes.mr16}>
                                리스트 노출 건수
                            </Typography> */}
                            <WmsTextField
                                width="174"
                                label="리스트 노출 건수"
                                labelWidth="100"
                                name="perPageCount"
                                value={perPageCount}
                                placeholder="20"
                                overrideClassName={classes.mr40}
                                onChange={(e) => setPerPageCount(e.target.value)}
                                inputProps={{ type: 'number', min: 1 }}
                            />
                            <WmsSwitch
                                label="페이징 사용여부"
                                labelWidth="80"
                                checked={pagingSwitchOn}
                                onChange={onChangePagingSwitchOn}
                            />
                        </div>

                        <div
                            className={clsx(classes.inLine, classes.mt8, classes.w100, {
                                [classes.hide]: !pagingSwitchOn
                            })}
                        >
                            <WmsRadioGroup
                                overrideRootClassName={classes.mr16}
                                overrideClassName={classes.mr26}
                                disabled={!pagingSwitchOn}
                                currentId={pagingType}
                                values={['N', 'M']}
                                labels={['이전/다음', '더보기']}
                                onChange={(e) => setPagingType(e.target.value)}
                                name="more"
                            />

                            {/* 이전/다음 설정 */}
                            <div
                                className={clsx(classes.inLine, classes.mr8, {
                                    [classes.hide]: pagingType !== 'N'
                                })}
                            >
                                <WmsTextField
                                    overrideLabelClassName={clsx({
                                        [classes.disabledText]: !pagingSwitchOn
                                    })}
                                    overrideClassName={classes.mr8}
                                    disabled={!pagingSwitchOn}
                                    placeholder="1 이상"
                                    label="최대 페이지수"
                                    labelWidth="80"
                                    width="150"
                                    name="maxPageCount"
                                    value={maxPageCount}
                                    onChange={(e) => setMaxPageCount(e.target.value)}
                                    inputProps={{ type: 'number', min: 1 }}
                                />
                                <WmsTextField
                                    overrideLabelClassName={clsx({
                                        [classes.disabledText]: !pagingSwitchOn
                                    })}
                                    disabled={!pagingSwitchOn}
                                    placeholder="1 이상"
                                    label="표출 페이지수"
                                    labelWidth="80"
                                    width="150"
                                    name="dispPageCount"
                                    value={dispPageCount}
                                    onChange={(e) => setDispPageCount(e.target.value)}
                                    inputProps={{ type: 'number', min: 1 }}
                                />
                            </div>

                            {/* 더보기 설정 */}
                            <div
                                className={clsx(classes.inLine, {
                                    [classes.hide]: pagingType !== 'M'
                                })}
                            >
                                <WmsTextField
                                    overrideLabelClassName={clsx({
                                        [classes.disabledText]: !pagingSwitchOn
                                    })}
                                    overrideClassName={classes.mr8}
                                    disabled={!pagingSwitchOn}
                                    placeholder="1 이상"
                                    label="호출 건수"
                                    labelWidth="60"
                                    width="130"
                                    name="moreCount"
                                    value={moreCount}
                                    onChange={(e) => setMoreCount(e.target.value)}
                                    inputProps={{ type: 'number', min: 1 }}
                                />
                            </div>
                        </div>

                        <div className={classes.dividerWrapper}>
                            <Divider className={classes.divider} />
                        </div>

                        {/* 광고 설정 */}
                        <div className={clsx(classes.inLine, classes.adLine)}>
                            <Typography
                                component="div"
                                variant="subtitle1"
                                className={clsx(classes.label, classes.topFixedLabel)}
                            >
                                광고설정
                            </Typography>
                            <div className={clsx(classes.contentsWithLabel, classes.adContents)}>
                                <ComponentAds
                                    classes={classes}
                                    componentAds={componentAds}
                                    setComponentAds={setComponentAds}
                                    scrollHeight={scrollHeight}
                                />
                            </div>
                        </div>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </>
    );
};
export default ComponentListSet;
