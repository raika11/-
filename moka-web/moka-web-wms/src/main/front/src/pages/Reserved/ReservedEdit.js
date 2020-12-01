import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import toast, { messageBox } from '@utils/toastUtil';
import { MokaInputLabel } from '@components';
import { deleteReserved, getReserved, duplicateCheck, clearReserved, changeReserved, changeInvalidList, saveReserved } from '@store/reserved';

/**
 * 예약어 정보 컴포넌트
 */
const ReservedEdit = () => {
    const { reservedSeq: paramSeq } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestDomainId, reserved, invalidList } = useSelector((store) => ({
        reserved: store.reserved.reserved,
        latestDomainId: store.auth.latestDomainId,
        invalidList: store.reserved.invalidList,
    }));

    // state
    const [reservedId, setReservedId] = useState('');
    const [reservedSeq, setReservedSeq] = useState('');
    const [reservedValue, setReservedValue] = useState('');
    const [usedYn, setUsedYn] = useState('N');
    const [description, setdescription] = useState('');

    // error
    const [reservedIdError, setReservedIdError] = useState(false);
    const [reservedValueError, setReservedValueError] = useState(false);

    useEffect(() => {
        if (paramSeq) {
            dispatch(getReserved(paramSeq));
        } else {
            dispatch(clearReserved());
        }
    }, [dispatch, paramSeq]);

    /**
     * 예약어 데이터 셋팅
     */
    useEffect(() => {
        setReservedId(reserved.reservedId || '');
        setReservedSeq(reserved.reservedSeq || '');
        setReservedValue(reserved.reservedValue || '');
        setdescription(reserved.description || '');
        setUsedYn(reserved.usedYn || 'N');
    }, [reserved]);

    /**
     * input change
     */
    const handleChangeValue = ({ target }) => {
        const { name, value, checked } = target;
        if (name === 'usedYn') {
            const useVal = checked ? 'Y' : 'N';
            setUsedYn(useVal);
        } else if (name === 'reservedId') {
            setReservedId(value);
            setReservedIdError(false);
        } else if (name === 'reservedValue') {
            setReservedValue(value);
            setReservedValueError(false);
        } else if (name === 'description') {
            setdescription(value);
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
        if (!/^[a-zA-z]([A-Za-z0-9_-`/])+$/g.test(reserved.reservedId)) {
            errList.push({
                field: 'reservedId',
                reason: '예약어를 확인해주세요',
            });
            isInvalid = isInvalid | true;
        }
        if (!/[^\s\t\n]+/g.test(reserved.reservedValue)) {
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
                        history.push(`/reserved/${body.reservedSeq}`);
                    } else {
                        toast.warning(header.message);
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
                        // 중복 없음
                        if (!body) {
                            saveCallback(tmp, 'insert');
                        }
                        // 중복 있음
                        else {
                            toast.warning(header.message);
                        }
                    } else {
                        toast.warning(header.message);
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
        if (reservedSeq) {
            newReserved = {
                ...reserved,
                domainId: reserved.domain.domainId,
                reservedId,
                reservedValue,
                description,
                usedYn,
            };
        } else {
            newReserved = {
                domainId: latestDomainId,
                reservedId,
                reservedValue,
                description,
                usedYn,
            };
        }
        if (newReserved.usedYn === 'Y') {
            newReserved.usedYn = 'Y';
        } else {
            newReserved.usedYn = 'N';
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
     * 삭제 버튼
     */
    const handleClickDelete = () => {
        messageBox.confirm(
            `${reservedId}를 삭제하시겠습니까?`,
            () => {
                const reservedSet = {
                    domainId: latestDomainId,
                    reservedSeq: reservedSeq,
                };
                dispatch(deleteReserved({ callback: () => history.push('/reserved'), reservedSet }));
            },
            () => {},
        );
    };

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'reservedId') {
                    setReservedIdError(true);
                }
                if (i.field === 'reservedValue') {
                    setReservedValueError(true);
                }
            });
        }
    }, [invalidList]);

    return (
        <Form>
            {/* 사용여부 */}
            <Form.Group className="d-flex mb-2 justify-content-between align-content-center">
                <MokaInputLabel
                    label="사용여부"
                    labelWidth={80}
                    as="switch"
                    className="mb-0"
                    id="usedYn"
                    name="usedYn"
                    inputProps={{ label: '', checked: usedYn === 'Y' }}
                    onChange={handleChangeValue}
                />
                {/* 버튼 그룹 */}
                <Form.Group className="mb-0 d-flex align-items-center">
                    <Button variant="positive" className="mr-05" onClick={handleClickSave}>
                        저장
                    </Button>
                    <Button variant="negative" onClick={handleClickDelete}>
                        삭제
                    </Button>
                </Form.Group>
            </Form.Group>
            {/* 예약어 */}
            <Form.Row>
                <Col xs={7} className="p-0">
                    <MokaInputLabel
                        label="예약어"
                        labelWidth={80}
                        className="mb-2"
                        placeholder="예약어를 입력하세요"
                        name="reservedId"
                        inputProps={{ plaintext: paramSeq && true, readOnly: paramSeq && true }}
                        onChange={handleChangeValue}
                        isInvalid={reservedIdError}
                        required
                        value={reservedId}
                    />
                </Col>
            </Form.Row>
            {/* 값 */}
            <Form.Row>
                <Col xs={7} className="p-0">
                    <MokaInputLabel
                        label="값"
                        labelWidth={80}
                        className="mb-2"
                        placeholder="값을 입력하세요"
                        name="reservedValue"
                        onChange={handleChangeValue}
                        isInvalid={reservedValueError}
                        required
                        value={reservedValue}
                    />
                </Col>
            </Form.Row>
            {/* 예약어 설명 */}
            <MokaInputLabel
                label="예약어 설명"
                labelWidth={80}
                className="mb-0"
                placeholder="설명을 입력하세요"
                name="description"
                onChange={handleChangeValue}
                value={description}
            />
        </Form>
    );
};

export default ReservedEdit;
