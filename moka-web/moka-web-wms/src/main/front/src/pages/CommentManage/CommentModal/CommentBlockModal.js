import React, { useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaInputLabel, MokaInput } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { useDispatch, useSelector } from 'react-redux';

import { saveBlocks, getCommentsBlocks } from '@store/commentManage';
import { BenneConfirmModal } from '@pages/CommentManage/CommentModal';
/**
 * ModalBody로 Input 한개 있는 Modal
 */
const CommentBlockModal = (props) => {
    const dispatch = useDispatch();
    const { show, onHide, ModalUsage, selectBannedItem } = props;
    const [editData, setEditData] = useState({
        BennedType: 'U',
        id: '',
        ip: '',
        word: '',
        tagDiv: '',
        tagDesc: '',
    });

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalUsage, setConfirmModalUsage] = useState({
        title: '',
        content: '',
    });

    const { tagDiv } = useSelector((store) => ({
        tagDiv: store.comment.common.tagDiv,
    }));

    /**
     * 닫기
     */
    const handleClickHide = () => {
        onHide();
    };

    /**
     * input 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value,
        });
    };

    // 차단 등록 처리
    const handleSaveBlocks = (formData) => {
        // formdata 출력( 테스트 )
        // for (let [key, value] of formData) {
        //     console.log(`${key}: ${value}`);
        // }
        // return;
        dispatch(
            saveBlocks({
                type: 'SAVE',
                seqNo: '',
                blockFormData: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        dispatch(getCommentsBlocks());
                        onHide(); // 모달창 닫기.
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    const ConfirmModalResult = (e) => {
        const { gubun, type } = e;

        if (gubun === 'comment' && type === 'save') {
            var formData = new FormData();
            formData.append('usedYn', 'Y');
            formData.append('tagType', editData.BennedType);
            if (editData.BennedType === 'I') {
                formData.append('tagValue', selectBannedItem[0].memIp);
            } else {
                formData.append('tagValue', selectBannedItem[0].memId);
            }
            formData.append('tagDiv', editData.tagDiv);
            formData.append('tagDesc', editData.tagDesc);
            handleSaveBlocks(formData);
        }
    };

    /**
     * 저장 버튼 클릭 이벤트
     */
    const handleClickSave = () => {
        // onSave(data);

        var formData = new FormData();
        formData.append('tagType', ModalUsage.usage);
        formData.append('usedYn', 'Y');

        // 댓글 관리 처리.
        const doCommentMenu = () => {
            if (editData.tagDiv === '') {
                messageBox.alert('차단 사유를 선택해 주세요.');
                return;
            }

            if (editData.BennedType === 'I') {
                // 차단후 복원된 이력이 있는 ID 입니다. 재차단 하시겠습니까? 어떻게?
                setConfirmModalUsage({
                    title: '차단 IP 등록',
                    content: '사용자 IP를 차단 하시겠습니까?',
                    gubun: 'comment',
                });
                setConfirmModal(true);
            } else if (editData.BennedType === 'U') {
                // 차단후 복원된 이력이 있는 IP 입니다. 재차단 하시겠습니까?
                setConfirmModalUsage({
                    title: '차단 ID 등록',
                    content: '사용자 ID를 차단 하시겠습니까?',
                    gubun: 'comment',
                });

                setConfirmModal(true);
            }
        };

        // id 차단 처리.
        const doUMenu = () => {
            if (editData.id === '') {
                messageBox.alert('차단 아이디를 입력해 주세요.');
                return;
            }

            if (editData.tagDiv === '') {
                messageBox.alert('차단 사유를 선택해 주세요.');
                return;
            }

            formData.append('tagValue', editData.id);
            formData.append('tagDiv', editData.tagDiv);
            formData.append('tagDesc', editData.tagDesc);

            handleSaveBlocks(formData);
        };

        // ip 차단 처리.
        const doIMenu = () => {
            if (editData.ip === '') {
                messageBox.alert('차단 IP를 입력해 주세요.');
                return;
            }

            if (editData.tagDiv === '') {
                messageBox.alert('차단 사유를 선택해 주세요.');
                return;
            }

            formData.append('tagValue', editData.ip);
            formData.append('tagDiv', editData.tagDiv);
            formData.append('tagDesc', editData.tagDesc);

            handleSaveBlocks(formData);
        };

        // 금지어 처리.
        const doWMenu = () => {
            if (editData.word === '') {
                messageBox.alert('금지어를 입력해 주세요.');
                return;
            }

            if (editData.tagDiv === '') {
                messageBox.alert('차단 사유를 선택해 주세요.');
                return;
            }

            formData.append('tagValue', editData.word);
            formData.append('tagDiv', editData.tagDiv);
            formData.append('tagDesc', editData.tagDesc);

            handleSaveBlocks(formData);
        };

        if (ModalUsage.usage === `comment`) {
            doCommentMenu();
        } else if (ModalUsage.usage === `U`) {
            doUMenu();
        } else if (ModalUsage.usage === `I`) {
            doIMenu();
        } else if (ModalUsage.usage === `W`) {
            doWMenu();
        }
    };

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleClickHide}
            title={`차단 등록`}
            size="md"
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickHide },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                {/* <MokaInputLabel label={data.title} labelWidth={90} className="mb-0" value={data.value} onChange={handleChangeValue} isInvalid={data.isInvalid} /> */}
                <Form.Row className="mb-2">
                    {(function () {
                        if (ModalUsage.usage && ModalUsage.usage === `comment`) {
                            return (
                                <>
                                    <Col xs={3} className="p-0">
                                        <MokaInputLabel
                                            as="radio"
                                            className="mb-0 h-100"
                                            label="차단 종류"
                                            value="U"
                                            id="dataset-type1"
                                            inputProps={{ custom: true, label: 'ID', checked: editData.BennedType === 'U' ? true : false }}
                                            onChange={(e) => handleChangeValue(e)}
                                            name="BennedType"
                                        />
                                    </Col>
                                    <Col xs={1} className="p-0 mr-10">
                                        <MokaInput
                                            as="radio"
                                            className="mb-0 h-100 align-items-center d-flex"
                                            value="I"
                                            id="dataset-type2"
                                            inputProps={{ custom: true, label: 'IP', checked: editData.BennedType === 'I' ? true : false }}
                                            onChange={(e) => handleChangeValue(e)}
                                            name="BennedType"
                                        />
                                    </Col>
                                </>
                            );
                        } else if (ModalUsage.usage && ModalUsage.usage === `U`) {
                            return (
                                <>
                                    <Col className="p-0">
                                        <MokaInputLabel label="차단 ID" className="mb-0 h-100" id="id" name="id" value={editData.id} onChange={(e) => handleChangeValue(e)} />
                                    </Col>
                                </>
                            );
                        } else if (ModalUsage.usage && ModalUsage.usage === `I`) {
                            return (
                                <>
                                    <Col className="p-0">
                                        <MokaInputLabel label="차단 IP" className="mb-0 h-100" id="ip" name="ip" value={editData.ip} onChange={(e) => handleChangeValue(e)} />
                                    </Col>
                                </>
                            );
                        } else if (ModalUsage.usage && ModalUsage.usage === `W`) {
                            return (
                                <>
                                    <Col className="p-0">
                                        <MokaInputLabel label="금지어" className="mb-0 h-100" id="word" name="word" value={editData.word} onChange={(e) => handleChangeValue(e)} />
                                    </Col>
                                </>
                            );
                        }
                    })()}
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel as="select" label="차단사유" name="tagDiv" id="tagDiv" value={editData.tagDiv} onChange={(e) => handleChangeValue(e)}>
                            <option value="">선택</option>
                            {tagDiv.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            label="차단 내용"
                            className="mb-2"
                            inputClassName="resize-none"
                            inputProps={{ rows: 6 }}
                            id="tagDesc"
                            name="tagDesc"
                            value={editData.tagDesc}
                            onChange={(e) => handleChangeValue(e)}
                        />
                    </Col>
                </Form.Row>
            </Form>
            {confirmModalUsage && (
                <BenneConfirmModal
                    ModalUsage={confirmModalUsage}
                    show={confirmModal}
                    onHide={(e) => {
                        ConfirmModalResult(e);
                        onHide();
                        setConfirmModal(false);
                    }}
                />
            )}
        </MokaModal>
    );
};

export default CommentBlockModal;
