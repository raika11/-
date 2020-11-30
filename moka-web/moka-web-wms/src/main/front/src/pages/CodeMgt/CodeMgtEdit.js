import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import toast, { messageBox } from '@utils/toastUtil';

import Search from './CodeMgtEditSearch';
import AgGrid from './CodeMgtEditAgGrid';

import { saveCodeMgt, deleteCodeMgt, changeCd, clearCd } from '@store/codeMgt';

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
                        const { body } = response;
                        toast.success('수정하였습니다.');
                        history.push(`/codeMgt/${body.codeMgtGrp.grpCd}`);
                        dispatch(clearCd());
                    } else {
                        toast.fail('실패하였습니다.');
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
                        toast.success('등록하였습니다.');
                        history.push(`/codeMgt/${body.codeMgtGrp.grpCd}`);
                        dispatch(clearCd());
                    } else {
                        toast.fail('실패하였습니다.');
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
        messageBox.confirm('적용하시겠습니까?', () => {
            if (!code.seqNo) {
                insertGrp(code);
            } else {
                updateGrp(code);
            }
        });
    };

    /**
     * 삭제 버튼 클릭
     * @param {object} code 코드 데이터
     */
    const onClickDelete = (code) => {
        messageBox.confirm('코드를 삭제하시겠습니까?', () => {
            dispatch(
                deleteCodeMgt({
                    cdSeq: code.cdSeq,
                    callback: (response) => {
                        if (response.header.success) {
                            toast.success('삭제하였습니다.');
                            history.push(`/codeMgt/${code.grpCd}`);
                        } else {
                            toast.fail(response.header.message);
                        }
                    },
                }),
            );
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
