import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaModal, MokaInputLabel, MokaInput } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';
import { saveBlocks, getCommentsBlocks, getCommentList } from '@store/commentManage';
import { BannedConfirmModal } from '@pages/CommentManage/CommentModal';

/**
 * ModalBody로 Input 한개 있는 Modal
 */
const CommentBlockModal = (props) => {
    const dispatch = useDispatch();

    // 댓글 차단 사유 목록
    const { COMMENT_TAG_DIV_CODE } = useSelector((store) => ({
        COMMENT_TAG_DIV_CODE: store.comment.common.COMMENT_TAG_DIV_CODE,
    }));

    const { show, onHide, modalUsage, selectBannedItem } = props;
    const [editData, setEditData] = useState({
        bannedType: 'U',
        tagValues: '',
        tagDiv: 'A',
        tagDesc: '',
    });
    const [error, setError] = useState({});

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalUsage, setConfirmModalUsage] = useState({
        title: '',
        content: '',
    });

    /**
     * 닫기
     */
    const handleClickHide = () => {
        setEditData({ bannedType: 'U', tagValues: '', tagDiv: 'A', tagDesc: '' });
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

    /**
     * 유효성 검사
     * @param {object} 검사 대상
     */
    const validate = (obj) => {
        let isInvalid = false,
            errList = [];

        if (!obj.tagValues && modalUsage.usage === `U`) {
            errList.push({
                field: 'tagValues',
                reason: 'ID는 필수 입력 항목입니다.',
            });
            isInvalid = isInvalid | true;
        } else if (!obj.tagValues && modalUsage.usage === `I`) {
            errList.push({
                field: 'tagValues',
                reason: 'IP는 필수 입력 항목입니다.',
            });
        } else if (!obj.tagValues && modalUsage.usage === `W`) {
            errList.push({
                field: 'tagValues',
                reason: '금지어는 필수 입력 항목입니다.',
            });
        }

        if (!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/g.test(obj.tagValues) && modalUsage.usage === `U`) {
            errList.push({
                field: 'tagValues',
                reason: 'ID는 이메일 형식입니다.',
            });
            isInvalid = isInvalid | true;
        } else if (
            !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g.test(
                obj.tagValues,
            ) &&
            modalUsage.usage === `I`
        ) {
            errList.push({
                field: 'tagValues',
                reason: 'IP 형식이 올바르지 않습니다.',
            });
            isInvalid = isInvalid | true;
        }

        // if (!/^[A-Za-z0-9_-`/]+$/g.test(obj.dtlCd)) {
        //     errList.push({
        //         field: 'dtlCd',
        //         reason: '코드 형식이 올바르지 않습니다. 영문 대소문자, 숫자, _, -만 입력 가능합니다.',
        //     });
        //     isInvalid = isInvalid | true;
        // }
        // if (!obj.cdNm) {
        //     errList.push({
        //         field: 'cdNm',
        //         reason: '코드 한글명은 필수 입력 항목입니다.',
        //     });
        //     isInvalid = isInvalid | true;
        // }
        // if (!obj.cdOrd) {
        //     errList.push({
        //         field: 'cdOrd',
        //         reason: '순서는 필수 입력 항목입니다.',
        //     });
        //     isInvalid = isInvalid | true;
        // }
        // if (!/^[0-9]+$/g.test(obj.cdOrd)) {
        //     errList.push({
        //         field: 'cdOrd',
        //         reason: '순서는 숫자만 입력 가능합니다.',
        //     });
        //     isInvalid = isInvalid | true;
        // }

        setError(invalidListToError(errList));
        return !isInvalid;
    };

    /**
     * 차단 등록 처리
     */
    const handleSaveBlocks = (formData) => {
        // if (validate(formData))
        dispatch(
            saveBlocks({
                type: 'SAVE',
                seqNo: '',
                blockFormData: formData,
                callback: ({ header, body }) => {
                    const { success, message, resultType } = header;
                    const { totalCnt, list } = body;
                    const { seqNo, tagValue } = body;

                    if (success === false && resultType === 0) {
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
                            messageBox.alert(message, () => {});
                        }
                        return;
                    }

                    if (success === true) {
                        toast.success(message);
                        dispatch(getCommentsBlocks());
                    }

                    handleClickHide(); // 모달창 닫기
                    dispatch(getCommentList());
                },
            }),
        );
    };

    const ConfirmModalResult = (e) => {
        const { gubun, type } = e;
        let formData = new FormData();

        if (gubun === 'comment' && type === 'save') {
            formData.append('usedYn', 'Y');
            formData.append('tagType', editData.bannedType);
            if (editData.bannedType === 'U') {
                formData.append(
                    'tagValues',
                    selectBannedItem
                        .map((e) => `${e.memId}@${e.memSite}`)
                        .reduce((acc, curr) => (acc.includes(curr) ? acc : [...acc, curr]), [])
                        .join(','),
                );
            } else {
                formData.append(
                    'tagValues',
                    selectBannedItem
                        .map((e) => e.memIp)
                        .reduce((acc, curr) => (acc.includes(curr) ? acc : [...acc, curr]), [])
                        .join(','),
                );
            }
            formData.append('tagDiv', editData.tagDiv);
            formData.append('tagDesc', editData.tagDesc);
            handleSaveBlocks(formData);
        }
    };

    /**
     * 저장 버튼 클릭 이벤트
     */
    const handleClickSave = (e) => {
        let formData = new FormData();
        formData.append('tagType', modalUsage.usage);
        formData.append('usedYn', 'Y');

        // 댓글 관리 처리.
        const doCommentMenu = () => {
            if (editData.tagDiv === '') {
                messageBox.alert('차단 사유를 선택해 주세요.');
                return;
            }

            if (editData.bannedType === 'I') {
                // 차단후 복원된 이력이 있는 ID 입니다. 재차단 하시겠습니까? 어떻게?
                setConfirmModalUsage({
                    title: '차단 IP 등록',
                    content: '사용자 IP를 차단 하시겠습니까?',
                    gubun: 'comment',
                });
                setConfirmModal(true);
            } else if (editData.bannedType === 'U') {
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
            if (editData.tagValues === '') {
                messageBox.alert('차단 아이디를 입력해 주세요.');
                return;
            }

            if (editData.tagDiv === '') {
                messageBox.alert('차단 사유를 선택해 주세요.');
                return;
            }
            formData.append('tagValues', editData.tagValues);
            formData.append('tagDiv', editData.tagDiv);
            formData.append('tagDesc', editData.tagDesc);
            handleSaveBlocks(formData);
        };

        // ip 차단 처리.
        const doIMenu = () => {
            if (editData.tagValues === '') {
                messageBox.alert('차단 IP를 입력해 주세요.');
                return;
            }

            if (editData.tagDiv === '') {
                messageBox.alert('차단 사유를 선택해 주세요.');
                return;
            }

            setConfirmModalUsage({
                title: '차단 IP 등록',
                content: '사용자 IP를 차단 하시겠습니까?',
                gubun: 'U',
            });

            formData.append('tagValues', editData.tagValues);
            formData.append('tagDiv', editData.tagDiv);
            formData.append('tagDesc', editData.tagDesc);
            handleSaveBlocks(formData);
        };

        // 금지어 처리.
        const doWMenu = () => {
            if (editData.tagValues === '') {
                messageBox.alert('금지어를 입력해 주세요.');
                return;
            }

            if (editData.tagDiv === '') {
                messageBox.alert('차단 사유를 선택해 주세요.');
                return;
            }
            formData.append('tagValues', editData.tagValues);
            formData.append('tagDiv', editData.tagDiv);
            formData.append('tagDesc', editData.tagDesc);
            handleSaveBlocks(formData);
        };

        if (modalUsage.usage === `comment`) {
            doCommentMenu();
        } else if (modalUsage.usage === `U`) {
            doUMenu();
        } else if (modalUsage.usage === `I`) {
            doIMenu();
        } else if (modalUsage.usage === `W`) {
            doWMenu();
        }
    };

    return (
        <MokaModal
            size="md"
            width={600}
            show={show}
            onHide={handleClickHide}
            title={`차단 등록`}
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickHide },
            ]}
            id="commentBlockModal"
            draggable
        >
            <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Row className="mb-2 align-items-center">
                    {modalUsage.usage && modalUsage.usage === `comment` && (
                        <>
                            <Col xs={3} className="p-0 mr-2">
                                <MokaInputLabel
                                    as="radio"
                                    label="차단 종류"
                                    value="U"
                                    id="dataset-type1"
                                    inputProps={{ custom: true, label: 'ID', checked: editData.bannedType === 'U' ? true : false }}
                                    onChange={handleChangeValue}
                                    name="BannedType"
                                />
                            </Col>
                            <Col xs={1} className="p-0">
                                <MokaInput
                                    as="radio"
                                    value="I"
                                    id="dataset-type2"
                                    inputProps={{ custom: true, label: 'IP', checked: editData.bannedType === 'I' ? true : false }}
                                    onChange={handleChangeValue}
                                    name="bannedType"
                                />
                            </Col>
                        </>
                    )}
                    {modalUsage.usage && modalUsage.usage === `U` && (
                        <>
                            <Col className="p-0">
                                <MokaInputLabel
                                    label="차단 ID"
                                    id="tagValues"
                                    name="tagValues"
                                    value={editData.tagValues}
                                    onChange={handleChangeValue}
                                    isInvalid={error.tagValues}
                                />
                            </Col>
                        </>
                    )}
                    {modalUsage.usage && modalUsage.usage === `I` && (
                        <>
                            <Col className="p-0">
                                <MokaInputLabel
                                    label="차단 IP"
                                    id="tagValues"
                                    name="tagValues"
                                    value={editData.tagValues}
                                    onChange={handleChangeValue}
                                    isInvalid={error.tagValues}
                                />
                            </Col>
                        </>
                    )}
                    {modalUsage.usage && modalUsage.usage === `W` && (
                        <>
                            <Col className="p-0">
                                <MokaInputLabel
                                    label="금지어"
                                    id="tagValues"
                                    name="tagValues"
                                    value={editData.tagValues}
                                    onChange={handleChangeValue}
                                    isInvalid={error.tagValues}
                                />
                            </Col>
                        </>
                    )}
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel as="select" label="차단사유" name="tagDiv" id="tagDiv" value={editData.tagDiv} onChange={handleChangeValue}>
                            {COMMENT_TAG_DIV_CODE &&
                                COMMENT_TAG_DIV_CODE.map((item, index) => (
                                    <option key={index} value={item.dtlCd}>
                                        {item.cdNm}
                                    </option>
                                ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            label="차단 내용"
                            inputClassName="resize-none"
                            inputProps={{ rows: 6 }}
                            id="tagDesc"
                            name="tagDesc"
                            value={editData.tagDesc}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
            </Form>
            <BannedConfirmModal
                modalUsage={confirmModalUsage}
                show={confirmModal}
                onHide={(e) => {
                    ConfirmModalResult(e);
                    setConfirmModal(false);
                }}
            />
        </MokaModal>
    );
};

export default CommentBlockModal;
