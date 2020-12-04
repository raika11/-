import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInput } from '@components';
import { deskingPartList } from '@pages/Desking/deskingPartMapping';

/**
 * 편집파트 변경 모달
 */
const EditDeskingPartModal = (props) => {
    const { show, onHide, areaComp, onSave } = props;

    // state
    const [deskingPart, setDeskingPart] = useState({});

    /**
     * list -> 쉽게 파싱하기 위해서 object로 바꿈
     */
    const setDeskingPartObj = useCallback(() => {
        if (areaComp?.deskingPart) {
            let list = areaComp.deskingPart.split(',');
            setDeskingPart(
                list.reduce((all, dp) => {
                    const target = deskingPartList.find((d) => d.id === dp);
                    return target
                        ? {
                              ...all,
                              [target.id]: target,
                          }
                        : all;
                }, {}),
            );
        } else {
            setDeskingPart({});
        }
    }, [areaComp.deskingPart]);

    /**
     * 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { checked, id } = e.target;

        setDeskingPart(
            produce(deskingPart, (draft) => {
                if (checked) {
                    const nt = deskingPartList.find((d) => d.id === id);
                    draft[id] = nt;
                } else {
                    delete draft[id];
                }
            }),
        );
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        if (typeof onSave === 'function') {
            let sortList = Object.values(deskingPart).sort(function (a, b) {
                return a.index - b.index;
            });
            let idList = sortList.map((list) => list.id);
            onSave({ ...areaComp, deskingPart: idList.join(',') });
        }
        onHide();
    };

    /**
     * 취소
     */
    const handleClickCancle = () => {
        setDeskingPartObj();
        onHide();
    };

    useEffect(() => {
        setDeskingPartObj();
    }, [setDeskingPartObj]);

    return (
        <MokaModal
            show={show}
            size="md"
            width={450}
            onHide={onHide}
            title="편집파트 수정"
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickCancle },
            ]}
            footerClassName="d-flex align-items-center justify-content-center"
            draggable
            centered
        >
            <Form.Row className="flex-wrap">
                {deskingPartList.map((part, idx) => (
                    <Col
                        xs={6}
                        key={idx}
                        className={clsx('mb-2', 'py-0', {
                            'pl-0': idx % 2 === 0,
                            'pl-2': idx % 2 === 1,
                            'pr-0': idx % 2 === 1,
                            'pr-2': idx % 2 === 0,
                        })}
                    >
                        <MokaInput
                            as="checkbox"
                            name="deskingPart"
                            id={part.id}
                            onChange={handleChangeValue}
                            inputProps={{ label: part.title, custom: true, checked: deskingPart[part.id] ? true : false }}
                        />
                    </Col>
                ))}
            </Form.Row>
        </MokaModal>
    );
};

export default EditDeskingPartModal;
