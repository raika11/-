import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel } from '@components';
import { GET_LIST_MENU_CONTENTS_INFO } from '@store/board';
import ReplayNote from './ReplayNote';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 편집 답변 폼
 */
const BoardsEditReplyForm = ({ data, setEditReplayData, onChangeFormData }) => {
    const { boardId, boardSeq, parentBoardSeq, reply } = useParams();

    const userName = useSelector((store) => store.app.AUTH.userName);
    const selectBoard = useSelector((store) => store.board.listMenu.selectBoard);
    const contentsInfo = useSelector((store) => store.board.listMenu.contents.info);
    const contentsReply = useSelector((store) => store.board.listMenu.contents.reply);

    const [replyEditData, setReplyEditData] = useState({
        title: 'Re: ',
        content: '',
        regName: '',
    });

    useEffect(() => {
        if (selectBoard.editorYn === 'Y') {
            setReplyEditData({
                ...replyEditData,
                title: data.title,
                regName: data.regName,
            });
        } else {
            setReplyEditData({
                ...replyEditData,
                title: data.title,
                content: data.content,
                regName: data.regName,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        // 원글 답변 등록시
        if (!boardSeq && parentBoardSeq) {
            let tempContent = `
                <br />
                원본 게시글<br />
                ------------------------------------------------------<br />
                <br />
                ${contentsInfo.content}`;

            // setEditReplayData({
            //     title: 're: ',
            //     content: selectBoard.editorYn === 'Y' ? tempContent : tempContent.replace(/(<br ?\/?>)*/g, ''),
            //     regName: userName,
            // });
            setEditReplayData({
                title: 'Re: ',
                content: tempContent,
                regName: userName,
            });
        } else if (boardSeq && parentBoardSeq && reply) {
            // 답변 글 조회시
            setEditReplayData({
                title: contentsReply.title,
                content: contentsReply.content,
                regName: contentsReply.regName,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectBoard]);

    return (
        <Form>
            <Form.Row className="mb-2">
                <Col className="p-0">
                    <MokaInputLabel
                        label="제목"
                        labelWidth={80}
                        className="mb-0"
                        id="title"
                        name="title"
                        value={replyEditData.title}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            setReplyEditData({
                                ...replyEditData,
                                [name]: value,
                            });
                            onChangeFormData(e);
                        }}
                    />
                </Col>
            </Form.Row>
            {/* 기획서에 백오피스는 설정과 관계 없이 에디터를 표현한다고 textarea 는 주석처리. */}
            {/* {loading === false && selectBoard.editorYn === 'N' ? (
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            className="mb-2"
                            inputClassName="resize-none"
                            inputProps={{ rows: 6 }}
                            id="content"
                            name="content"
                            value={replyEditdata.content}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                setReplyEditdata({
                                    ...replyEditdata,
                                    [name]: value,
                                });
                                dispatch(changeListMenuReplyContent({ content: e.target.value }));
                                handleEditDataChange(e);
                            }}
                        />
                    </Col>
                </Form.Row>
            ) : ( */}
            <ReplayNote />
            {/* )} */}
            <Form.Row>
                <Col xs={7} className="p-0">
                    <MokaInputLabel
                        label="등록자"
                        labelWidth={80}
                        id="regName"
                        name="regName"
                        value={replyEditData.regName}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            setReplyEditData({
                                ...replyEditData,
                                [name]: value,
                            });
                            onChangeFormData(e);
                        }}
                    />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default BoardsEditReplyForm;
