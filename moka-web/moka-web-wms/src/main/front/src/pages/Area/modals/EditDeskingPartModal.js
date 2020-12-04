import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInput } from '@components';
import { deskingPartList, fontSizeList } from '@pages/Desking/deskingPartMapping';

/**
 * 편집파트 변경 모달
 */
const EditDeskingPartModal = (props) => {
    const { show, onHide, areaComp, onSave } = props;

    // 체크된 데이터를 저장하는 state
    const [deskingPart, setDeskingPart] = useState({});
    const [fontSize, setFontSize] = useState({});

    /**
     * DB의 deskingPart 문자열을 리스트로 파싱하고,
     * 체크 표시를 하기 위해 object로 바꿈
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
            setFontSize(
                list.reduce((all, dp) => {
                    const target = fontSizeList.find((d) => d.id === dp);
                    return target ? target : all;
                }, {}),
            );
        } else {
            setDeskingPart({});
            setFontSize({});
        }
    }, [areaComp.deskingPart]);

    /**
     * 데스킹폼 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { checked, id, name } = e.target;

        if (name === 'deskingPart') {
            const nt = deskingPartList.find((d) => d.id === id);
            setDeskingPart(
                produce(deskingPart, (draft) => {
                    checked ? (draft[id] = nt) : delete draft[id];
                }),
            );
        } else if (name === 'fontSize') {
            if (fontSize.id === id) {
                setFontSize({});
            } else {
                setFontSize(fontSizeList.find((d) => d.id === id));
            }
        }
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
            let dp = idList.join(',');
            // 폰트사이즈는 별도로 붙여줌
            if (fontSize?.id) dp = dp + `,${fontSize.id}`;
            onSave({ ...areaComp, deskingPart: dp });
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

            {/* 제목의 폰트 사이즈 설정 */}
            {deskingPart.TITLE && (
                <React.Fragment>
                    <hr className="divider" />
                    <p className="h5 mb-3">제목 폰트 사이즈</p>
                    <Form.Row className="flex-wrap">
                        {fontSizeList.map((part, idx) => (
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
                                    name="fontSize"
                                    id={part.id}
                                    onChange={handleChangeValue}
                                    inputProps={{ label: part.title, custom: true, checked: fontSize.id === part.id ? true : false }}
                                />
                            </Col>
                        ))}
                    </Form.Row>
                </React.Fragment>
            )}
        </MokaModal>
    );
};

export default EditDeskingPartModal;
