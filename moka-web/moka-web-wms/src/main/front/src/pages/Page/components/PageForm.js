import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import WmsTextField, { WmsTextFieldIcon, WmsText, WmsLink } from '~/components/WmsTextFields';
import { WmsSelect, WmsSwitch } from '~/components';
import style from '~/assets/jss/pages/Template/TemplateInfoStyle';
import MovePageDialog from './MovePageDialog';
import { isError } from '~/utils/errorUtil';

/**
 * TemplateInfoContainer Style
 */
const useStyle = makeStyles(style);

/**
 * 페이지폼
 */
const PageForm = (props) => {
    const { edit, loading, error, onChangeField, updateMode = false, pageTypeRows } = props;
    const classes = useStyle();
    const [movePageDialogOpen, setMovePageDialogOpen] = useState(false);

    // 유효성 에러 목록
    let validList;
    if (error && error.header && !error.header.success) {
        if (Array.isArray(error.body.list)) {
            validList = error.body.list;
        }
    }

    // 정보변경
    const handleChange = useCallback(
        (e) => {
            let value;
            if (e.target.name === 'pageSeq') {
                value = Number(e.target.value);
            } else if (e.target.name === 'useYn' || e.target.name === 'moveYn') {
                value = e.target.checked ? 'Y' : 'N';
            } else {
                value = e.target.value;
            }
            onChangeField({ key: e.target.name, value });
        },
        [onChangeField]
    );

    const handleMovePageSelect = useCallback(
        (row) => {
            onChangeField({ key: 'moveUrl', value: row.pageUrl });
        },
        [onChangeField]
    );

    const bRoot = !(!loading && edit && edit.parent && edit.parent.pageSeq);

    return (
        <>
            <div className={classes.mb8}>
                <WmsSwitch
                    label="사용여부"
                    labelWidth="70"
                    fullWidth
                    checked={!!(!loading && edit && edit.useYn === 'Y')}
                    onChange={handleChange}
                    name="useYn"
                />
            </div>
            <div className={clsx(classes.id, classes.mb8)}>
                <WmsText
                    width="172"
                    labelWidth="70"
                    label="페이지ID"
                    name="pageSeq"
                    disabled
                    value={!loading && edit && edit.pageSeq ? edit.pageSeq : ''}
                />
                <WmsLink
                    width="220"
                    labelWidth="40"
                    label="URL"
                    name="url"
                    link={
                        !loading && edit && edit.pageUrl
                            ? `//${edit.domain.domainUrl}${edit.pageUrl}`
                            : ''
                    }
                    value={!loading && edit && edit.pageUrl ? edit.pageUrl : ''}
                />
            </div>
            <div className={classes.mb8}>
                <WmsTextField
                    fullWidth
                    placeholder="페이지명을 입력하세요"
                    labelWidth="70"
                    label="페이지명"
                    name="pageName"
                    onChange={handleChange}
                    error={isError(validList, 'pageName')}
                    value={!loading && edit && edit.pageName ? edit.pageName : ''}
                    required
                />
            </div>
            <div className={clsx(classes.size, classes.mb8)}>
                <WmsTextField
                    placeholder="서비스명을 입력하세요"
                    label="서비스명"
                    labelWidth="70"
                    width="225"
                    name="pageServiceName"
                    onChange={handleChange}
                    error={isError(validList, 'pageServiceName')}
                    disabled={updateMode || (edit.parent && edit.parent.pageSeq === null)}
                    value={!loading && edit && edit.pageServiceName ? edit.pageServiceName : ''}
                    required={!bRoot}
                />

                <WmsSelect
                    width="calc(100% - 240px)"
                    rows={pageTypeRows}
                    name="pageType"
                    currentId={!loading && edit && edit.pageType ? edit.pageType : ''}
                    onChange={handleChange}
                />
            </div>
            <div className={clsx(classes.size, classes.mb8)}>
                <WmsTextField
                    placeholder="표출명을 입력하세요"
                    label="표출명"
                    labelWidth="70"
                    width="270"
                    name="pageDisplayName"
                    onChange={handleChange}
                    error={isError(validList, 'pageDisplayName')}
                    value={!loading && edit && edit.pageDisplayName ? edit.pageDisplayName : ''}
                />
                <WmsTextField
                    width="100"
                    labelWidth="40"
                    label="순서 "
                    name="pageOrder"
                    onChange={handleChange}
                    inputProps={{ type: 'number' }}
                    error={isError(validList, 'pageOrder')}
                    value={!loading && edit && edit.pageOrder ? edit.pageOrder : ''}
                    required
                />
            </div>
            <div className={classes.mb8}>
                <WmsSwitch
                    label="이동URL"
                    labelWidth="70"
                    checked={!!(!loading && edit && edit.moveYn === 'Y')}
                    onChange={handleChange}
                    name="moveYn"
                />

                <WmsTextFieldIcon
                    placeholder="이동URL을 입력하세요"
                    value={!loading && edit && edit.moveUrl ? edit.moveUrl : ''}
                    name="moveUrl"
                    width="calc(100% - 132px)"
                    icon="search"
                    disabled={!!(!loading && edit && edit.moveYn === 'N')}
                    onIconClick={() =>
                        edit && edit.moveYn === 'Y' ? setMovePageDialogOpen(true) : null
                    }
                    error={isError(validList, 'moveUrl')}
                />
            </div>
            <div className={classes.mb8}>
                <WmsTextField
                    fullWidth
                    placeholder="키워드를 입력하세요"
                    labelWidth="70"
                    label="키워드"
                    name="keyword"
                    onChange={handleChange}
                    error={isError(validList, 'keyword')}
                    value={!loading && edit && edit.keyword ? edit.keyword : ''}
                />
            </div>
            <div className={classes.mb8}>
                <WmsTextField
                    fullWidth
                    placeholder="설명을 입력하세요"
                    labelWidth="70"
                    label="설명"
                    name="description"
                    onChange={handleChange}
                    error={isError(validList, 'description')}
                    value={!loading && edit && edit.description ? edit.description : ''}
                />
            </div>

            {/** 이동 페이지 검색 팝업 */}
            {movePageDialogOpen && (
                <MovePageDialog
                    open={movePageDialogOpen}
                    onClose={() => setMovePageDialogOpen(false)}
                    onSave={(row) => handleMovePageSelect(row)}
                />
            )}
        </>
    );
};

export default PageForm;
