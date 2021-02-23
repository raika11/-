import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { invalidListToError } from '@utils/convertUtil';
import { MokaCard } from '@components';
import { GET_SPECIAL, getSpecial, clearSpecial, getSpecialDeptList, saveSpecial, changeInvalidList, deleteSpecial, DELETE_SPECIAL, SAVE_SPECIAL } from '@store/special';
import SpecialEditForm from './components/SpecialEditForm';

moment.locale('ko');
const textReg = /[\*'"]/;

/**
 * 디지털스페셜 등록/수정
 */
const SpecialEdit = ({ match }) => {
    const dispatch = useDispatch();
    const { seqNo } = useParams();
    const history = useHistory();
    const loading = useSelector(({ loading }) => loading[GET_SPECIAL] || loading[SAVE_SPECIAL] || loading[DELETE_SPECIAL]);
    const ptRows = useSelector(({ codeMgt }) => codeMgt.ptRows);
    const { special, depts, invalidList } = useSelector(({ special }) => special);
    const [temp, setTemp] = useState({});
    const [error, setError] = useState({});

    /**
     * 취소
     */
    const handleClickCancle = useCallback(() => {
        history.push(match.path);
        dispatch(clearSpecial());
    }, [dispatch, history, match]);

    /**
     * 삭제
     */
    const handleClickDelete = useCallback(() => {
        messageBox.confirm(
            '삭제하시겠습니까?',
            () => {
                dispatch(
                    deleteSpecial({
                        seqNo: special.seqNo,
                        callback: ({ header, body }) => {
                            if (header.success && body) {
                                toast.success(header.message);
                                history.push(match.path);
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            },
            () => {},
        );
    }, [dispatch, history, special.seqNo, match]);

    /**
     * validate
     * @param {object} saveObj validate target
     */
    const validate = useCallback(
        (saveObj) => {
            let isInvalid = false,
                errList = [];

            // 페이지코드 체크
            if (!saveObj.pageCd || !REQUIRED_REGEX.test(saveObj.pageCd)) {
                errList.push({
                    field: 'pageCd',
                    reason: '페이지 코드를 선택하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 회차 체크
            if (!REQUIRED_REGEX.test(saveObj.ordinal)) {
                errList.push({
                    field: 'ordinal',
                    reason: '회차를 입력하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 제목 체크
            if (!REQUIRED_REGEX.test(saveObj.pageTitle) || textReg.test(saveObj.pageTitle)) {
                errList.push({
                    field: 'pageTitle',
                    reason: '제목을 입력하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 검색키워드 체크
            if (textReg.test(saveObj.schKwd)) {
                errList.push({
                    field: 'schKwd',
                    reason: '특수문자를 입력할 수 없습니다',
                });
                isInvalid = isInvalid || true;
            }
            // 페이지설명 체크
            if (textReg.test(saveObj.pageDesc)) {
                errList.push({
                    field: 'pageDesc',
                    reason: '특수문자를 입력할 수 없습니다',
                });
                isInvalid = isInvalid || true;
            }
            // pcUrl 체크
            if (!REQUIRED_REGEX.test(saveObj.pcUrl)) {
                errList.push({
                    field: 'pcUrl',
                    reason: 'PC URL을 입력하세요',
                });
                isInvalid = isInvalid || true;
            }
            // mobUrl 체크
            if (!REQUIRED_REGEX.test(saveObj.mobUrl)) {
                errList.push({
                    field: 'mobUrl',
                    reason: 'Mobile URL을 입력하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 이미지 체크 (기존 이미지, fileValue 둘 다 없으면 에러)
            if (!saveObj.imgUrl && !saveObj.thumbnailFile) {
                errList.push({
                    field: 'imgUrl',
                    reason: '이미지를 추가하세요',
                });
                isInvalid = isInvalid || true;
            }
            // 종료일 체크 (종료일이 시작일보다 뒷날이어야함)
            if (Number(saveObj.pageSdate) > Number(saveObj.pageEdate)) {
                errList.push({
                    field: 'pageEdate',
                    reason: '종료일이 시작일보다 빠를 수 없습니다',
                });
                isInvalid = isInvalid || true;
            }

            dispatch(changeInvalidList(errList));
            return !isInvalid;
        },
        [dispatch],
    );

    /**
     * 저장
     */
    const handleClickSave = useCallback(() => {
        let saveObj = {
            ...temp,
            pageSdate: temp.pageSdate.isValid() ? moment(temp.pageSdate).format('YYYYMMDD') : null,
            pageEdate: temp.pageEdate.isValid() ? moment(temp.pageEdate).format('YYYYMMDD') : null,
        };
        if (validate(saveObj)) {
            dispatch(
                saveSpecial({
                    special: saveObj,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                            history.push(`${match.path}/${body.seqNo}`);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        }
    }, [dispatch, history, temp, match, validate]);

    useEffect(() => {
        if (seqNo) {
            dispatch(
                getSpecial({
                    seqNo,
                }),
            );
        } else {
            dispatch(clearSpecial());
        }
    }, [dispatch, seqNo]);

    useEffect(() => {
        if (!depts) {
            dispatch(getSpecialDeptList());
        }
    }, [depts, dispatch]);

    useEffect(() => {
        setTemp({
            ...special,
            pageSdate: moment(special.pageSdate, 'YYYYMMDD'),
            pageEdate: moment(special.pageEdate, 'YYYYMMDD'),
        });
        setError({});
    }, [special]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(changeInvalidList([]));
            dispatch(clearSpecial());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard
            width={766}
            loading={loading}
            titleAs={
                <div className="w-100 d-flex">
                    <h2 className="mb-0">디지털 스페셜 페이지 {special.seqNo ? '수정' : '등록'}</h2>
                    <p className="m-0 pl-2 text-positive">(등록 완료 후 스크립트 오류 체크 꼭 해주세요)</p>
                </div>
            }
            footerClassName="justify-content-center"
            footerButtons={[
                { text: special.seqNo ? '수정' : '저장', variant: 'positive', onClick: handleClickSave, className: 'mr-1' },
                special.seqNo && { text: '삭제', variant: 'negative', onClick: handleClickDelete, className: 'mr-1' },
                { text: '취소', variant: 'negative', onClick: handleClickCancle },
            ].filter((a) => a)}
            footer
        >
            <SpecialEditForm special={temp} onChange={setTemp} ptRows={ptRows} error={error} setError={setError} depts={depts} />
        </MokaCard>
    );
};

export default SpecialEdit;
