import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import Button from 'react-bootstrap/Button';
import toast from '@utils/toastUtil';
import { DATA_TYPE_NONE, DATA_TYPE_DESK, DATA_TYPE_AUTO } from '@/constants';
import { MokaModal, MokaInputLabel, MokaIcon } from '@components';
import { saveComponentList, SAVE_COMPONENT_LIST } from '@store/component';
import DetailDatasetForm from '@pages/Component/components/DetailDatasetForm';

/**
 * 컴포넌트 생성 Modal
 */
const AddComponentModal = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[SAVE_COMPONENT_LIST]);
    const template = useSelector(({ template }) => template.template);
    const [componentList, setComponentList] = useState([]);
    const [error, setError] = useState({});

    /**
     * 컴포넌트 리스트 초기화
     */
    const resetComponentList = useCallback(() => {
        if (template.templateSeq) {
            setComponentList([
                {
                    domainId: template.domain.domainId,
                    templateSeq: template.templateSeq,
                    componentName: `${template.templateName}_컴포넌트`,
                    dataType: DATA_TYPE_NONE,
                    viewYn: 'N',
                },
            ]);
        }
    }, [template]);

    /**
     * 닫기
     */
    const handleHide = useCallback(() => {
        onHide();
        resetComponentList();
    }, [onHide, resetComponentList]);

    /**
     * 저장
     */
    const handleSave = useCallback(() => {
        let newError = {};

        const newComponentList = componentList.map((comp, idx) => {
            let invalidCnt = 0,
                ne = {};
            if (comp.componentName.length < 1) {
                invalidCnt++;
                ne.componentName = true;
            }
            if (comp.dataType === DATA_TYPE_AUTO && !comp?.dataset?.datasetSeq) {
                invalidCnt++;
                ne.dataset = true;
            }
            if (invalidCnt > 0) newError[idx] = ne;
            return {
                ...comp,
                viewYn: comp.dataType !== DATA_TYPE_DESK ? 'Y' : comp.viewYn,
            };
        });
        setError(newError);

        if (Object.keys(newError).length < 1) {
            dispatch(
                saveComponentList({
                    componentList: newComponentList,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                            handleHide();
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        }
    }, [componentList, dispatch, handleHide]);

    /**
     * 컴포넌트 등록
     */
    const addComponent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setComponentList(
            produce(componentList, (draft) => {
                draft.push({
                    domainId: template.domain.domainId,
                    templateSeq: template.templateSeq,
                    componentName: `${template.templateName}_컴포넌트`,
                    dataType: DATA_TYPE_NONE,
                    viewYn: 'N',
                });
            }),
        );
    };

    /**
     * 컴포넌트 제거
     * @param {object} e 이벤트
     * @param {number} idx 제거할 컴포넌트의 순서
     */
    const removeComponent = (e, idx) => {
        e.preventDefault();
        e.stopPropagation();
        setComponentList(
            produce(componentList, (draft) => {
                draft.splice(idx, 1);
            }),
        );
    };

    /**
     * 컴포넌트리스트의 값 변경
     * @param {object} e 이벤트
     * @param {number} idx 인덱스
     */
    const handleComponentList = (e, idx) => {
        e.preventDefault();
        e.stopPropagation();
        setComponentList(
            produce(componentList, (draft) => {
                draft[idx][e.target.name] = e.target.value;
            }),
        );
        if (error[idx]?.[e.target.name]) {
            setError(
                produce(error, (draft) => {
                    draft[idx][e.target.name] = false;
                }),
            );
        }
    };

    useEffect(() => {
        resetComponentList();
    }, [resetComponentList]);

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleHide}
            title="컴포넌트 생성"
            size="md"
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleSave },
                { text: '취소', variant: 'negative', onClick: handleHide },
            ]}
            id="add-component"
            centered
            draggable
            loading={loading}
        >
            {componentList.map((component, idx) => (
                <React.Fragment key={idx}>
                    <div className="mb-2 d-flex">
                        <MokaInputLabel
                            label="컴포넌트명"
                            name="componentName"
                            value={component.componentName}
                            onChange={(e) => handleComponentList(e, idx)}
                            isInvalid={error?.[idx]?.componentName}
                            className="flex-fill mr-2"
                        />
                        <div className="flex-shrink-0">
                            {idx === 0 ? (
                                <Button variant="outline-neutral" onClick={addComponent}>
                                    <MokaIcon iconName="fal-plus" />
                                </Button>
                            ) : (
                                <Button variant="outline-negative" onClick={(e) => removeComponent(e, idx)}>
                                    <MokaIcon iconName="fal-minus" />
                                </Button>
                            )}
                        </div>
                    </div>
                    <DetailDatasetForm
                        addMode
                        id={idx}
                        component={component}
                        setComponent={(newData) => {
                            setComponentList(
                                produce(componentList, (draft) => {
                                    draft[idx] = newData;
                                    if (newData.dataType !== DATA_TYPE_AUTO) draft[idx].dataset = null;
                                }),
                            );
                        }}
                        error={error?.[idx]}
                        setError={(newError) => {
                            setError({
                                ...error,
                                [idx]: newError,
                            });
                        }}
                    />

                    {componentList.length - 1 !== idx && <hr />}
                </React.Fragment>
            ))}
        </MokaModal>
    );
};

export default AddComponentModal;
