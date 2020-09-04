import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import qs from 'qs';
import { WmsTextField, WmsText, WmsButton, WmsRadioGroup } from '~/components';
import { isError } from '~/utils/errorUtil';
import ApiDialog from './ApiDialog';
import DatasetParameter from './DatasetParameter';
import { EDIT_API } from '~/constants';
import style from '~/assets/jss/pages/Dataset/DatasetFormStyle';

const useStyle = makeStyles(style);

const DatasetForm = (props) => {
    const { edit, loading = false, error, updateMode = false } = props;
    const { onChangeField, onChangeAPI, onCopy, onSave, onDelete } = props;
    const [apiUrl, setApiUrl] = useState('');
    const [viewApiUrl, setViewApiUrl] = useState('');
    const [apiDialogOpen, setApiDialogOpen] = useState(false);
    const classes = useStyle();

    useEffect(() => {
        let url = '';
        if (!loading && edit && edit.dataApi) {
            url = edit.dataApi;
            if (edit.dataApiParam) {
                url += `?${qs.stringify(edit.dataApiParam)}`;
            }
        }
        setApiUrl(url);

        let viewUrl;
        if (!loading && edit) {
            if (edit.autoCreateYn === 'Y') {
                viewUrl = `${edit.dataApiHost}/${edit.dataApiPath}/${url}`;
            } else {
                viewUrl = `${edit.dataApiHost}/${edit.dataApiPath}/${EDIT_API}${edit.datasetSeq}`;
            }
        }
        setViewApiUrl(viewUrl);
    }, [edit, loading]);

    // 데이터 보기 팝업오픈
    const handleApiOpen = useCallback(
        (e) => {
            let url;
            if (edit.autoCreateYn === 'Y') {
                url = `${edit.dataApiHost}/${edit.dataApiPath}/${apiUrl}`;
            } else {
                url = `${edit.dataApiHost}/${edit.dataApiPath}/${EDIT_API}${edit.datasetSeq}`;
            }
            setViewApiUrl(url);
            window.open(url);
        },
        [edit, apiUrl]
    );

    // 유효성 에러 목록
    let validList = null;
    if (error && error.header && !error.header.success) {
        if (Array.isArray(error.body.list)) {
            validList = error.body.list;
        }
    }

    // 정보변경
    const handleChange = useCallback(
        (e) => {
            onChangeField({ key: e.target.name, value: e.target.value });
        },
        [onChangeField]
    );

    // API파라미터 변경
    const handleParamChange = useCallback(
        (key, value) => {
            onChangeField({ key, value });
        },
        [onChangeField]
    );

    // Api 선택
    const handleApiSelect = useCallback(
        (row) => {
            onChangeAPI(row);
        },
        [onChangeAPI]
    );

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                {/* 데이타셋 정보 */}
                <div className={clsx(classes.id, classes.mb8)}>
                    <WmsText
                        width="172"
                        labelWidth="70"
                        label="데이터셋 ID"
                        value={!loading && edit && edit.datasetSeq ? edit.datasetSeq : ''}
                    />
                    <div className={classes.btnForm}>
                        <div className="firstBtnForm">
                            <WmsButton
                                color="wolf"
                                onClick={handleApiOpen}
                                disabled={!!(viewApiUrl && viewApiUrl.length === 0)}
                            >
                                <span>데이터 보기</span>
                            </WmsButton>
                            <WmsButton color="wolf" onClick={onCopy} disabled={!updateMode}>
                                <span>복사</span>
                            </WmsButton>
                        </div>
                        <div className="secondBtnForm">
                            <WmsButton color="info" onClick={onSave} icon="save">
                                <span>저장</span>
                                <Icon>save</Icon>
                            </WmsButton>
                            <WmsButton color="del" onClick={onDelete} disabled={!updateMode}>
                                <span>삭제</span>
                                <Icon>delete</Icon>
                            </WmsButton>
                        </div>
                    </div>
                </div>
                <div className={classes.mb8}>
                    <WmsTextField
                        width="350"
                        placeholder="데이터셋명을 입력하세요"
                        labelWidth="70"
                        label="데이터셋명"
                        name="datasetName"
                        onChange={handleChange}
                        required
                        value={!loading && edit && edit.datasetName ? edit.datasetName : ''}
                        error={validList ? isError(validList, 'datasetName') : false}
                    />
                </div>
                <div className={clsx(classes.mb8, classes.datasearchForm)}>
                    <div className={classes.soloLabel}>데이터</div>

                    <WmsRadioGroup
                        values={['N', 'Y']}
                        labels={['수동', '자동']}
                        className="radio"
                        currentId={!loading && edit && edit.autoCreateYn ? edit.autoCreateYn : ''}
                        name="autoCreateYn"
                        onChange={handleChange}
                    />
                    {!loading && edit && edit.autoCreateYn === 'Y' ? (
                        <>
                            <WmsTextField
                                width="350"
                                labelWidth="50"
                                placeholder="API를 선택해 주세요"
                                label="API"
                                name="apiUrl"
                                value={apiUrl}
                                error={isError(validList, 'dataApi')}
                                disabled
                            />
                            <WmsButton
                                color="info"
                                overrideClassName={classes.ml8}
                                onClick={() => setApiDialogOpen(true)}
                            >
                                <span>검색</span>
                            </WmsButton>
                        </>
                    ) : null}
                </div>
                <div className={clsx(classes.headLine, classes.mb8)}></div>
                <div className={clsx(classes.titleLabel, classes.ml8, classes.mt8)}>데이터설정</div>
                <div className={classes.dataSettingForm}>
                    <div className={classes.dataSetting}>
                        {!loading &&
                            edit &&
                            edit.autoCreateYn === 'Y' &&
                            edit.dataApiParamShape && (
                                <DatasetParameter
                                    edit={edit}
                                    onChange={handleParamChange}
                                    error={error}
                                />
                            )}
                        <WmsTextField
                            label="설명"
                            width="700"
                            labelWidth="100"
                            multiline
                            rows={10}
                            name="description"
                            onChange={handleChange}
                            value={!loading && edit && edit.description ? edit.description : ''}
                        />
                    </div>
                </div>

                {/** API검색 팝업 */}
                {apiDialogOpen && (
                    <ApiDialog
                        open={apiDialogOpen}
                        onClose={() => setApiDialogOpen(false)}
                        onSave={(row) => handleApiSelect(row)}
                    />
                )}
            </div>
        </div>
    );
};

export default withRouter(DatasetForm);
