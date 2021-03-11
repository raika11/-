import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaInputLabel } from '@components';
import { useSelector } from 'react-redux';
import { GET_LISTMENU_CONTENTS_INFO } from '@store/board';
import ReplayNote from './ReplayNote';

const BoardsEditReplyForm = ({ EditState, EditData, HandleChangeFormData, setEditReplayData }) => {
    const { selectboard, contentsreply, userName, contentsinfo } = useSelector((store) => ({
        selectboard: store.board.listmenu.selectboard,
        contentsinfo: store.board.listmenu.contents.info,
        contentsreply: store.board.listmenu.contents.reply,
        userName: store.app.AUTH.userName,
        loading: store.loading[GET_LISTMENU_CONTENTS_INFO],
    }));

    const [replyEditdata, setReplyEditdata] = useState({
        title: 'Re: ',
        content: '',
        regName: '',
    });

    const handleEditDataChange = (e) => {
        HandleChangeFormData(e);
    };

    useEffect(() => {
        if (selectboard.editorYn === 'Y') {
            setReplyEditdata({
                ...replyEditdata,
                title: EditData.title,
                regName: EditData.regName,
            });
        } else {
            setReplyEditdata({
                ...replyEditdata,
                title: EditData.title,
                content: EditData.content,
                regName: EditData.regName,
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EditData]);

    useEffect(() => {
        if (EditState.mode === 'add') {
            let tempContent = `
<br />
원본 게시글<br />
------------------------------------------------------<br />
<br />
                ${contentsinfo.content}`;

            // setEditReplayData({
            //     title: 're: ',
            //     content: selectboard.editorYn === 'Y' ? tempContent : tempContent.replace(/(<br ?\/?>)*/g, ''),
            //     regName: userName,
            // });
            setEditReplayData({
                title: 'Re: ',
                content: tempContent,
                regName: userName,
            });
        } else if (EditState.mode === 'modify') {
            setEditReplayData({
                title: contentsreply.title,
                content: contentsreply.content,
                regName: contentsreply.regName,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectboard]);

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
                        value={replyEditdata.title}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            setReplyEditdata({
                                ...replyEditdata,
                                [name]: value,
                            });
                            handleEditDataChange(e);
                        }}
                    />
                </Col>
            </Form.Row>
            {/* 기획서에 백오피스는 설정과 관계 없이 에디터를 표현한다고 textarea 는 주석처리. */}
            {/* {loading === false && selectboard.editorYn === 'N' ? (
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
                                dispatch(changeListmenuReplyContent({ content: e.target.value }));
                                handleEditDataChange(e);
                            }}
                        />
                    </Col>
                </Form.Row>
            ) : ( */}
            <ReplayNote EditState={EditState} />
            {/* )} */}
            <Form.Row>
                <Col xs={7} className="p-0">
                    <MokaInputLabel
                        label="등록자"
                        labelWidth={80}
                        id="regName"
                        name="regName"
                        value={replyEditdata.regName}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            setReplyEditdata({
                                ...replyEditdata,
                                [name]: value,
                            });
                            handleEditDataChange(e);
                        }}
                    />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default BoardsEditReplyForm;
