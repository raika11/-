import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel } from '@components';
import ReplayNote from './ReplayNote';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 편집 답변 폼
 */
const BoardsEditReplyForm = ({ data, onChangeFormData }) => {
    const { boardSeq, parentBoardSeq, reply } = useParams();

    const userName = useSelector((store) => store.app.AUTH.userName);
    const contentsInfo = useSelector((store) => store.board.listMenu.contents.info);
    const contentsReply = useSelector((store) => store.board.listMenu.contents.reply);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        onChangeFormData({ [name]: value });
    };

    useEffect(() => {
        // 답변 등록시
        if (boardSeq && reply && !parentBoardSeq) {
            let tempContent = `
                <br />
                원본 게시글<br />
                ----------------------------------------------<br />
                <br />
                제목 : ${contentsInfo.title}<br /><br />
                ${contentsInfo.content}`;

            onChangeFormData({
                title: 'Re: ',
                content: tempContent,
                regName: userName,
            });
        } else if (boardSeq && parentBoardSeq && reply) {
            // 답변 글 조회시
            onChangeFormData({
                title: contentsReply.title,
                content: contentsReply.content,
                regName: contentsReply.regName,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form>
            <Form.Row className="mb-2">
                <Col className="p-0">
                    <MokaInputLabel label="제목" className="mb-0" name="title" value={data.title} onChange={handleChangeValue} />
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
            <ReplayNote data={data.content} onChangeFormData={onChangeFormData} />
            {/* )} */}
            <Form.Row>
                <Col xs={7} className="p-0">
                    <MokaInputLabel label="등록자" name="regName" value={data.regName} onChange={handleChangeValue} />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default BoardsEditReplyForm;
