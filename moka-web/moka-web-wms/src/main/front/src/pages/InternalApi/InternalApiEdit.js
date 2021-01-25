import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import produce from 'immer';
import { MokaCard, MokaInputLabel } from '@/components';
import {
    initialState,
    getInternalApi,
    clearInternalApi,
    changeInvalidList,
    saveInternalApi,
    deleteInternalApi,
    DELETE_INTERNAL_API,
    GET_INTERNAL_API,
    SAVE_INTERNAL_API,
} from '@store/internalApi';
import toast, { messageBox } from '@/utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { invalidListToError } from '@utils/convertUtil';
import ParamDesc from './components/ParamDesc';

/**
 * API 등록/수정
 */
const InternalApiEdit = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { seqNo } = useParams();
    const loading = useSelector(({ loading }) => loading[GET_INTERNAL_API] || loading[SAVE_INTERNAL_API] || loading[DELETE_INTERNAL_API]);
    const { internalApi, invalidList } = useSelector(({ internalApi }) => ({
        internalApi: internalApi.internalApi,
        invalidList: internalApi.invalidList,
    }));
    const [btns, setBtns] = useState([]);
    const [temp, setTemp] = useState(initialState.internalApi);
    const [error, setError] = useState({});
    const [paramList, setParamList] = useState([initialState.defaultParam]);

    /**
     * paramDesc 리셋
     */
    const resetParamDesc = () => setParamList([initialState.defaultParam]);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'usedYn') {
            setTemp({ ...temp, usedYn: checked ? 'Y' : 'N' });
        } else {
            if (name === 'apiName' || name === 'apiPath') {
                setError({ ...error, [name]: false });
            }
            setTemp({ ...temp, [name]: value });
        }
    };

    /**
     * validate
     */
    const validate = useCallback(
        (save) => {
            let isInvalid = false;
            let errList = [];

            // API명 체크
            if (!REQUIRED_REGEX.test(save.apiName)) {
                errList.push({
                    field: 'apiName',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }

            // API 경로 체크
            if (!REQUIRED_REGEX.test(save.apiPath)) {
                errList.push({
                    field: 'apiPath',
                    reason: '',
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
        const paramDesc = paramList
            .filter((a) => a.name !== '')
            .reduce(
                (all, cv) => ({
                    ...all,
                    [cv.name]: cv,
                }),
                {},
            );
        const save = {
            ...temp,
            // 기본값 셋팅 (GET)
            apiMethod: !temp.apiMethod ? initialState.apiMethodList[1].id : temp.apiMethod,
            paramDesc: Object.keys(paramDesc).length > 0 ? JSON.stringify(paramDesc) : null,
        };

        if (validate(save)) {
            dispatch(
                saveInternalApi({
                    internalApi: save,
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
    }, [dispatch, history, match.path, paramList, temp, validate]);

    /**
     * 취소
     */
    const handleClickCancel = useCallback(() => history.push(match.path), [history, match.path]);

    /**
     * 삭제
     */
    const handleClickDelete = useCallback(() => {
        messageBox.confirm(
            '삭제하시겠습니까?',
            () => {
                dispatch(
                    deleteInternalApi({
                        seqNo: temp.seqNo,
                        callback: ({ header, body }) => {
                            if (header.success) {
                                if (body) {
                                    toast.success(header.message);
                                    history.push(match.path);
                                } else {
                                    messageBox.alert(header.message);
                                }
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            },
            () => {},
        );
    }, [dispatch, history, match.path, temp.seqNo]);

    /**
     * 파라미터명 validate
     * onBlur 에 실행
     * @param {object} e 이벤트
     * @param {number} idx 순번
     */
    const validateParamName = (e, idx) => {
        const { value } = e.target;
        if (value !== '') {
            const v = paramList.filter((a, index) => index !== idx).find((a) => a.name === value);
            setError({ ...error, [`param-${idx}`]: v ? true : false, [`param-${idx}Message`]: '동일한 파라미터가 존재합니다' });
        }
    };

    /**
     * 파라미터 추가
     */
    const handleClickAddParam = () => {
        setParamList(
            produce(paramList, (draft) => {
                draft.push(initialState.defaultParam);
            }),
        );
    };

    /**
     * 파라미터 삭제
     * @param {number} idx 삭제되는 파라미터 순번
     */
    const handleClickDeleteParam = (idx) => {
        setParamList(
            produce(paramList, (draft) => {
                draft.splice(idx, 1);
            }),
        );
        setError({ ...error, [`param-${idx}`]: false, [`param-${idx}Message`]: undefined });
    };

    /**
     * 파라미터 값 변경
     * @param {object} e 이벤트
     * @param {number} idx 리스트에서 바뀐 데이터 순번
     */
    const handleChangeValueParamDesc = (e, idx) => {
        const { name, value } = e.target;
        setParamList(
            produce(paramList, (draft) => {
                draft[idx][name] = value;
            }),
        );
    };

    useEffect(() => {
        if (seqNo) {
            dispatch(
                getInternalApi({
                    seqNo,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearInternalApi());
        }
    }, [dispatch, seqNo]);

    useEffect(() => {
        if (seqNo) {
            setBtns([
                { text: '저장', variant: 'positive', className: 'mr-2', onClick: handleClickSave },
                { text: '취소', variant: 'negative', className: 'mr-2', onClick: handleClickCancel },
                { text: '삭제', variant: 'negative', onClick: handleClickDelete },
            ]);
        } else {
            setBtns([
                { text: '저장', variant: 'positive', className: 'mr-2', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickCancel },
            ]);
        }
    }, [handleClickCancel, handleClickDelete, handleClickSave, seqNo]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    useEffect(() => {
        setTemp(internalApi);
        setError({});
        if (internalApi.paramDesc) {
            const params = JSON.parse(internalApi.paramDesc);
            setParamList(Object.values(params));
        } else {
            resetParamDesc();
        }
    }, [internalApi]);

    useEffect(() => {
        return () => {
            dispatch(clearInternalApi());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard title={seqNo ? 'API 정보 수정' : 'API 정보 등록'} loading={loading} className="flex-fill" footerClassName="justify-content-center" footer footerButtons={btns}>
            <Form>
                {/* 사용 여부 */}
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="사용여부"
                            as="switch"
                            name="usedYn"
                            id="apis-used-yn"
                            inputProps={{ custom: true, checked: temp.usedYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>

                {/* API 명 */}
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="API명" name="apiName" value={temp.apiName} onChange={handleChangeValue} isInvalid={error.apiName} required />
                    </Col>
                </Form.Row>

                {/* API 경로 */}
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="API 경로" name="apiPath" value={temp.apiPath} onChange={handleChangeValue} isInvalid={error.apiPath} required />
                    </Col>
                </Form.Row>

                {/* API 메소드 */}
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel label="HTTP메소드" as="select" name="apiMethod" value={temp.apiMethod} onChange={handleChangeValue}>
                            {initialState.apiMethodList
                                .filter((a) => a.id !== 'all')
                                .map((method) => (
                                    <option key={method.id} value={method.id}>
                                        {method.name}
                                    </option>
                                ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>

                {/* API 타입 */}
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel label="API타입" as="select" name="apiType" value={temp.apiType || 'PC'} onChange={handleChangeValue}>
                            {/* PC:PC,MO:MOBILE,PM:PC+MOBILE,BO:BACK OFFICE */}
                            <option value="PC">PC</option>
                            <option value="MO">MO</option>
                            <option value="PM">PM</option>
                            <option value="BO">BO</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>

                {/* API 설명 */}
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="API 설명"
                            as="textarea"
                            inputClassName="resize-none"
                            name="apiDesc"
                            inputProps={{ rows: 6 }}
                            value={temp.apiDesc}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>

                {/* 파라미터 */}
                {paramList.map((data, idx) => (
                    <ParamDesc
                        key={idx}
                        className="mb-2"
                        onChange={handleChangeValueParamDesc}
                        onDelete={handleClickDeleteParam}
                        onAdd={handleClickAddParam}
                        validateParamName={validateParamName}
                        index={idx}
                        isInvalid={error[`param-${idx}`]}
                        invalidMessage={error[`param-${idx}Message`]}
                        {...data}
                    />
                ))}
            </Form>
        </MokaCard>
    );
};

export default InternalApiEdit;
