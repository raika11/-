import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInputLabel, MokaInputGroup, MokaCopyTextButton } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { invalidListToError } from '@utils/convertUtil';
import { GET_CONTAINER, DELETE_CONTAINER, SAVE_CONTAINER, changeInvalidList, saveContainer, changeContainer, hasRelationList } from '@store/container';

/**
 * 컨테이너 정보/수정 컴포넌트
 */
const ContainerEdit = ({ onDelete, match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector((store) => store.loading[GET_CONTAINER] || store.loading[DELETE_CONTAINER] || store.loading[SAVE_CONTAINER]);
    const latestDomainId = useSelector((store) => store.auth.latestDomainId);
    const { container, inputTag, invalidList } = useSelector((store) => ({
        container: store.container.container,
        inputTag: store.container.inputTag,
        invalidList: store.container.invalidList,
    }));

    // state
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [containerSeq, setContainerSeq] = useState('');
    const [containerName, setContainerName] = useState('');
    const [error, setError] = useState({});

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
            if (REQUIRED_REGEX.test(value)) {
                setError({ ...error, [name]: false });
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
        if (!REQUIRED_REGEX.test(container.containerName)) {
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
        setError(invalidListToError(invalidList));
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
                        toast.success(header.message);
                        history.push(`${match.path}/${body.containerSeq}`);
                    } else {
                        if (body?.list) {
                            const bodyChk = body.list.filter((e) => e.field === 'containerBody');
                            if (bodyChk.length > 0) {
                                messageBox.alert('Tems 문법 사용이 비정상적으로 사용되었습니다\n수정 확인후 다시 저장해 주세요', () => {});
                                return;
                            }
                        }
                        toast.fail(header.message);
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
                submitContainer(data);
            } else {
                checkRelationList(data);
            }
        }
    };

    /**
     * 관련아이템 체크
     * @param {object} container container
     */
    const checkRelationList = (container) => {
        const { containerSeq } = container;

        dispatch(
            hasRelationList({
                containerSeq,
                callback: ({ header, body }) => {
                    if (header.success) {
                        // 관련 아이템 없음
                        if (!body) submitContainer(container);
                        // 관련 아이템 있음
                        else {
                            messageBox.confirm(
                                '다른 곳에서 사용 중입니다.\n변경 시 전체 수정 반영됩니다.\n수정하시겠습니까?',
                                () => submitContainer(container),
                                () => {},
                            );
                        }
                    } else {
                        toast.error(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 삭제 버튼
     */
    const handleClickDelete = () => {
        onDelete(container);
    };

    /**
     * 취소버튼
     */
    const handleClickCancle = () => {
        history.push(match.path);
    };

    useEffect(() => {
        container.containerSeq ? setBtnDisabled(false) : setBtnDisabled(true);
        setError({});
    }, [container.containerSeq]);

    return (
        <MokaCard titleClassName="h-100 mb-0" title={`컨테이너 ${container.containerSeq ? '수정' : '등록'}`} loading={loading}>
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3 d-flex justify-content-end">
                    <div className="d-flex">
                        <Button variant="positive" className="mr-1" onClick={handleClickSave}>
                            저장
                        </Button>
                        {container.containerSeq && (
                            <Button variant="negative" className="mr-1" disabled={btnDisabled} onClick={handleClickDelete}>
                                삭제
                            </Button>
                        )}
                        <Button variant="negative" onClick={handleClickCancle}>
                            취소
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
                    isInvalid={error.containerName}
                    required
                />
                {/* 입력태그 */}
                <MokaInputGroup
                    label="입력태그"
                    as="textarea"
                    value={inputTag}
                    inputClassName="resize-none"
                    inputProps={{ rows: 2 }}
                    className="mb-2"
                    disabled
                    append={<MokaCopyTextButton copyText={inputTag} />}
                />
            </Form>
        </MokaCard>
    );
};

export default ContainerEdit;
