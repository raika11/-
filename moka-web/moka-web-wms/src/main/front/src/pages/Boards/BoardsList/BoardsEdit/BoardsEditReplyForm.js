import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel } from '@components';
import ReplyNote from './ReplyNote';
import toast from '@/utils/toastUtil';
import { DATE_FORMAT, DB_DATEFORMAT, TIME_FORMAT } from '@/constants';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 편집 답변 폼
 */
const BoardsEditReplyForm = ({ data, onChangeFormData }) => {
    const { boardSeq, parentBoardSeq, reply } = useParams();

    const userName = useSelector((store) => store.app.AUTH.userName);
    const selectBoard = useSelector((store) => store.board.listMenu.selectBoard);
    const contentsInfo = useSelector((store) => store.board.listMenu.contents.info);
    const contentsReply = useSelector((store) => store.board.listMenu.contents.reply);
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
        onChangeFormData({ [name]: value });
    };

    useEffect(() => {
        // 답변 등록시
        if (boardSeq && reply && !parentBoardSeq) {
            let tempContent = `
                <br />
                원본 게시글<br />
                <hr class="divider">
                ${contentsInfo.content || contentsReply.content}`;

            onChangeFormData({
                title: `Re: ${contentsInfo.title || contentsReply.title}`,
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
    }, [parentBoardSeq]);

    useEffect(() => {
        if (reserveInfo.date && reserveInfo.time) {
            onChangeFormData({ delYn: 'Y', reserveDt: `${moment(reserveInfo.date).format(DATE_FORMAT)} ${moment(reserveInfo.time).format(TIME_FORMAT)}` });
        } else {
            onChangeFormData({ reserveDt: null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reserveInfo]);

    useEffect(() => {
        if (data.reserveDt) {
            setReserveInfo({ ...reserveInfo, date: moment(data.reserveDt, DB_DATEFORMAT), time: moment(data.reserveDt, DB_DATEFORMAT) });
        } else {
            setReserveInfo({ ...reserveInfo, date: null, time: null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.reserveDt]);

    return (
        <Form>
            <Form.Row className="mb-2">
                <Col className="p-0">
                    <MokaInputLabel label="제목" className="mb-0" name="title" value={data.title} onChange={handleChangeValue} />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col xs={5} className="p-0 pr-2">
                    <MokaInputLabel
                        as="dateTimePicker"
                        label="예약 일시"
                        value={reserveInfo.date}
                        inputProps={{ timeFormat: null }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                const nd = new Date();
                                const diff = moment(nd).diff(date, 'days');
                                if (diff > 0) {
                                    toast.warning('미래 일시를 지정해주세요');
                                    setReserveInfo({ ...reserveInfo, date: moment(nd, DB_DATEFORMAT) });
                                } else {
                                    setReserveInfo({ ...reserveInfo, date: moment(date, DB_DATEFORMAT) });
                                }
                            } else {
                                setReserveInfo({ ...reserveInfo, time: null });
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
                            if (typeof date === 'object') {
                                const nd = new Date();
                                if (moment(reserveInfo.date).format(DATE_FORMAT) === moment(nd).format(DATE_FORMAT)) {
                                    const diff = moment(nd).diff(date, 'minutes');
                                    if (diff > 0) {
                                        toast.warning('미래 일시를 지정해주세요');
                                        setReserveInfo({ ...reserveInfo, time: moment(nd, DB_DATEFORMAT) });
                                    }
                                } else {
                                    setReserveInfo({ ...reserveInfo, time: moment(date, DB_DATEFORMAT) });
                                }
                            } else {
                                setReserveInfo({ ...reserveInfo, time: null });
                            }
                        }}
                    />
                </Col>
            </Form.Row>
            {selectBoard.editorYn === 'N' ? (
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
                <ReplyNote data={data.content} onChangeFormData={onChangeFormData} />
            )}
            <Form.Row>
                <Col xs={7} className="p-0">
                    <MokaInputLabel label="등록자" name="regName" value={data.regName} onChange={handleChangeValue} />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default BoardsEditReplyForm;
