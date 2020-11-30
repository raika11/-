import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModalEditor } from '@components';
import { getContainerModal, getContainer, changeContainerBody, saveContainer, clearContainer, hasRelationList, GET_CONTAINER, SAVE_CONTAINER } from '@store/container';
import toast, { messageBox } from '@utils/toastUtil';

/**
 * 컨테이너 TEMS 소스 보여주는 모달
 * (수정 불가, local state만 사용)
 */
const ContainerHtmlModal = (props) => {
    const { show, onHide, containerSeq, containerSave = false } = props;
    const dispatch = useDispatch();

    const { container, containerBody, invalidList, loading } = useSelector((store) => ({
        container: store.container.container,
        containerBody: store.container.containerBody,
        invalidList: store.container.invalidList,
        loading: store.loading[GET_CONTAINER] || store.loading[SAVE_CONTAINER],
    }));

    // state
    const [defaultValue, setDefalutValue] = useState('');
    const [error, setError] = useState({});
    const [buttons, setButtons] = useState(null);
    const [containerModal, setContainerModal] = useState({});
    const [loadingModal, setLoadingModal] = useState(false);

    /**
     * 닫기
     */
    const handleHide = () => {
        if (containerSave) {
            setError({});
            dispatch(clearContainer());
        } else {
            setContainerModal({});
        }
        onHide();
    };

    /**
     * 컨테이너 저장
     */
    const submitContainer = () => {
        dispatch(
            saveContainer({
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success(header.message);
                        handleHide();
                    } else {
                        toast.warning(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 관련아이템 체크
     */
    const handleClickSave = () => {
        const options = {
            containerSeq,
            callback: ({ header, body }) => {
                if (header.success) {
                    // 관련 아이템 없음
                    if (!body) submitContainer();
                    // 관련 아이템 있음
                    else {
                        messageBox.confirm('다른 곳에서 사용 중입니다.\n변경 시 전체 수정 반영됩니다.\n수정하시겠습니까?', () => submitContainer());
                    }
                } else {
                    toast.warning(header.message);
                }
            },
        };
        dispatch(hasRelationList(options));
    };

    /**
     * onBlur
     * @param {string} value 에디터 내용
     */
    const handleBlur = (value) => {
        if (containerSave) {
            dispatch(changeContainerBody(value));
        }
    };

    useEffect(() => {
        if (containerSeq && show) {
            if (containerSave) {
                dispatch(
                    getContainer({
                        containerSeq: containerSeq,
                    }),
                );
                setButtons([
                    { text: '저장', variant: 'positive', onClick: handleClickSave },
                    { text: '닫기', variant: 'negative', onClick: handleHide },
                ]);
            } else {
                setLoadingModal(true);
                dispatch(
                    getContainerModal({
                        containerSeq,
                        callback: ({ header, body }) => {
                            if (header.success) {
                                setContainerModal(body);
                            } else {
                                toast.fail(header.message);
                            }
                            setLoadingModal(false);
                        },
                    }),
                );
                setButtons([{ text: '닫기', variant: 'negative', onClick: handleHide }]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerSeq, show, containerSave, dispatch]);

    useEffect(() => {
        if (containerSave) {
            setDefalutValue(containerBody);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [container.containerSeq, containerSave]);

    useEffect(() => {
        if (containerSave) {
            let isInvalid = false;

            // invalidList 처리
            if (Array.isArray(invalidList) && invalidList.length > 0) {
                invalidList.forEach((i) => {
                    if (i.field === 'containerBody') {
                        setError({
                            line: Number(i.extra),
                            message: i.reason,
                        });
                        isInvalid = isInvalid || true;
                    }
                });
            }

            if (!isInvalid) {
                setError({});
            }
        }
    }, [containerSave, invalidList]);

    return (
        <MokaModalEditor
            title={containerSave ? container.containerName || '' : containerModal.containerName || ''}
            show={show}
            onHide={handleHide}
            onBlur={handleBlur}
            defaultValue={containerSave ? defaultValue : containerModal.containerBody}
            value={containerSave ? containerBody : containerModal.containerBody}
            buttons={buttons}
            options={{ readOnly: !containerSave }}
            error={error}
            loading={containerSave ? loading : loadingModal}
        />
    );
};

export default ContainerHtmlModal;
