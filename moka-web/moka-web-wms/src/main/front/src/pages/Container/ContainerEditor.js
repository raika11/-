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
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const loading = useSelector(({ loading }) => loading[GET_CONTAINER] || loading[DELETE_CONTAINER] || loading[SAVE_CONTAINER]);
    const { containerBody, container, invalidList, appendTag } = useSelector(({ container }) => ({
        containerBody: container.containerBody,
        container: container.container,
        invalidList: container.invalidList,
        appendTag: container.appendTag,
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
    }, [container.containerSeq, container.containerName]);

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
        // 본문 에러만 체크
        const bodyErrorList = invalidList.filter((e) => e.field === 'containerBody');
        if (bodyErrorList.length > 0) {
            setError({
                line: Number(bodyErrorList[0].extra),
                message: bodyErrorList[0].reason,
            });
        } else {
            setError({});
        }
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(clearContainer());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            tag={appendTag}
        />
    );
};

export default ContainerEditor;
