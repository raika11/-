import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WmsEditor from '~/components/WmsEditor';
import { changeContainerBody } from '~/stores/container/containerStore';

const ContainerEditContainer = (props) => {
    const { toggleState, changeAllToggleState } = props;
    const { edit, error, loading, tag } = useSelector(({ containerStore, loadingStore }) => ({
        edit: containerStore.container,
        error: containerStore.containerError,
        loading: loadingStore['containerStore/GET_CONTAINER'],
        tag: containerStore.tag
    }));
    const dispatch = useDispatch();
    const [defaultValue, setDefaultValue] = useState('');
    const [expansion, setExpansion] = useState(false);
    const [title, setTitle] = useState('컨테이너 편집');
    const [errorObj, setErrorObj] = useState({});

    // 컨테이너 셋팅
    useEffect(() => {
        let seq = edit.containerSeq || '';
        let name = edit.containerName || '';
        if (seq !== '' && name !== '') {
            setTitle(`컨테이너 편집 (${seq}_${name})`);
        } else {
            setTitle('컨테이너 편집');
        }
    }, [edit]);

    useEffect(() => {
        let bodyError = 0;
        if (error && Array.isArray(error.body.list)) {
            error.body.list.forEach((e) => {
                const { field, reason, extra } = e;
                if (field === 'containerBody') {
                    setErrorObj({
                        error: true,
                        message: reason,
                        line: Number(extra)
                    });
                    bodyError++;
                }
            });
        }
        if (bodyError < 1) setErrorObj({});
    }, [error]);

    /**
     * 에디터 확장 콜백 함수
     * @param {boolean} ex 확장 여부
     */
    const onExpansion = (ex) => {
        if (ex) {
            changeAllToggleState([false, true, false]);
            setExpansion(true);
        } else {
            changeAllToggleState([true, true, true]);
            setExpansion(false);
        }
    };

    /**
     * 에디터 내용 변경
     * @param {string} value 변경값
     */
    const onBlur = (value) => {
        dispatch(changeContainerBody(value));
    };

    /**
     * width값에 따라 카드헤더의 확장 마크를 변경한다
     */
    useEffect(() => {
        if (toggleState && !toggleState[0] && !toggleState[2]) {
            setExpansion(true);
        } else {
            setExpansion(false);
        }
    }, [toggleState, expansion]);

    useEffect(() => {
        setDefaultValue(edit.containerBody);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit.containerSeq, edit.containerBody]);

    return (
        <>
            {toggleState && (
                <WmsEditor
                    title={title}
                    language="html"
                    expansion={expansion}
                    onExpansion={onExpansion}
                    onBlur={onBlur}
                    loading={loading}
                    value={defaultValue}
                    tag={tag}
                    error={errorObj.error}
                    errorline={errorObj.line}
                    errorMessage={errorObj.message}
                />
            )}
        </>
    );
};

export default ContainerEditContainer;
