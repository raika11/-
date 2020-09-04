import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { WmsTextField, WmsText, WmsSelect } from '~/components';
import Core from './Core';

const targetType = [
    { id: '_blank', name: 'blank' },
    { id: '_self', name: 'self' },
    { id: '_parent', name: 'parent' },
    { id: '_top', name: 'top' }
];
const euckrBytes = (text) => {
    const euckrLength = ((s, b = 0, i = 0, c = 0) => {
        // eslint-disable-next-line no-cond-assign
        for (i = 0; (c = s.charCodeAt(i++)); b += c >= 128 ? 2 : 1);
        return b;
    })(text);
    return euckrLength;
};

/**
 * 데스킹 수정폼 왼쪽
 */
const DeskingInfoLeft = (props) => {
    const { classes, component = {}, workData = {}, isDummyForm, deskingEtccodes = [] } = props;

    // 데스킹 정보
    const [mark, setMark] = useState(''); // 약물
    const [fixedTitle, setFixedTitle] = useState(''); // 불변하는 제목
    const [nameplate, setNameplate] = useState(''); // 어깨제목
    const [titlePrefix, setTitlePrefix] = useState(''); // 말머리
    const [title, setTitle] = useState('');
    const [mobileTitle, setMobileTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkTarget, setLinkTarget] = useState('');
    const [moreUrl, setMoreUrl] = useState('');
    const [moreTarget, setMoreTarget] = useState('');

    useEffect(() => {
        if (component !== null) {
            // 데스킹워크에 필요한 컴포넌트 정보 넣음
            Core.prototype.push('info', { key: 'deskingSeq', value: component.deskingSeq });
            Core.prototype.push('info', { key: 'datasetSeq', value: component.datasetSeq });
            Core.prototype.push('info', { key: 'editionSeq', value: component.editionSeq });
            Core.prototype.push('info', { key: 'lang', value: component.searchLang });
        }
    }, [component]);

    useEffect(() => {
        Core.prototype.push('info', { key: 'nameplate', value: nameplate });
        Core.prototype.push('info', { key: 'titlePrefix', value: titlePrefix });
        Core.prototype.push('info', { key: 'title', value: title });
        Core.prototype.push('info', { key: 'mobileTitle', value: mobileTitle });
        Core.prototype.push('info', { key: 'subtitle', value: subtitle });
        Core.prototype.push('info', { key: 'linkUrl', value: linkUrl });
        Core.prototype.push('info', { key: 'linkTarget', value: linkTarget });
        Core.prototype.push('info', { key: 'moreUrl', value: moreUrl });
        Core.prototype.push('info', { key: 'moreTarget', value: moreTarget });
    }, [
        nameplate,
        titlePrefix,
        title,
        mobileTitle,
        subtitle,
        linkUrl,
        linkTarget,
        moreUrl,
        moreTarget
    ]);

    useEffect(() => {
        setFixedTitle(workData.title || '');
        setNameplate(workData.nameplate || '');
        setTitlePrefix(workData.titlePrefix || '');
        setTitle(workData.title || '');
        setMobileTitle(workData.mobileTitle || '');
        setSubtitle(workData.subtitle || '');
        setLinkUrl(workData.linkUrl || '');
        setLinkTarget(workData.linkTarget || '');
        setMoreUrl(workData.moreUrl || '');
        setMoreTarget(workData.moreTarget || '');
        Core.prototype.push('info', { key: 'seq', value: workData.seq });

        // 더미기사 예외처리
        if (workData.contentsAttr === 'D' || isDummyForm) {
            setFixedTitle('더미기사');
        }
    }, [workData, isDummyForm]);

    useEffect(() => {
        if (Array.isArray(deskingEtccodes) && deskingEtccodes.length > 0) {
            setMark(deskingEtccodes.find((code) => code.codeId === 'MARK').codeNameEtc1);
        }
    }, [deskingEtccodes]);

    return (
        <div className={classes.infoLeftRoot}>
            <div className={clsx(classes.infoName, classes.mb8)}>
                {/* 기사 정보 */}
                <div className={classes.inLine}>
                    <Typography component="p" variant="h5">
                        {/* eslint-disable-next-line prefer-template */}
                        {('0' + (workData.contentsOrder || '')).slice(-2)}
                    </Typography>
                    <Typography component="p" variant="h5">
                        {fixedTitle}
                    </Typography>
                </div>
                {/* 컴포넌트 정보 */}
                <div className={classes.inLine}>
                    {!isDummyForm && (
                        <Typography component="p" variant="subtitle1">
                            {`ID: ${workData.contentsId || ''}`}
                        </Typography>
                    )}
                    <Typography component="p" variant="subtitle1">
                        {component && `(cp${component.componentSeq} ${component.componentName})`}
                    </Typography>
                </div>
            </div>

            <WmsText label="약물" labelWidth="60" value={mark} overrideClassName={classes.mb8} />

            <div className={clsx(classes.inline, classes.mb8)}>
                <WmsTextField
                    overrideClassName={classes.mr8}
                    label="어깨제목"
                    labelWidth="60"
                    value={nameplate}
                    width="300"
                    name="nameplate"
                    onChange={(e) => setNameplate(e.target.value)}
                />
                <WmsSelect
                    overrideClassName={classes.ml8}
                    label="말머리"
                    labelWidth="40"
                    name="titlePrefix"
                    width="150"
                    currentId={titlePrefix}
                    onChange={(e) => setTitlePrefix(e.target.value)}
                />
            </div>

            <div className={clsx(classes.inLine, classes.mb8)}>
                <WmsTextField
                    label={
                        <>
                            <Typography variant="subtitle1" component="p">
                                Web
                            </Typography>
                            <Typography variant="subtitle1" component="p">
                                제목
                            </Typography>
                        </>
                    }
                    labelWidth="60"
                    width="466"
                    multiline
                    rows={2}
                    name="title"
                    value={title}
                    overrideLabelClassName={classes.topFixedLabel}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <WmsText
                    width="58"
                    name="titleLength"
                    value={`${euckrBytes(title)}byte`}
                    align="right"
                    overrideClassName={classes.endText}
                />
            </div>

            <div className={clsx(classes.inLine, classes.mb8)}>
                <WmsTextField
                    label={
                        <>
                            <Typography variant="subtitle1" component="p">
                                Mobile
                            </Typography>
                            <Typography variant="subtitle1" component="p">
                                제목
                            </Typography>
                        </>
                    }
                    labelWidth="60"
                    width="466"
                    multiline
                    rows={2}
                    name="mobileTitle"
                    value={mobileTitle}
                    overrideLabelClassName={classes.topFixedLabel}
                    onChange={(e) => setMobileTitle(e.target.value)}
                />
                <WmsText
                    width="58"
                    name="mobileTitleLength"
                    value={`${euckrBytes(mobileTitle)}byte`}
                    align="right"
                    overrideClassName={classes.endText}
                />
            </div>

            <WmsTextField
                label="부제"
                labelWidth="60"
                fullWidth
                multiline
                rows={2}
                name="subTitle"
                value={subtitle}
                overrideClassName={classes.mb8}
                onChange={(e) => setSubtitle(e.target.value)}
            />

            <div className={clsx(classes.inLine, classes.mb8)}>
                <WmsTextField
                    label="링크"
                    labelWidth="60"
                    width="380"
                    value={linkUrl}
                    name="linkUrl"
                    overrideClassName={classes.mr8}
                    onChange={(e) => setLinkUrl(e.target.value)}
                />
                <WmsSelect
                    name="linkTarget"
                    width="calc(100% - 388px)"
                    rows={targetType}
                    currentId={linkTarget}
                    onChange={(e) => setLinkTarget(e.target.value)}
                />
            </div>

            <div className={classes.mb8}>
                <WmsTextField
                    overrideClassName={classes.mr8}
                    overrideLabelClassName={classes.topFixedLabel}
                    label={
                        <>
                            <Typography variant="subtitle1" component="p">
                                관련기사
                            </Typography>
                            <Typography variant="subtitle1" component="p">
                                더보기
                            </Typography>
                        </>
                    }
                    labelWidth="60"
                    width="380"
                    name="moreUrl"
                    value={moreUrl}
                    onChange={(e) => setMoreUrl(e.target.value)}
                />
                <WmsSelect
                    name="moreTarget"
                    width="calc(100% - 388px)"
                    rows={targetType}
                    currentId={moreTarget}
                    onChange={(e) => setMoreTarget(e.target.value)}
                />
            </div>
        </div>
    );
};

export default DeskingInfoLeft;
