import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaInputLabel, MokaIcon } from '@components';
import { saveComponentList } from '@store/component/componentAction';

/**
 * 컴포넌트 생성 Modal
 */
const AddComponentModal = (props) => {
    const { show, onHide } = props;
    const dispatch = useDispatch();
    const [componentList, setComponentList] = useState([]);

    const { template } = useSelector((store) => ({
        template: store.template.template,
    }));

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
                    isInvalid: false,
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
        let invalidCnt = 0;

        setComponentList(
            componentList.map((component) => {
                if (component.componentName.length < 1) {
                    invalidCnt++;
                    return {
                        ...component,
                        isInvalid: true,
                    };
                }
                return {
                    ...component,
                    isInvalid: false,
                };
            }),
        );

        if (invalidCnt < 1) {
            dispatch(
                saveComponentList({
                    componentList,
                    callback: () => {
                        handleHide();
                    },
                }),
            );
        }
    }, [componentList, dispatch, handleHide]);

    /**
     * 컴포넌트 추가
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
                    isInvalid: false,
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
                draft[idx].componentName = e.target.value;
            }),
        );
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
                { text: '저장', variant: 'primary', onClick: handleSave },
                { text: '취소', variant: 'gray150', onClick: handleHide },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                {componentList.map((component, idx) => (
                    <Form.Row className="mb-2" key={idx}>
                        <Col xs={11} className="p-0">
                            <MokaInputLabel
                                label="컴포넌트명"
                                labelWidth={90}
                                className="mb-0"
                                value={component.componentName}
                                onChange={(e) => handleComponentList(e, idx)}
                                isInvalid={component.isInvalid}
                            />
                        </Col>
                        <Col xs={1} className="p-0 pl-2">
                            {idx === 0 ? (
                                <Button variant="gray150" onClick={addComponent}>
                                    <MokaIcon iconName="fal-plus" />
                                </Button>
                            ) : (
                                <Button variant="gray150" onClick={(e) => removeComponent(e, idx)}>
                                    <MokaIcon iconName="fal-minus" />
                                </Button>
                            )}
                        </Col>
                    </Form.Row>
                ))}
            </Form>
        </MokaModal>
    );
};

export default AddComponentModal;
