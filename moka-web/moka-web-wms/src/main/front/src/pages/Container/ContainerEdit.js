import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaInputLabel } from '@components';
import { notification } from '@utils/toastUtil';
import { GET_CONTAINER, DELETE_CONTAINER, SAVE_CONTAINER, changeInvalidList, saveContainer, changeContainer } from '@store/container';

/**
 * 컨테이너 정보/수정 컴포넌트
 */
const ContainerEdit = ({ onDelete }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { container, invalidList, latestDomainId, loading } = useSelector((store) => ({
        container: store.container.container,
        invalidList: store.container.invalidList,
        latestDomainId: store.auth.latestDomainId,
        loading: store.loading[GET_CONTAINER] || store.loading[DELETE_CONTAINER] || store.loading[SAVE_CONTAINER],
    }));

    // state
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [containerSeq, setContainerSeq] = useState('');
    const [containerName, setContainerName] = useState('');

    // error
    const [containerNameError, setContainerNameError] = useState(false);

    useEffect(() => {
        // 컨테이너 데이터 셋팅
        setContainerSeq(container.containerSeq || '');
        setContainerName(container.containerName || '');
    }, [container]);

    /**
     * 항목별 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        if (name === 'containerName') {
            setContainerName(value);
            const regex = /[^\s\t\n]+/;
            if (regex.test(value)) {
                setContainerNameError(false);
            }
        }
    };

    /**
     * 유효성 검사
     * @param {object} container 컨테이너 데이터
     */
    const validate = (container) => {
        let isInvalid = false;
        let errList = [];

        // 컨테이너명 체크
        if (!/[^\s\t\n]+/.test(container.containerName)) {
            errList.push({
                field: 'containerName',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'containerName') {
                    setContainerNameError(true);
                }
            });
        }
    }, [invalidList]);

    /**
     * 컨테이너 등록
     * @param {object} container 컨테이너
     */
    const submitContainer = (container) => {
        dispatch(
            saveContainer({
                actions: [changeContainer(container)],
                callback: ({ header, body }) => {
                    if (header.success) {
                        notification('success', header.message);
                        history.push(`/container/${body.containerSeq}`);
                    } else {
                        notification('waring', header.message);
                    }
                },
            }),
        );
    };

    /**
     * 저장 이벤트
     */
    const handleClickSave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let data = {
            ...container,
            containerName,
        };

        if (validate(data)) {
            if (!container.containerSeq || container.containerSeq === '') {
                // 새 컨테이너 저장 시에 도메인ID 셋팅
                data.domain = { domainId: latestDomainId };
            }
        }
        submitContainer(data);
    };

    /**
     * 삭제 버튼
     */
    const handleClickDelete = () => {
        onDelete(container);
    };

    useEffect(() => {
        if (container.containerSeq) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
        setContainerNameError(false);
    }, [container.containerSeq]);

    return (
        <MokaCard titleClassName="h-100 mb-0" title="컨테이너 정보" loading={loading}>
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3 d-flex justify-content-end">
                    <div className="d-flex">
                        <Button variant="primary" className="mr-05" onClick={handleClickSave}>
                            저장
                        </Button>
                        <Button variant="danger" disabled={btnDisabled} onClick={handleClickDelete}>
                            삭제
                        </Button>
                    </div>
                </Form.Group>
                {/* 컨테이너ID */}
                <MokaInputLabel className="mb-2" label="컨테이너ID" name="containerSeq" value={containerSeq} inputProps={{ plaintext: true, readOnly: true }} />
                {/* 컨테이너명 */}
                <MokaInputLabel
                    className="mb-2"
                    label="컨테이너명"
                    name="containerName"
                    placeholder="컨테이너명을 입력하세요"
                    value={containerName}
                    onChange={handleChangeValue}
                    isInvalid={containerNameError}
                    required
                />
            </Form>
        </MokaCard>
    );
};

export default ContainerEdit;
