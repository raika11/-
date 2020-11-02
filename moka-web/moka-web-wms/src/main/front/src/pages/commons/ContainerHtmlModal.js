import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModalEditor } from '@components';
import { getContainer, changeContainerBody, saveContainer, clearContainer, GET_CONTAINER, SAVE_CONTAINER } from '@store/container';
import { notification } from '@utils/toastUtil';

/**
 * 컨테이너 TEMS 소스 수정 모달
 */
const ContainerHtmlModal = (props) => {
    const { show, onHide, containerSeq } = props;
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

    /**
     * 닫기
     */
    const handleHide = () => {
        setError({});
        dispatch(clearContainer());
        onHide();
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        dispatch(
            saveContainer({
                callback: ({ header }) => {
                    if (header.success) {
                        notification('success', header.message);
                    } else {
                        notification('warning', header.message);
                    }
                    handleHide();
                },
            }),
        );
    };

    /**
     * onBlur
     * @param {string} value 에디터 내용
     */
    const handleBlur = (value) => {
        dispatch(changeContainerBody(value));
    };

    useEffect(() => {
        if (containerSeq && show) {
            dispatch(
                getContainer({
                    containerSeq,
                }),
            );
        }
    }, [containerSeq, show, dispatch]);

    useEffect(() => {
        setDefalutValue(containerBody);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [container.containerSeq]);

    useEffect(() => {
        let isInvalid = false;

        // invalidList 처리
        if (invalidList.length > 0) {
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
    }, [invalidList]);

    return (
        <MokaModalEditor
            title={container.containerName || ''}
            show={show}
            onHide={handleHide}
            onBlur={handleBlur}
            defaultValue={defaultValue}
            buttons={[
                { text: '저장', variant: 'primary', onClick: handleClickSave },
                { text: '닫기', variant: 'gray150', onClick: handleHide },
            ]}
            error={error}
            loading={loading}
        />
    );
};

export default ContainerHtmlModal;
