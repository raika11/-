import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel } from '@components';
import ReplyNote from '@/pages/Boards/BoardsList/BoardsEdit/ReplyNote';
import { DATE_FORMAT } from '@/constants';
import toast from '@/utils/toastUtil';

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

    // 예약 일시 정보
    const [reserveInfo, setReserveInfo] = useState({
        date: null,
        time: null,
    });

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
                ${contents.content || storeReply.content}`;

            onChange({
                title: `Re: ${contents.title || storeReply.title}`,
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
    }, [parentBoardSeq]);

    useEffect(() => {
        if (reserveInfo.date && reserveInfo.time) {
            onChange({ reserveDt: `${moment(reserveInfo.date).format(DATE_FORMAT)} ${moment(reserveInfo.time).format('HH:mm')}` });
        }
        // else if ((reserveInfo.date && !reserveInfo.time) || (!reserveInfo.date && reserveInfo.time)) {
        //     toast.warning('예약 일시를 확인해주세요');
        // }
        else {
            onChange({ reserveDt: null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reserveInfo]);

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
            <Form.Row className="mb-2">
                <Col xs={5} className="p-0 pr-2">
                    <MokaInputLabel
                        as="dateTimePicker"
                        label="예약 일시"
                        value={reserveInfo.date}
                        inputProps={{ timeFormat: null }}
                        onChange={(date) => {
                            if (typeof date) {
                                const nd = new Date();
                                const diff = moment(nd).diff(date, 'days');
                                if (diff > 0) {
                                    toast.warning('미래 일시를 지정해주세요');
                                    setReserveInfo({ ...reserveInfo, date: moment(nd) });
                                } else {
                                    setReserveInfo({ ...reserveInfo, date: date });
                                }
                            } else {
                                setReserveInfo({ ...reserveInfo, date: null });
                            }
                        }}
                    />
                </Col>
                <Col xs={3} className="p-0">
                    <MokaInput
                        as="dateTimePicker"
                        value={reserveInfo.time}
                        inputProps={{ dateFormat: null }}
                        onChange={(date) => {
                            if (typeof date) {
                                setReserveInfo({ ...reserveInfo, time: date });
                            } else {
                                setReserveInfo({ ...reserveInfo, time: null });
                            }
                        }}
                    />
                </Col>
            </Form.Row>
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
                <ReplyNote data={data.content} onChangeFormData={onChange} jpodBoardId={jpodBoard.boardId} />
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
