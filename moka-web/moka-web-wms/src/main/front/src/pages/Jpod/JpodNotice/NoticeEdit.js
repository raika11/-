import React, { Suspense, useState } from 'react';
import { MokaCard, MokaInputLabel } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
import BoardsSummernote from '@pages/Boards/BoardsList/BoardsEdit/BoardsSummernote';
// import { uploadBoardContentImage } from '@store/board';
import { messageBox } from '@utils/toastUtil';
// import moment from 'moment';
// import { DB_DATEFORMAT } from '@/constants';
// import { PodtyChannelModal, RepoterModal } from '@pages/Jpod/JpodModal';
// import { initialState, GET_REPORTER_LIST, saveJpodChannel, clearChannelInfo, getChannelInfo, getChEpisodes, getChannels, clearReporter } from '@store/jpod';
// import { useDispatch } from 'react-redux';
// import toast, { messageBox } from '@utils/toastUtil';
import { useHistory } from 'react-router-dom';

const channel_list = [
    {
        name: '테스트 1 채널',
        value: '0001',
    },
    {
        name: '테스트 2 채널',
        value: '0002',
    },
];
const NoticeEdit = ({ match }) => {
    // const dispatch = useDispatch();
    const history = useHistory();
    // const params = useParams();

    const tempValue = 'add';

    const [editData] = useState({});

    // 게시글 데이터 변경시 스테이트 업데이트.
    // const handleChangeFormData = useCallback(
    //     (e) => {
    //         const { name, value } = e.target;
    //         setEditData({
    //             ...editData,
    //             [name]: value,
    //         });
    //     },
    //     [editData],
    // );

    const handleClickCancleButton = () => {
        history.push(`${match.path}`);
        // dispatch(clearChannelInfo());
        // dispatch(getChannelInfo({ chnlSeq: chnlSeq }));
        // dispatch(getChEpisodes({ chnlSeq: chnlSeq }));
    };

    const handleClickSaveButton = () => {
        messageBox.alert('개발중 입니다.');
    };

    // summernote 이미지 업로드 처리.
    const SummernoteImageUpload = (file) => {
        const formData = new FormData();
        formData.append('attachFile', file[0]);

        // dispatch(
        //     uploadBoardContentImage({
        //         boardId: boardId.current,
        //         imageForm: formData,
        //         callback: ({ header: { success, message }, body }) => {
        //             if (success === true) {
        //                 toast.success(message);
        //                 if (editState.mode === 'new' || editState.mode === 'modify') {
        //                     setEditData({
        //                         ...editData,
        //                         content: `${editData.content} <img src="${body}">`,
        //                     });
        //                 } else {
        //                     setReplyEditData({
        //                         ...replyEditData,
        //                         content: `${replyEditData.content} <img src="${body}">`,
        //                     });
        //                 }
        //             } else {
        //                 const { totalCnt, list } = body;
        //                 if (totalCnt > 0 && Array.isArray(list)) {
        //                     // 에러 메시지 확인.
        //                     messageBox.alert(list[0].reason, () => {});
        //                 } else {
        //                     // body에 에러메시지가 없으면 서버 메시지를 alert 함.
        //                     messageBox.alert(message, () => {});
        //                 }
        //             }
        //         },
        //     }),
        // );
    };

    return (
        <MokaCard
            className="overflow-hidden flex-fill"
            title={`게시글 ${tempValue === 'add' ? '등록' : '정보'}`}
            titleClassName="mb-0"
            loading={false}
            footer
            footerClassName="d-flex justify-content-center"
            footerAs={
                <>
                    {(function () {
                        return (
                            <Row className="justify-content-md-center text-center">
                                <Col className="mp-0 pr-0">
                                    <Button variant="positive" onClick={() => handleClickSaveButton()}>
                                        저장
                                    </Button>
                                </Col>
                                <Col className="mp-0 pr-0">
                                    <Button variant="negative" onClick={() => handleClickCancleButton()}>
                                        취소
                                    </Button>
                                </Col>
                            </Row>
                        );
                    })()}
                </>
            }
        >
            <Form className="mb-gutter">
                {/* 채널 선택. */}
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel label="채널명" as="select" id="chnlSeq" name="chnlSeq" labelWidth={90} value={editData.chnlSeq} onChange={(e) => console.log(e)}>
                            <option value="">채널 전체</option>
                            {channel_list.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                {/* 에피소드 명 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        className="overflow-hidden flex-fill mb-0"
                        id="title"
                        name="title"
                        placeholder="제목을 입력해 주세요."
                        value={editData.title}
                        onChange={(e) => console.log(e)}
                    />
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0 ">
                        <Suspense>
                            <BoardsSummernote
                                contentValue={editData.content}
                                className="overflow-hidden flex-fill mb-0"
                                editChange={(value) => {
                                    console.log(value);
                                }}
                                editImageUpload={(e) => SummernoteImageUpload(e)}
                            />
                        </Suspense>
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default NoticeEdit;
