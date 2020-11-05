import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { MokaCardEditor } from '@components';
import { changeLatestDomainId } from '@store/auth/authAction';
import { GET_CONTAINER, DELETE_CONTAINER, SAVE_CONTAINER, changeContainerBody, getContainer, clearContainer } from '@store/container';

const ContainerEditor = (props) => {
    const { expansion, onExpansion } = props;
    const { containerSeq } = useParams();
    const dispatch = useDispatch();
    const { containerBody, container, invalidList, latestDomainId, loading } = useSelector((store) => ({
        containerBody: store.container.containerBody,
        container: store.container.container,
        invalidList: store.container.invalidList,
        latestDomainId: store.auth.latestDomainId,
        loading: store.loading[GET_CONTAINER] || store.loading[DELETE_CONTAINER] || store.loading[SAVE_CONTAINER],
    }));

    // state
    const [title, setTitle] = useState('컨테이너 편집');
    const [defaultValue, setDefaultValue] = useState('');
    const [error, setError] = useState({});

    /**
     * onBlur
     * @param {string} value 에디터 내용
     */
    const handleBlur = (value) => {
        dispatch(changeContainerBody(value));
    };

    useEffect(() => {
        // 타이틀 변경
        if (container.containerSeq) {
            setTitle(`${container.containerSeq}_${container.containerName}`);
            // defaultValue 변경
            setDefaultValue(containerBody);
        } else {
            setTitle('컨테이너 편집');
            setDefaultValue('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [container.containerSeq]);

    useEffect(() => {
        // 컨테이너의 도메인ID를 latestDomainId에 저장
        if (Object.prototype.hasOwnProperty.call(container, 'domain')) {
            const domainId = container.domain.domainId;
            if (latestDomainId !== domainId) {
                dispatch(changeLatestDomainId(domainId));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, container]);

    useEffect(() => {
        // 컨테이너seq가 있을 때 데이터를 조회
        if (containerSeq) {
            dispatch(getContainer({ containerSeq: containerSeq }));
        } else {
            dispatch(clearContainer());
        }
    }, [dispatch, containerSeq]);

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
        <MokaCardEditor
            className="mr-gutter flex-fill"
            error={error}
            title={title}
            expansion={expansion}
            onExpansion={onExpansion}
            defaultValue={defaultValue}
            value={containerBody}
            onBlur={handleBlur}
            loading={loading}
        />
    );
};

export default ContainerEditor;
