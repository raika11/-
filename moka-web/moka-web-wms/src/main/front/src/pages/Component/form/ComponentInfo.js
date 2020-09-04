import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Icon } from '@material-ui/core';
import { WmsText, WmsTextField, WmsButton } from '~/components';
import { saveComponent, changeEditAll, changeInvalidList } from '~/stores/component/componentStore';
import Core from './Core';

import DeleteDialog from '../dialog/DeleteDialog';
import CopyDialog from '../dialog/CopyDialog';

/**
 * 컴포넌트 Info
 * @param {object} classes classes
 */
const ComponentInfo = ({ classes }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { componentSeq: paramSeq } = useParams();
    const { detail, edit, latestDomainId, invalidList } = useSelector((state) => ({
        detail: state.componentStore.detail,
        edit: state.componentStore.edit,
        invalidList: state.componentStore.invalidList,
        latestDomainId: state.authStore.latestDomainId
    }));

    // state
    const [componentName, setComponentName] = useState('');
    const [description, setDescription] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [nameError, setNameError] = useState(false);

    // 다이얼로그 셋팅
    const [delOpen, setDelOpen] = useState(false);
    const [copyOpen, setCopyOpen] = useState(false);

    // 저장 코어
    let componentService = new Core();

    /**
     * validate 함수
     */
    const validate = useCallback(
        (targetObj) => {
            let totErr = [];

            if (!/[^\s\t\n]+/.test(targetObj.componentName)) {
                let err = {
                    field: 'componentName',
                    reason: '컴포넌트명을 입력해주세요'
                };
                totErr.push(err);
            }
            if (!targetObj.templateSeq || targetObj.templateSeq === '') {
                let err = {
                    field: 'templateSeq',
                    reason: '템플릿을 선택해주세요'
                };
                totErr.push(err);
            }

            dispatch(changeInvalidList(totErr));
            if (totErr.length < 1) {
                return true;
            }
            return false;
        },
        [dispatch]
    );

    const handleChange = (e) => {
        if (e.target.name === 'componentName') {
            setComponentName(e.target.value);
        } else {
            setDescription(e.target.value);
        }
    };

    /**
     * 저장 버튼 클릭이벤트
     * @param {object} e 이벤트
     */
    const onSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        componentService.onSave();
    };

    /**
     * Core의 onSave시 동작 (디스패치)
     */
    const onSaveAction = useCallback(
        (objList) => {
            let tmp = {
                ...edit,
                ...objList
            };
            if (validate(tmp)) {
                dispatch(
                    saveComponent({
                        success: ({ componentSeq }) => history.push(`/component/${componentSeq}`),
                        actions: [changeEditAll(tmp)]
                    })
                );
            }
        },
        [validate, dispatch, edit, history]
    );

    /**
     * Core에 onSave시 동작 셋팅
     */
    useEffect(() => {
        Core.prototype.onSaveAction = onSaveAction;
    }, [onSaveAction]);

    useEffect(() => {
        Core.prototype.push('save', { key: 'componentName', value: componentName });
        Core.prototype.push('save', { key: 'description', value: description });
        Core.prototype.push('save', { key: 'domainId', value: latestDomainId });
    }, [componentName, description, latestDomainId]);

    useEffect(() => {
        if (paramSeq) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [paramSeq]);

    useEffect(() => {
        // 스토어에서 가져온 템플릿 데이터 셋팅
        setComponentName(edit.componentName || '');
        setDescription(edit.description || '');
    }, [edit]);

    useEffect(() => {
        setNameError(false);
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'componentName') {
                    setNameError(true);
                }
            });
        }
    }, [invalidList]);

    return (
        <>
            <div className={clsx(classes.info, classes.mb8)}>
                <WmsText
                    label="컴포넌트 ID"
                    labelWidth="70"
                    width="300"
                    value={edit.componentSeq}
                />
                <div className={classes.infoButtonGroup}>
                    <WmsButton
                        color="wolf"
                        disabled={btnDisabled}
                        onClick={() => setCopyOpen(true)}
                    >
                        설정복사
                    </WmsButton>
                    <WmsButton color="info" onClick={onSave}>
                        <span>저장</span>
                        <Icon>save</Icon>
                    </WmsButton>
                    <WmsButton color="del" disabled={btnDisabled} onClick={() => setDelOpen(true)}>
                        <span>삭제</span>
                        <Icon>delete</Icon>
                    </WmsButton>
                </div>
            </div>
            <div className={clsx(classes.w100, classes.mb8)}>
                <WmsTextField
                    placeholder="컴포넌트명을 입력하세요"
                    label="컴포넌트명"
                    name="componentName"
                    labelWidth="70"
                    width="337"
                    value={componentName}
                    onChange={handleChange}
                    error={nameError}
                    required
                />
            </div>
            <div className={clsx(classes.w100, classes.mb8)}>
                <WmsTextField
                    placeholder="설명을 입력하세요"
                    label="설명"
                    name="description"
                    labelWidth="70"
                    fullWidth
                    value={description}
                    onChange={handleChange}
                />
            </div>
            {/* 삭제 다이얼로그 */}
            <DeleteDialog
                open={delOpen}
                onClose={() => setDelOpen(false)}
                componentSeq={detail.componentSeq}
                componentName={detail.componentName}
            />
            {/* 복사 다이얼로그 */}
            <CopyDialog
                open={copyOpen}
                onClose={() => setCopyOpen(false)}
                componentSeq={detail.componentSeq}
                componentName={detail.componentName}
            />
        </>
    );
};

export default ComponentInfo;
