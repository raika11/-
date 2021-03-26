import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel } from '@components';
import ReplayNote from '@/pages/Boards/BoardsList/BoardsEdit/ReplayNote';

/**
 * J팟 관리 > 공지 게시판 > 게시글 답변 편집 폼
 */
const NoticeEditReplyForm = ({ data, onChange }) => {
    const { boardSeq, parentBoardSeq, reply } = useParams();

    const userName = useSelector((store) => store.app.AUTH.userName);
    const jpodBoard = useSelector((store) => store.jpod.jpodNotice.jpodBoard);
    const channelList = useSelector((store) => store.jpod.jpodNotice.channelList);
    const contents = useSelector((store) => store.jpod.jpodNotice.contents);
    const storeReply = useSelector((store) => store.jpod.jpodNotice.reply);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };

    useEffect(() => {
        // 답변 등록시
        if (boardSeq && reply && !parentBoardSeq) {
            let tempContent = `
                <br />
                원본 게시글<br />
                <hr class="divider">
                <br />
                <br /><br />
                ${contents.content}`;

            onChange({
                title: `Re: ${contents.title} `,
                content: tempContent,
                regName: userName,
            });
        } else if (boardSeq && parentBoardSeq && reply) {
            // 답변 글 조회시
            onChange({
                title: storeReply.title,
                content: storeReply.content,
                regName: storeReply.regName,
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
            {/* J팟 채널 목록 */}
            {channelList.length > 0 && (
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel as="select" label="채널명" name="channelId" value={data.channelId} onChange={handleChangeValue}>
                            <option value="">선택</option>
                            {channelList.map((chnl) => (
                                <option key={chnl.value} value={chnl.value}>
                                    {chnl.name}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
            )}
            {/* textarea, 에디터 */}
            {jpodBoard.editorYn === 'N' ? (
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        as="textarea"
                        className="flex-fill"
                        inputClassName="resize-none"
                        inputProps={{ rows: 6 }}
                        name="content"
                        value={data.content}
                        onChange={handleChangeValue}
                    />
                </Form.Row>
            ) : (
                <ReplayNote data={data.content} onChangeFormData={onChange} />
            )}
            {/* 등록자 */}
            <Form.Row>
                <Col xs={7} className="p-0">
                    <MokaInputLabel label="등록자" name="regName" value={data.regName} onChange={handleChangeValue} />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default NoticeEditReplyForm;
