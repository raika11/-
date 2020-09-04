import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import produce from 'immer';
import { WmsButton } from '~/components';
import { ContainerForm, DeleteDialog } from './components';
import style from '~/assets/jss/pages/Container/ContainerInfoStyle';
import {
    defaultContainer,
    postContainer,
    putContainer,
    getContainer,
    getContainerList
} from '~/stores/container/containerStore';
import { defaultError } from '~/stores/@common/defaultError';

/**
 * ContainerInfoStyle Style
 */
const useStyle = makeStyles(style);

/**
 * ContainerInfoContainer
 */
const ContainerInfoContainer = () => {
    const classes = useStyle();
    const dispatch = useDispatch();
    let { containerSeq: paramSeq } = useParams();
    paramSeq = Number(paramSeq);
    let history = useHistory();
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const { orgContainer, orgError, loading, latestContainerSeq } = useSelector(
        ({ containerStore, loadingStore }) => ({
            orgContainer: containerStore.container,
            orgError: containerStore.containerError,
            loading:
                loadingStore['containerStore/GET_CONTAINER'] ||
                loadingStore['containerStore/POST_CONTAINER'] ||
                loadingStore['containerStore/PUT_CONTAINER'] ||
                loadingStore['containerStore/DELETE_CONTAINER'],
            latestContainerSeq: containerStore.latestContainerSeq
        })
    );
    const [container, setContainer] = useState(defaultContainer);
    const [error, setError] = useState(defaultError);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        // url로 다이렉트로 페이지 조회하는 경우
        if (paramSeq && paramSeq !== latestContainerSeq) {
            const option = {
                containerSeq: paramSeq,
                direct: true, // 매체,도메인 변경여부 결정됨. true이면 변경.
                callback: (result) => {
                    if (!result) history.push('/container');
                }
            };
            dispatch(getContainer(option));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 컨테이너 state 초기화
    useEffect(() => {
        // 등록상태일떄 도메인이 없으면, 현재도메인으로 설정
        if (!orgContainer.containerSeq && (!orgContainer.domain || !orgContainer.domain.doaminId)) {
            const item = produce(orgContainer, (draft) => {
                draft.domain = { domainId: latestDomainId };
            });
            setContainer(item);
        } else {
            setContainer(orgContainer);
        }

        if (orgError) {
            setError(orgError);
        } else {
            setError(defaultError); // 컨테이너 초기화될 때, 특별한 에러가 없을 경우 초기화한다.
        }
    }, [orgContainer, orgError, latestDomainId]);

    // 에러 추가
    const insertError = useCallback(
        (err) => {
            // console.error(err);
            setError(
                produce(error, (draft) => {
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
                })
            );
        },
        [error]
    );

    // 에러 삭제
    const deleteError = useCallback(
        (err) => {
            setError(
                produce(error, (draft) => {
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
                })
            );
        },
        [error]
    );

    // 유효성 검사. key 없으면 전체검사
    const validate = useCallback(
        (key, value) => {
            let valid = true;
            let inputValue = value;

            if (!key || key === 'containerName') {
                const err = {
                    field: 'containerName',
                    reason: '컨테이너명을 입력하세요.'
                };
                inputValue = key ? value : container.containerName;
                if (!inputValue || inputValue === '') {
                    insertError(err);
                    valid = false;
                } else {
                    deleteError(err);
                }
            }
            return valid;
        },
        [container, insertError, deleteError]
    );

    // 정보 수정
    const handleChangeField = useCallback(
        ({ key, value }) => {
            setContainer({
                ...container,
                [key]: value
            });
            validate(key, value);
        },
        [setContainer, container, validate]
    );

    // 수정모드
    const updateMode = !!(container && container.containerSeq);

    // 수정 또는 저장
    const handleClickSave = useCallback(() => {
        if (!validate()) return;

        const option = {
            container,
            callback: (result) => {
                if (result) {
                    dispatch(getContainerList());
                    history.push(`/container/${result.containerSeq}`);
                }
            }
        };
        dispatch(paramSeq ? putContainer(option) : postContainer(option));
    }, [dispatch, paramSeq, container, history, validate]);

    // 컨테이너 삭제
    const handelDelete = useCallback(
        (e) => {
            if (paramSeq === container.containerSeq) {
                e.preventDefault();
                e.stopPropagation();
                setOpenDeleteDialog(true);
            }
        },
        [paramSeq, container.containerSeq]
    );

    // 삭제팝업 종료
    const handelDeleteDialogClose = useCallback(() => {
        setOpenDeleteDialog(false);
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                {/* 버튼 */}
                <div className={classes.buttonGroup}>
                    <WmsButton color="info" onClick={handleClickSave} className={classes.mr8}>
                        <span>저장</span>
                        <Icon>save</Icon>
                    </WmsButton>
                    <WmsButton color="del" onClick={handelDelete} disabled={!updateMode}>
                        <span>삭제</span>
                        <Icon>delete</Icon>
                    </WmsButton>
                </div>

                {/* 폼 */}
                <ContainerForm
                    edit={container}
                    error={error}
                    loading={loading}
                    onChangeField={handleChangeField}
                    updateMode={updateMode}
                />
                {openDeleteDialog && (
                    <DeleteDialog
                        open={openDeleteDialog}
                        onClose={handelDeleteDialogClose}
                        containerSeq={container.containerSeq}
                        containerName={container.containerName}
                    />
                )}
            </div>
        </div>
    );
};

export default ContainerInfoContainer;
