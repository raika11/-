import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { invalidListToError } from '@utils/convertUtil';
import { MokaInputLabel, MokaCard } from '@components';
import { initialState, getReserved, duplicateCheck, clearReserved, changeReserved, changeInvalidList, saveReserved } from '@store/reserved';

/**
 * 예약어 관리 > 등록, 수정
 */
const ReservedEdit = ({ match, onDelete, loading }) => {
    const { reservedSeq: paramSeq } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const { reserved, invalidList } = useSelector(({ reserved }) => reserved);
    const [temp, setTemp] = useState(initialState.reserved);
    const [error, setError] = useState({});

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'usedYn') {
            setTemp({ ...temp, [name]: checked ? 'Y' : 'N' });
        } else {
            setTemp({ ...temp, [name]: value });
        }

        if (error[name]) {
            setError({ ...error, [name]: false });
        }
    };

    /**
     * 예약어 validate 체크
     * @param {domain} 예약어 정보를 가진 객체
     * @returns {boolean} 유효성 검사 결과
     */
    const validate = (reserved) => {
        let isInvalid = false;
        let errList = [];

        // 예약어 아이디 체크
        if (!reserved.reservedId || !/^[a-zA-z]([A-Za-z0-9_-`/])+$/g.test(reserved.reservedId)) {
            errList.push({
                field: 'reservedId',
                reason: '예약어를 확인해주세요',
            });
            isInvalid = isInvalid | true;
        }
        if (!reserved.reservedValue || !REQUIRED_REGEX.test(reserved.reservedValue)) {
            errList.push({
                field: 'reservedValue',
                reason: '예약어 값을 확인해주세요',
            });
            isInvalid = isInvalid | true;
        }
        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 저장
     * @param {object} tmp reserved
     */
    const saveCallback = (tmp, type) => {
        dispatch(
            saveReserved({
                type,
                actions: [
                    changeReserved({
                        ...reserved,
                        ...tmp,
                    }),
                ],
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        history.push(`${match.path}/${body.reservedSeq}`);
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 중복 체크
     * @param {object} tmp 예약어
     */
    const checkDuplicated = (tmp) => {
        dispatch(
            duplicateCheck({
                duplicateSet: {
                    reservedId: tmp.reservedId,
                    domainId: tmp.domainId,
                },
                callback: ({ header, body }) => {
                    if (header.success) {
                        if (!body) {
                            // 중복 없음
                            saveCallback(tmp, 'insert');
                        } else {
                            // 중복 있음
                            messageBox.alert('중복된 예약어가 존재합니다.');
                        }
                    } else {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        let newReserved;
        if (temp.reservedSeq) {
            newReserved = {
                ...temp,
                domainId: reserved.domain.domainId,
            };
        } else {
            newReserved = {
                ...temp,
                domainId: latestDomainId,
            };
        }

        if (validate(newReserved)) {
            if (!paramSeq) {
                // 등록
                checkDuplicated(newReserved);
            } else {
                // 수정
                saveCallback(newReserved, 'update');
            }
        }
    };

    /**
     * 취소 버튼
     */
    const handleClickCancle = () => history.push(match.path);

    useEffect(() => {
        if (paramSeq) {
            dispatch(getReserved(paramSeq));
        } else {
            dispatch(clearReserved());
        }
        setError({});
    }, [dispatch, paramSeq]);

    useEffect(() => {
        setTemp(reserved);
    }, [reserved]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(clearReserved());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard className="w-100" title={`예약어 ${paramSeq ? '수정' : '등록'}`} loading={loading}>
            {/* 사용여부 */}
            <Form.Group className="d-flex mb-2 justify-content-between align-content-center">
                <MokaInputLabel
                    label="사용여부"
                    as="switch"
                    className="mb-0"
                    id="usedYn"
                    name="usedYn"
                    inputProps={{ label: '', checked: temp.usedYn === 'Y' }}
                    onChange={handleChangeValue}
                />
                {/* 버튼 그룹 */}
                <Form.Group className="mb-0 d-flex align-items-center">
                    <Button variant="positive" className="mr-1" onClick={handleClickSave}>
                        {reserved.reservedSeq ? '수정' : '저장'}
                    </Button>
                    {reserved.reservedSeq && (
                        <Button variant="negative" className="mr-1" onClick={() => onDelete(temp)}>
                            삭제
                        </Button>
                    )}
                    <Button variant="negative" onClick={handleClickCancle}>
                        취소
                    </Button>
                </Form.Group>
            </Form.Group>

            {/* 예약어 */}
            <Form.Row className="mb-2">
                <Col xs={7} className="p-0">
                    <MokaInputLabel
                        label="예약어"
                        placeholder="예약어를 입력하세요"
                        name="reservedId"
                        onChange={handleChangeValue}
                        isInvalid={error.reservedId}
                        required
                        disabled={paramSeq && true}
                        value={temp.reservedId}
                    />
                </Col>
            </Form.Row>

            {/* 값 */}
            <Form.Row className="mb-2">
                <Col xs={12} className="p-0">
                    <MokaInputLabel
                        label="값"
                        placeholder="값을 입력하세요"
                        name="reservedValue"
                        onChange={handleChangeValue}
                        isInvalid={error.reservedValue}
                        required
                        value={temp.reservedValue}
                    />
                </Col>
            </Form.Row>

            {/* 예약어 설명 */}
            <MokaInputLabel
                as="textarea"
                label="예약어 설명"
                placeholder="설명을 입력하세요"
                name="description"
                inputProps={{ rows: 5 }}
                onChange={handleChangeValue}
                value={temp.description}
            />
        </MokaCard>
    );
};

export default ReservedEdit;
