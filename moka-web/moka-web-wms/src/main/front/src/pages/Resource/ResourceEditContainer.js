import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WmsEditor from '~/components/WmsEditor';
import { changeEdit } from '~/stores/template/templateStore';

const ResourceEditContainer = (props) => {
    const { toggleState, changeAllToggleState } = props;
    const { templateData, loading } = useSelector((store) => ({
        templateData: store.templateStore.detail,
        loading: store.lloadingStore['templateStore/GET_TEMPLATE']
    }));
    const dispatch = useDispatch();
    const [defaultValue, setDefaultValue] = useState('');
    const [expansion, setExpansion] = useState(false);
    const [title, setTitle] = useState('리소스 편집');

    // 리소스 셋팅
    useEffect(() => {
        let seq = templateData.templateSeq || '';
        let name = templateData.templateName || '';
        if (seq !== '' && name !== '') {
            setTitle(`리소스 편집 (${seq}_${name})`);
        } else {
            setTitle('리소스 편집');
        }
    }, [templateData]);

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
        dispatch(
            changeEdit({
                key: 'templateBody',
                value
            })
        );
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
        setDefaultValue(templateData.templateBody);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateData.templateSeq]);

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
                />
            )}
        </>
    );
};

export default ResourceEditContainer;
