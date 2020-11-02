import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { notification, toastr } from '@utils/toastUtil';
import Search from './CodeMgtEditSearch';
import AgGrid from './CodeMgtEditAgGrid';

import { saveCodeMgt, deleteCodeMgt, changeCd } from '@store/codeMgt';

/**
 * 기타코드 편집
 */
const CodeMgtEdit = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { cd } = useSelector((store) => ({
        cd: store.codeMgt.cd,
    }));

    /**
     * 코드 수정
     * @param {object} code 코드 데이터
     */
    const updateGrp = (code) => {
        dispatch(
            saveCodeMgt({
                type: 'update',
                actions: [
                    changeCd({
                        ...cd,
                        ...code,
                    }),
                ],
                callback: (response) => {
                    if (response.header.success) {
                        notification('success', '수정하였습니다.');
                    } else {
                        notification('warning', '실패하였습니다.');
                    }
                },
            }),
        );
    };

    /**
     * 코드 등록
     * @param {object} code 코드 데이터
     */
    const insertGrp = (code) => {
        dispatch(
            saveCodeMgt({
                type: 'insert',
                actions: [
                    changeCd({
                        ...cd,
                        ...code,
                    }),
                ],
                callback: (response) => {
                    if (response.header.success) {
                        const { body } = response;
                        notification('success', '등록하였습니다.');
                        history.push(`/codeMgt/${body.codeMgtGrp.grpCd}`);
                    } else {
                        notification('warning', '실패하였습니다.');
                    }
                },
            }),
        );
    };

    /**
     * 저장 이벤트
     * @param {object} code 코드 데이터
     */
    const onClickSave = (code) => {
        toastr.confirm('적용하시겠습니까?', {
            onOk: () => {
                if (!code.cdSeq) {
                    insertGrp(code);
                } else {
                    updateGrp(code);
                }
            },
            onCancle: () => {},
            attention: false,
        });
    };

    /**
     * 삭제 버튼 클릭
     * @param {object} code 코드 데이터
     */
    const onClickDelete = (code) => {
        toastr.confirm('코드를 삭제하시겠습니까?', {
            onOk: () => {
                dispatch(
                    deleteCodeMgt({
                        cdSeq: code.cdSeq,
                        callback: (response) => {
                            if (response.header.success) {
                                notification('success', '삭제하였습니다.');
                                history.push(`/codeMgt/${code.grpCd}`);
                            } else {
                                notification('warning', response.header.message);
                            }
                        },
                    }),
                );
            },
            onCancle: () => {},
            attention: false,
        });
    };

    return (
        <>
            <Search onSave={onClickSave} onDelete={onClickDelete} />
            <AgGrid onSave={onClickSave} onDelete={onClickDelete} />
        </>
    );
};

export default CodeMgtEdit;
