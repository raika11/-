import React, { useCallback, useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import {
    WmsSwitch,
    WmsRadioGroup,
    WmsTextField,
    WmsTextFieldWithDivider,
    WmsCopyToClipboard
} from '~/components';
import Core from './Core';
import { TextFieldWithMultipleDivider } from '../components';

const TemplateDialog = React.lazy(() => import('../dialog/TemplateDialog'));
const DatasetDialog = React.lazy(() => import('../dialog/DatasetDialog'));
const SkinDialog = React.lazy(() => import('../dialog/SkinDialog'));
const Loading = () => <></>;

/**
 * 컴포넌트 기본 설정
 * @param {object} props Props
 */
const ComponentBasicSet = (props) => {
    const { expandComponent, classes } = props;
    const { detail, edit, invalidList } = useSelector(({ componentStore }) => ({
        detail: componentStore.detail,
        edit: componentStore.edit,
        invalidList: componentStore.invalidList
    }));

    // 템플릿 설정
    const [templateName, setTemplateName] = useState('');
    const [templateSeq, setTemplateSeq] = useState('');
    const [templateGroupName, setTemplateGroupName] = useState('');
    const [templateError, setTemplateError] = useState(false);
    // 데이터셋 설정
    const [dataType, setDataType] = useState('NONE');
    const [datasetSwitchOn, setDatasetSwitchOn] = useState(false);
    const [datasetSeq, setDatasetSeq] = useState('');
    const [datasetName, setDatasetName] = useState('');
    const [delWords, setDelWords] = useState('');
    // 스킨 설정
    const [skinSeq, setSkinSeq] = useState('');
    const [skinName, setSkinName] = useState('');
    // 다이얼로그 설정
    const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
    const [datasetDialogOpen, setDatasetDialogOpen] = useState(false);
    const [skinDialogOpen, setSkinDialogOpen] = useState(false);

    /**
     * 데이터셋 변경
     * @param {string} value DESK | AUTO | NONE
     */
    const onChangeDataset = useCallback(
        (value) => {
            setDataType(value);
            if (value === 'AUTO') {
                if (detail.prevAutoDataset) {
                    setDatasetSeq(detail.prevAutoDataset.datasetSeq);
                    setDatasetName(detail.prevAutoDataset.datasetName);
                } else {
                    setDatasetSeq('');
                    setDatasetName('');
                }
            } else if (value === 'DESK') {
                if (detail.prevDeskDataset) {
                    setDatasetSeq(detail.prevDeskDataset.datasetSeq);
                    setDatasetName(detail.prevDeskDataset.datasetName);
                } else {
                    setDatasetSeq('');
                    setDatasetName('');
                }
            } else {
                setDatasetSeq('');
                setDatasetName('');
            }
        },
        [detail]
    );

    /**
     * 데이터셋 사용여부 스위치 온오프
     */
    const onChangeDatasetSwitchOn = () => {
        if (datasetSwitchOn) {
            // 스위치오프
            setDatasetSwitchOn(false);
            onChangeDataset('NONE');
        } else {
            // 스위치온
            setDatasetSwitchOn(true);
            onChangeDataset('DESK');
        }
    };

    /**
     * 데이터셋 자동/수동 라디오버튼 변경
     * @param {object} e 이벤트
     */
    const onChangeDatasetAutoCreateYn = (e) => {
        onChangeDataset(e.target.value);
        // 미리보기 화면 리소스 컴포넌트 접기/펴기
        expandComponent(datasetSwitchOn, e.target.value === 'DESK');
    };

    /**
     * 삭제단어 변경
     * @param {object} e 이벤트
     */
    const onChangeDelWords = (e) => {
        setDelWords(e.target.value);
    };

    useEffect(() => {
        Core.prototype.push('save', { key: 'templateSeq', value: templateSeq });
        Core.prototype.push('save', { key: 'dataType', value: dataType });
        if (dataType !== 'NONE') {
            Core.prototype.push('save', { key: 'datasetSeq', value: datasetSeq });
        } else {
            Core.prototype.push('save', { key: 'datasetSeq', value: undefined });
        }
        Core.prototype.push('save', { key: 'delWords', value: delWords });
        if (skinSeq !== '') {
            Core.prototype.push('save', { key: 'skinSeq', value: skinSeq });
        } else {
            Core.prototype.push('save', { key: 'skinSeq', value: undefined });
        }
    }, [templateSeq, dataType, datasetSeq, delWords, skinSeq]);

    useEffect(() => {
        // 스토어에서 가져온 데이터 셋팅
        setTemplateName(edit.templateName || '');
        setTemplateSeq(edit.templateSeq || '');
        setTemplateGroupName(edit.templateGroupName || '');
        setDataType(edit.dataType || 'NONE');
        setDelWords(edit.delWords || '');
        setSkinName(edit.skinName || '');
        setSkinSeq(edit.skinSeq || '');
        if (edit.dataType && edit.dataType !== 'NONE') {
            setDatasetSwitchOn(true);
            setDatasetSeq(edit.datasetSeq || '');
            setDatasetName(edit.datasetName || '');
        } else {
            setDatasetSwitchOn(false);
            setDatasetSeq('');
            setDatasetName('');
        }
    }, [edit]);

    useEffect(() => {
        // 하위 셋팅 컴포넌트 접기/펴기
        expandComponent(datasetSwitchOn, dataType === 'DESK');
    }, [expandComponent, datasetSwitchOn, dataType]);

    useEffect(() => {
        setTemplateError(false);
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'templateSeq') {
                    setTemplateError(true);
                }
            });
        }
    }, [invalidList]);

    return (
        <>
            <div className={clsx(classes.mt8, classes.mb8, classes.block)}>
                {/* 템플릿 설정 */}
                <div className={classes.mb8}>
                    <TextFieldWithMultipleDivider
                        label="템플릿"
                        labelWidth="70"
                        disabled
                        error={templateError}
                        required
                        views={[
                            {
                                placeholder: 'ID',
                                value: templateSeq !== '' ? `ID : ${templateSeq}` : '',
                                width: 60,
                                divider: 'end',
                                link: templateSeq !== '' ? `/template/${templateSeq}` : undefined
                            },
                            {
                                placeholder: '위치그룹정보',
                                value: templateGroupName,
                                width: 175,
                                divider: 'end'
                            },
                            {
                                placeholder: '템플릿을 선택해주세요',
                                icon: 'search',
                                width: 464,
                                value: templateName,
                                onIconClick: () => setTemplateDialogOpen(true)
                            }
                        ]}
                    />
                </div>

                {/* 데이터셋 설정 */}
                <div className={clsx(classes.mb8, classes.inLine)}>
                    <Typography className={classes.label} component="div" variant="subtitle1">
                        데이터
                    </Typography>
                    <div className={classes.mr8}>
                        <WmsSwitch
                            label="사용여부"
                            labelWidth="45"
                            checked={datasetSwitchOn}
                            onChange={onChangeDatasetSwitchOn}
                        />
                    </div>
                    <div
                        className={clsx(classes.inLine, {
                            [classes.hidden]: !datasetSwitchOn
                        })}
                    >
                        <WmsRadioGroup
                            values={['DESK', 'AUTO']}
                            labels={['수동', '자동']}
                            currentId={dataType}
                            name="autoCreateYn"
                            overrideClassName={classes.radioGroup}
                            onChange={onChangeDatasetAutoCreateYn}
                            components={[
                                <div
                                    className={clsx(classes.mr8, {
                                        [classes.hidden]: dataType !== 'DESK'
                                    })}
                                >
                                    <WmsTextField
                                        placeholder="ID"
                                        width="62"
                                        disabled
                                        value={
                                            dataType === 'DESK' && datasetSeq !== ''
                                                ? `ID : ${datasetSeq}`
                                                : ''
                                        }
                                    />
                                </div>,
                                <div
                                    className={clsx(classes.inLine, {
                                        [classes.hidden]: dataType !== 'AUTO'
                                    })}
                                >
                                    <WmsTextFieldWithDivider
                                        width="390"
                                        disabled
                                        dividerBefore={{
                                            placeholder: 'ID',
                                            value:
                                                dataType === 'AUTO' && datasetSeq !== ''
                                                    ? `ID : ${datasetSeq}`
                                                    : '',
                                            width: 60,
                                            link:
                                                dataType === 'AUTO' && datasetSeq !== ''
                                                    ? `/dataset/${datasetSeq}`
                                                    : undefined
                                        }}
                                        dividerAfter={{
                                            placeholder: '데이터셋을 선택해주세요',
                                            icon: 'search',
                                            value: datasetName,
                                            onIconClick: () => setDatasetDialogOpen(true)
                                        }}
                                    />
                                </div>
                            ]}
                        />
                    </div>
                </div>

                {/* 입력태그 */}
                <div className={classes.mb8}>
                    <WmsCopyToClipboard
                        labelWidth="70"
                        label="입력태그"
                        width="713"
                        value={edit.inputTag}
                    />
                </div>

                {/* 삭제 단어 */}
                <div className={clsx(classes.mb8, { [classes.hide]: !datasetSwitchOn })}>
                    <WmsTextField
                        label={
                            <>
                                <Typography variant="subtitle1" component="p">
                                    삭제단어
                                </Typography>
                                <Typography variant="subtitle1" component="p">
                                    (제목)
                                </Typography>
                            </>
                        }
                        labelWidth="70"
                        width="378"
                        multiline
                        rows={4}
                        name="delWords"
                        value={delWords}
                        onChange={onChangeDelWords}
                        overrideLabelClassName={classes.topFixedLabel}
                    />
                </div>

                {/* 연결본문 콘텐츠스킨 */}
                <div className={clsx(classes.mb8, { [classes.hide]: !datasetSwitchOn })}>
                    <WmsTextFieldWithDivider
                        label="콘텐츠스킨"
                        labelWidth="70"
                        width="460"
                        disabled
                        dividerBefore={{
                            placeholder: 'ID',
                            value: '',
                            width: 60,
                            link: undefined
                        }}
                        dividerAfter={{
                            placeholder: '연결할 콘텐츠스킨을 선택해주세요',
                            icon: 'search',
                            value: skinName,
                            onIconClick: () => setSkinDialogOpen(true)
                        }}
                    />
                </div>
            </div>

            {/** 템플릿 팝업 */}
            <Suspense fallback={<Loading />}>
                {templateDialogOpen && (
                    <TemplateDialog
                        open={templateDialogOpen}
                        onClose={() => setTemplateDialogOpen(false)}
                        setTemplateSeq={setTemplateSeq}
                        setTemplateName={setTemplateName}
                        setTemplateGroupName={setTemplateGroupName}
                        setTemplateError={setTemplateError}
                    />
                )}
            </Suspense>

            {/** 데이터셋 팝업 */}
            <Suspense fallback={<Loading />}>
                {datasetDialogOpen && (
                    <DatasetDialog
                        open={datasetDialogOpen}
                        onClose={() => setDatasetDialogOpen(false)}
                        setDatasetSeq={setDatasetSeq}
                        setDatasetName={setDatasetName}
                        setDataType={setDataType}
                    />
                )}
            </Suspense>

            {/** 본문스킨 팝업 */}
            <Suspense fallback={<Loading />}>
                {skinDialogOpen && (
                    <SkinDialog
                        open={skinDialogOpen}
                        onClose={() => setSkinDialogOpen(false)}
                        setSkinSeq={setSkinSeq}
                        setSkinName={setSkinName}
                    />
                )}
            </Suspense>
        </>
    );
};
export default ComponentBasicSet;
