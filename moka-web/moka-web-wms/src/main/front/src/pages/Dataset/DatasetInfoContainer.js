import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import produce from 'immer';
import { makeStyles } from '@material-ui/core/styles';
import { WmsCard } from '~/components';
import { DatasetForm, DeleteDialog, CopyDialog } from './components';
import style from '~/assets/jss/pages/Dataset/DatasetStyle';
import { defaultError } from '~/stores/@common/defaultError';
import {
    defaultDataset,
    getDatasetList,
    postDataset,
    putDataset,
    getDataset
} from '~/stores/dataset/datasetStore';

const useStyle = makeStyles(style);

const DatasetInfoContainer = ({ history, match }) => {
    const paramSeq = Number(match.params.datasetSeq);
    const dispatch = useDispatch();
    const classes = useStyle();
    const search = useSelector((store) => store.datasetStore.search);
    const { orgDataset, orgError, loading, latestDatasetSeq } = useSelector(
        ({ datasetStore, loadingStore }) => ({
            orgDataset: datasetStore.dataset,
            orgError: datasetStore.datasetError,
            loading:
                loadingStore['datasetStore/GET_DATASET'] ||
                loadingStore['datasetStore/POST_DATASET'] ||
                loadingStore['datasetStore/PUT_DATASET'] ||
                loadingStore['datasetStore/DELETE_DATASET'],
            latestDatasetSeq: datasetStore.latestDatasetSeq
        })
    );
    const [dataset, setDataset] = useState(defaultDataset);
    const [error, setError] = useState(defaultError);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [copyDialog, setCopyDialog] = useState(false);

    useEffect(() => {
        // url로 다이렉트로 페이지 조회하는 경우
        if (paramSeq && paramSeq !== latestDatasetSeq) {
            const option = {
                datasetSeq: paramSeq,
                direct: true, // apiCodeId 결정됨. true이면 변경
                callback: (result) => {
                    if (!result) history.push('/dataset');
                }
            };
            dispatch(getDataset(option));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 데이타셋, 에러 state 초기화
    useEffect(() => {
        // 등록상태일떄 도메인이 없으면, 현재도메인으로 설정
        if (!orgDataset.datasetSeq && !orgDataset.apiCodeId) {
            const item = produce(orgDataset, (draft) => {
                draft.apiCodeId = search.apiCodeId;
                // draft.apiHost = search.apiHost;
                // draft.apiPath = search.apiPath;
                draft.autoCreateYn = 'Y';
            });
            setDataset(item);
        } else {
            setDataset(orgDataset);
        }

        if (orgError) {
            setError(orgError);
        } else {
            setError(defaultError); // 데이타셋이 초기화될 때, 특별한 에러가 없을 경우 초기화한다.
        }
    }, [orgDataset, orgError, search.apiCodeId]);

    // 에러 추가
    const insertError = useCallback((currentError, err) => {
        return produce(currentError, (draft) => {
            draft.header.success = false;
            const index =
                draft.body.list &&
                draft.body.list.findIndex(
                    (item) => item.field === err.field && item.reason === err.reason
                );
            if (index < 0) {
                draft.body.list.push(err);
                draft.body.totalCnt++;
            }
        });
    }, []);

    // 에러 삭제
    const deleteError = useCallback((currentError, err) => {
        return produce(currentError, (draft) => {
            const index =
                draft.body.list &&
                draft.body.list.findIndex(
                    (item) => item.field === err.field && item.reason === err.reason
                );
            if (index >= 0) {
                draft.body.totalCnt--;
                if (draft.body.totalCnt === 0) {
                    draft.header.success = true;
                }
                draft.body.list.splice(index, 1);
            }
        });
    }, []);

    // 유효성 검사. key 없으면 전체검사
    const validate = useCallback(
        (key, value) => {
            let valid = true;
            let inputValue = value;
            let currentError = produce(error, (draft) => draft);

            // 데이타셋명
            if (!key || key === 'datasetName') {
                const err = {
                    field: 'datasetName',
                    reason: '데이타셋명을 입력하세요.'
                };
                inputValue = key ? value : dataset.datasetName;
                if (!inputValue || inputValue === '') {
                    currentError = insertError(currentError, err);
                    valid = false;
                } else {
                    currentError = deleteError(currentError, err);
                }
            }

            // 자동데이타셋일때 API지정여부 검사
            if (!key || key === 'dataApi') {
                const err = {
                    field: 'dataApi',
                    reason: 'API를 입력하세요.'
                };
                inputValue = key ? value : dataset.autoCreateYn;
                if (inputValue === 'Y' && (!dataset.dataApi || dataset.dataApi === '')) {
                    currentError = insertError(currentError, err);
                    valid = false;
                } else {
                    currentError = deleteError(currentError, err);
                }
            }

            // 파라미터 중에 필수 파라미터 입력여부조사
            if (!key || key === 'dataApiParam') {
                if (dataset && dataset.autoCreateYn && dataset.dataApiParamShape) {
                    Object.keys(dataset.dataApiParamShape).forEach((paramKey) => {
                        // 파라미터 정보 조회
                        const { name, desc, require } = dataset.dataApiParamShape[paramKey];

                        const err = {
                            field: `dataApiParam.${name}`,
                            reason: `API 파라미터 중에서 ${desc}를 입력하세요.`
                        };

                        inputValue = key ? value : dataset.dataApiParam;
                        if (
                            require &&
                            (!inputValue || !inputValue[name] || inputValue[name] === '')
                        ) {
                            currentError = insertError(currentError, err);
                            valid = false;
                        } else {
                            currentError = deleteError(currentError, err);
                        }
                    });
                }
            }

            setError(currentError);
            return valid;
        },
        [dataset, insertError, deleteError, error]
    );

    // 정보 변경
    const handleChangeField = useCallback(
        ({ key, value }) => {
            setDataset({
                ...dataset,
                [key]: value
            });
            validate(key, value);
        },
        [setDataset, dataset, validate]
    );

    // API 변경. dataApiParm은 handleChangeField에서 처리
    const handleChangeAPI = useCallback(
        (row) => {
            setDataset({
                ...dataset,
                dataApi: row.id,
                dataApiParam: null,
                dataApiParamShape: row.parameter
            });
        },
        [setDataset, dataset]
    );

    // 수정모드
    const updateMode = !!(dataset && dataset.datasetSeq);

    const title = updateMode
        ? `데이타셋편집 (${dataset && dataset.datasetSeq}_${dataset && dataset.datasetName})`
        : '데이타셋편집';

    // 수정 또는 저장
    const handleClickSave = useCallback(() => {
        if (!validate()) return;

        const option = {
            dataset,
            callback: (result) => {
                if (result) {
                    dispatch(getDatasetList());
                    history.push(`/dataset/${result.datasetSeq}`);
                }
            }
        };
        dispatch(paramSeq ? putDataset(option) : postDataset(option));
    }, [dispatch, paramSeq, dataset, history, validate]);

    // 데이타셋 삭제
    const handleClickRemove = useCallback(
        (e) => {
            if (paramSeq === dataset.datasetSeq) {
                e.preventDefault();
                e.stopPropagation();
                setDeleteDialog(true);
            }
        },
        [paramSeq, dataset.datasetSeq]
    );

    // 데이터셋 복사
    const handleClickCopy = useCallback(
        (e) => {
            if (paramSeq === dataset.datasetSeq) {
                e.preventDefault();
                e.stopPropagation();
                setCopyDialog(true);
            }
        },
        [paramSeq, dataset.datasetSeq]
    );

    return (
        <WmsCard title={title} overrideClassName={classes.infoRoot} loading={loading}>
            {/* 폼 */}
            <DatasetForm
                edit={dataset}
                error={error}
                loading={loading}
                onChangeField={handleChangeField}
                onChangeAPI={(row) => handleChangeAPI(row)}
                updateMode={updateMode}
                onCopy={handleClickCopy}
                onSave={handleClickSave}
                onDelete={handleClickRemove}
            />
            {deleteDialog && (
                <DeleteDialog
                    open={deleteDialog}
                    onClose={() => setDeleteDialog(false)}
                    datasetSeq={dataset.datasetSeq}
                    datasetName={dataset.datasetName}
                />
            )}
            {copyDialog && (
                <CopyDialog
                    open={copyDialog}
                    onClose={() => setCopyDialog(false)}
                    datasetSeq={dataset.datasetSeq}
                    datasetName={dataset.datasetName}
                />
            )}
        </WmsCard>
    );
};

export default withRouter(DatasetInfoContainer);
