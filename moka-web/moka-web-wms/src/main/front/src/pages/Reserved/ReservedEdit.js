import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { getReservedList, putReserved, deleteReserved, getReserved, clearReserved } from '@store/reserved';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import { MokaInputLabel } from '@components';

/**
 * 예약어 정보 컴포넌트
 */
const ReservedEdit = () => {
    let history = useHistory();
    const { reservedSeq: paramSeq } = useParams();
    const dispatch = useDispatch();
    const [reservedId, setReservedId] = useState('');
    const [reservedSeq, setReservedSeq] = useState('');
    const [reservedValue, setReservedValue] = useState('');
    const [useYn, setUseYn] = useState('Y');
    const [description, setdescription] = useState('');
    const [paramState, setParamState] = useState(false);
    const { latestDomainId, reserved } = useSelector((store) => ({
        reserved: store.reserved.reserved,
        latestDomainId: store.auth.latestDomainId,
    }));

    /**
     * onChange e
     */
    const handleChange = ({ target }) => {
        const { name, value, checked } = target;
        if (name === 'useYn') {
            const usedVal = checked ? 'Y' : 'N';
            setUseYn(usedVal);
        } else if (name === 'reservedId') {
            setReservedId(value);
        } else if (name === 'reservedValue') {
            setReservedValue(value);
        } else if (name === 'description') {
            setdescription(value);
        }
    };

    /**
     * 예약어 데이터 null 일 때 설정
     */
    useEffect(() => {
        setReservedId(reserved === null ? '' : reserved.reservedId);
        setReservedSeq(reserved === null ? '' : reserved.reservedSeq);
        setReservedValue(reserved === null ? '' : reserved.reservedValue);
        setdescription(reserved === null ? '' : reserved.description === undefined ? '' : reserved.description);
        setUseYn(reserved === null ? false : reserved.useYn === 'Y' && true);
    }, [reserved]);

    const handleSaveClick = (e) => {
        let newReserved = '';
        if (reservedSeq) {
            newReserved = {
                ...reserved,
                domainId: reserved.domain.domainId,
                reservedId,
                reservedValue,
                description,
                useYn,
            };
        } else {
            newReserved = {
                domainId: latestDomainId,
                reservedId,
                reservedValue,
                description,
                useYn,
            };
        }
        if (newReserved.useYn === 'Y') {
            newReserved.useYn = 'Y';
        } else {
            newReserved.useYn = 'N';
        }
        dispatch(putReserved({ callback: () => history.push('/reserved') }));
    };

    const handleDeleteClick = (e) => {
        const reservedSet = {
            domainId: latestDomainId,
            seq: reservedSeq,
        };
        toastr.confirm('삭제하시겠습니까?', {
            onOk: () => {
                if (reserved.reservedId) {
                    dispatch(deleteReserved({ callback: () => history.push('/reserved'), reservedSet }));
                } else {
                    console.log('삭제할 수 없습니다.');
                }
            },
            onCancel: () => {},
        });
    };

    /**
     * seq 있는데 데이터가 없으면 조회
     */
    useEffect(() => {
        // 파라미터에 seq가 있는데 데이터가 없으면 조회
        let paramReservedSeq = Number(paramSeq);

        if (paramSeq && reservedSeq !== paramSeq && !paramState) {
            dispatch(getReserved(paramReservedSeq));
            setParamState(true);
        } else if (!paramSeq && reservedSeq) {
            dispatch(clearReserved({ reservedInfo: true }));
        }
    }, [dispatch, paramSeq, paramState, reservedSeq]);

    return (
        <Form>
            {/* 사용여부 */}
            <Form.Group className="d-flex mb-2 justify-content-between align-content-center">
                <MokaInputLabel label="사용여부" labelWidth={80} as="switch" className="mb-0" inputProps={{ id: 'useYn', label: '' }} name="useYn" onChange={handleChange} />
                {/* 버튼 그룹 */}
                <Form.Group className="mb-0 d-flex align-items-center">
                    <Button variant="dark" className="mr-05" onClick={handleSaveClick}>
                        저장
                    </Button>
                    <Button variant="secondary" onClick={handleDeleteClick}>
                        삭제
                    </Button>
                </Form.Group>
            </Form.Group>
            {/* 예약어 */}
            <Form.Row>
                <Col xs={7} className="p-0">
                    <MokaInputLabel label="예약어" labelWidth={80} className="mb-2" placeholder="예약어를 입력하세요" name="reservedId" onChange={handleChange} required />
                </Col>
            </Form.Row>
            {/* 값 */}
            <Form.Row>
                <Col xs={7} className="p-0">
                    <MokaInputLabel label="값" labelWidth={80} className="mb-2" placeholder="값을 입력하세요" name="reservedValue" onChange={handleChange} required />
                </Col>
            </Form.Row>
            {/* 예약어 설명 */}
            <MokaInputLabel label="예약어 설명" labelWidth={80} className="mb-0" placeholder="설명을 입력하세요" name="description" onChange={handleChange} />
        </Form>
    );
};

export default ReservedEdit;
