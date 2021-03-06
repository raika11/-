import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { API_BASE_URL, CONTAINER_GROUP } from '@/constants';
import util from '@utils/commonUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';
import { MokaCard, MokaInputLabel, MokaInputGroup, MokaCopyTextButton } from '@components';
import { initialState, GET_CONTAINER, DELETE_CONTAINER, SAVE_CONTAINER, changeInvalidList, saveContainer, changeContainer, hasRelationList } from '@store/container';

/**
 * 컨테이너 관리 > 등록, 수정
 */
const ContainerEdit = ({ onDelete, match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector(({ loading }) => loading[GET_CONTAINER] || loading[DELETE_CONTAINER] || loading[SAVE_CONTAINER]);
    const UPLOAD_PATH_URL = useSelector(({ app }) => app.UPLOAD_PATH_URL);
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const { container, inputTag, invalidList } = useSelector(({ container }) => container);
    const [temp, setTemp] = useState(initialState.container);
    const [thumbSrc, setThumbSrc] = useState(null);
    const [error, setError] = useState({});
    const imgFileRef = useRef(null);

    /**
     * 항목별 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;
        setTemp({ ...temp, [name]: value });
        if (error[name]) setError({ ...error, [name]: false });
    };

    /**
     * 유효성 검사
     * @param {object} container 컨테이너 데이터
     */
    const validate = (container) => {
        let isInvalid = false;
        let errList = [];

        // 컨테이너명 체크
        if (util.isEmpty(container.containerName)) {
            errList.push({
                field: 'containerName',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

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
                                messageBox.alert('Tems 문법 사용이 비정상적으로 사용되었습니다\n수정 후 다시 저장해 주세요', () => {});
                                return;
                            }
                        }
                        messageBox.alert(header.message);
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
        const data = temp;

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
    const handleClickDelete = () => onDelete(container);

    /**
     * 취소버튼
     */
    const handleClickCancle = () => history.push(match.path);

    useEffect(() => {
        setTemp(container);
        if (container.containerThumb && container.containerThumb !== '') {
            setThumbSrc(`${API_BASE_URL}${UPLOAD_PATH_URL}/${container.containerThumb}`);
        } else {
            setThumbSrc(null);
        }
        setError({});
    }, [UPLOAD_PATH_URL, container]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    return (
        <MokaCard
            titleClassName="h-100"
            title={`컨테이너 ${container.containerSeq ? '수정' : '등록'}`}
            loading={loading}
            titleButtons={[
                {
                    text: container.containerSeq ? '수정' : '저장',
                    variant: 'positive',
                    onClick: handleClickSave,
                    className: 'mr-1',
                },
                container.containerSeq && {
                    text: '삭제',
                    variant: 'negative',
                    onClick: handleClickDelete,
                    className: 'mr-1',
                },
                {
                    text: '취소',
                    variant: 'negative',
                    onClick: handleClickCancle,
                },
            ].filter(Boolean)}
        >
            <MokaInputLabel className="mb-2" label="컨테이너ID" name="containerSeq" value={temp.containerSeq} inputProps={{ plaintext: true, readOnly: true }} />

            <MokaInputLabel label="사용분류" className="mb-2" as="select" name="containerGroup" value={temp.containerGroup} onChange={handleChangeValue}>
                {CONTAINER_GROUP.map((grp) => (
                    <option key={grp.value} value={grp.value}>
                        {grp.name}
                    </option>
                ))}
            </MokaInputLabel>

            <MokaInputLabel
                className="mb-2"
                label="컨테이너명"
                name="containerName"
                placeholder="컨테이너명을 입력하세요"
                value={temp.containerName}
                onChange={handleChangeValue}
                isInvalid={error.containerName}
                required
            />

            {temp.containerGroup === CONTAINER_GROUP[0].value && (
                // 사용분류가 서비스페이지인 경우에만 입력태그 노출 (뉴스레터를 페이지에 등록하지 못하게)
                <MokaInputGroup
                    label="입력태그"
                    as="textarea"
                    value={inputTag}
                    inputProps={{ rows: 2 }}
                    className="mb-2"
                    disabled
                    append={<MokaCopyTextButton copyText={inputTag} />}
                />
            )}

            <MokaInputLabel label="설명" as="textarea" name="containerDesc" inputProps={{ rows: 3 }} className="mb-2" value={temp.containerDesc} onChange={handleChangeValue} />

            <MokaInputLabel
                ref={imgFileRef}
                label={
                    <React.Fragment>
                        이미지
                        <Button className="mt-1" size="sm" variant="gray-700" onClick={(e) => imgFileRef.current.openFileDialog(e)}>
                            신규등록
                        </Button>
                    </React.Fragment>
                }
                as="imageFile"
                inputProps={{
                    width: 284,
                    height: (284 * 9) / 16,
                    img: thumbSrc,
                    deleteButton: true,
                    setFileValue: (data) => {
                        setTemp({
                            ...temp,
                            thumbFile: data,
                            containerThumb: !data ? null : temp.containerThumb,
                        });
                    },
                }}
            />
        </MokaCard>
    );
};

export default ContainerEdit;
