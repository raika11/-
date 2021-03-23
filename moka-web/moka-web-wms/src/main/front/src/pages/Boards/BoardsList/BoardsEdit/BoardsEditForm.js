import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaIcon, MokaInputLabel, MokaInput, MokaTableEditCancleButton } from '@components';
import { messageBox } from '@utils/toastUtil';
import { getBoardChannelList, GET_LIST_MENU_CONTENTS_INFO } from '@store/board';
import BoardRepoterSelect from './BoardRepoterSelect';
import BoardsNote from './BoardsNote';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 편집 폼
 */
const BoardsEditForm = ({ data, onChangeFormData }) => {
    const dispatch = useDispatch();
    const { boardId, boardSeq, parentBoardSeq, reply } = useParams();

    const PDS_URL = useSelector((store) => store.app.PDS_URL);
    const selectBoard = useSelector((store) => store.board.listMenu.selectBoard);
    const contentsInfo = useSelector((store) => store.board.listMenu.contents.info);
    const loading = useSelector((store) => store.loading[GET_LIST_MENU_CONTENTS_INFO]);

    const [channalList, setChannalList] = useState([]); // 채널 선택
    const [uploadFiles, setUploadFiles] = useState([]); // 등록 파일
    let fileinputRef = useRef(null);

    /**
     * 첨부 파일 등록
     */
    const handleChangeFileInput = (event) => {
        // 게시판 설정 확장자 체크
        let extCheck = false;
        try {
            let tempFile = event.target.files[0].name.split('.');
            let tempFileExt = tempFile[1];

            if (selectBoard.allowFileExt.split(',').indexOf(tempFileExt) < 0) {
                messageBox.alert(`해당 게시판의 첨부 파일은 (${selectBoard.allowFileExt}) 만 등록 가능합니다.`, () => {});
            } else {
                extCheck = true;
            }
        } catch (e) {
            throw e;
        }

        if (!extCheck) return;

        if (uploadFiles.length + 1 > selectBoard.allowFileCnt) {
            messageBox.alert(`해당 게시판의 첨부 파일 최대 건수는 ${selectBoard.allowFileCnt}개 입니다.`, () => {});
        } else {
            setUploadFiles([...uploadFiles, event.target.files[0]]);
        }
        fileinputRef.current.value = '';
    };

    /**
     * 첨부파일 삭제
     */
    const handleDeleteUploadFile = (index) => {
        setUploadFiles(
            produce(uploadFiles, (draft) => {
                draft.splice(index, 1);
            }),
        );
    };

    /**
     * 이미지 리스트 클릭시 새탭
     */
    const handleClickImageName = (element) => {
        const { file_url } = element;
        if (file_url) {
            var win = window.open(file_url, '_blank');
            win.focus();
        }
    };

    useEffect(() => {
        if (selectBoard && selectBoard.channelType) {
            // BOARD_DIVC1 -> JPOD
            // BOARD_DIVC2 -> 기자
            dispatch(
                getBoardChannelList({
                    type: selectBoard.channelType,
                    callback: (element) => {
                        if (typeof element === 'object') setChannalList(element);
                        else return;
                    },
                }),
            );
        }
    }, [dispatch, selectBoard]);

    useEffect(() => {
        onChangeFormData({
            target: {
                name: 'attaches',
                value: uploadFiles,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadFiles]);

    useEffect(() => {
        onChangeFormData({
            target: {
                name: 'content',
                value: data.content,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.content]);

    useEffect(() => {
        if (loading === false) {
            setUploadFiles(
                data.attaches.map((element) => {
                    const { seqNo, orgFileName, filePath, fileName } = element;
                    const file_url = PDS_URL && filePath && fileName ? `${PDS_URL}/${filePath}/${fileName}` : '';
                    return {
                        seqNo: seqNo,
                        name: orgFileName,
                        file_url: file_url,
                    };
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    console.log(data);

    return (
        <>
            <Form>
                {boardSeq && !parentBoardSeq && (
                    <>
                        <Form.Row>
                            <Col xs={6} className="p-0">
                                <p className="mb-0">{data.boardSeq && data.regDt ? `${data.regDt} ${data.regName}(${data.regId})` : ''}</p>
                            </Col>
                            <Col xs={6} className="p-0">
                                <p className="mb-0">{data.boardSeq && data.modDt ? `${data.modDt} ${data.regName}(${data.regId})` : ''}</p>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2 align-items-center">
                            <Col className="p-0 d-flex">
                                <MokaInputLabel label="조회수" as="none" />
                                <p className="mb-0">{data.viewCnt}</p>
                            </Col>
                            {selectBoard.recomFlag === '1' && (
                                <Col className="p-0 d-flex justify-content-center">
                                    <MokaInputLabel label="추천" as="none" />
                                    <MokaIcon className="mr-2" iconName="fad-thumbs-up" size="1x" />
                                    <p className="mb-0 mr-4">{data.recomCnt}</p>
                                    <MokaIcon className="mr-2" iconName="fad-thumbs-down" size="1x" />
                                    <p className="mb-0">{data.decomCnt}</p>
                                </Col>
                            )}
                            {selectBoard.recomFlag === '2' && (
                                <Col className="p-0 d-flex justify-content-center">
                                    <MokaIcon className="mr-2" iconName="fad-thumbs-up" size="1x" />
                                    <p className="mb-0">{data.recomCnt}</p>
                                </Col>
                            )}
                            {selectBoard.declareYn === 'Y' && (
                                <Col className="p-0 d-flex justify-content-center">
                                    <MokaInputLabel label="신고" as="none" />
                                    <p className="mb-0">{data.declareCnt}</p>
                                </Col>
                            )}
                        </Form.Row>
                    </>
                )}
                {/* 채널 게시판일 때 */}
                {loading === false &&
                    (selectBoard.channelType === 'BOARD_DIVC2' ? (
                        // 기자
                        <BoardRepoterSelect
                            channalList={channalList}
                            selectValue={data.channelId}
                            onChange={(value) => {
                                onChangeFormData({
                                    target: {
                                        name: 'channelId',
                                        value: value,
                                    },
                                });
                            }}
                        />
                    ) : (
                        channalList.length > 0 && (
                            <Form.Row className="mb-2">
                                <Col xs={6} className="p-0">
                                    <MokaInputLabel as="select" label="채널명" name="channelId" value={data.channelId} onChange={(e) => onChangeFormData(e)}>
                                        <option value="">선택</option>
                                        {channalList.map((item, index) => (
                                            <option key={index} value={item.value}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </MokaInputLabel>
                                </Col>
                            </Form.Row>
                        )
                    ))}
                {selectBoard.boardId && (selectBoard.titlePrefixNm1 || selectBoard.titlePrefixNm2) && (
                    <Form.Row className="mb-2">
                        {selectBoard.titlePrefixNm1 && (
                            <Col xs={6} className="p-0 pr-20">
                                <MokaInputLabel as="select" label={selectBoard.titlePrefixNm1} name="titlePrefix1" value={data.titlePrefix1} onChange={(e) => onChangeFormData(e)}>
                                    <option value="">선택</option>
                                    {selectBoard.titlePrefix1
                                        .replaceAll(' ', '')
                                        .split(',')
                                        .map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                </MokaInputLabel>
                            </Col>
                        )}

                        {selectBoard.titlePrefixNm2 && (
                            <Col xs={6} className="p-0 pl-20">
                                <MokaInputLabel as="select" label={selectBoard.titlePrefixNm2} name="titlePrefix2" value={data.titlePrefix2} onChange={(e) => onChangeFormData(e)}>
                                    <option value="">선택</option>
                                    {selectBoard.titlePrefix2
                                        .replaceAll(' ', '')
                                        .split(',')
                                        .map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                </MokaInputLabel>
                            </Col>
                        )}
                    </Form.Row>
                )}

                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel label="노출 순서" type="number" name="ordNo" placeholder={'노출순서'} value={data.ordNo} onChange={(e) => onChangeFormData(e)} />
                    <p className="mb-0 ml-20 text-neutral">
                        * 공지 글과 같이 상단에 노출되는 경우는 <br />
                        적은 숫자(예: 0)로 입력해주세요
                    </p>
                </Form.Row>
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel
                        as="switch"
                        name="pushReceiveYn"
                        id="pushReceiveYn"
                        label="답변 PUSH 수신"
                        inputProps={{ custom: true, checked: data.pushReceiveYn === 'Y', disabled: true }}
                        onChange={(e) => onChangeFormData(e)}
                    />
                    <p className="mb-0 ml-2">답변에 대한 APP 푸쉬를 받을 수 있습니다.</p>
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        as="switch"
                        name="emailReceiveYn"
                        id="emailReceiveYn"
                        className="mr-2"
                        label="발송 이메일"
                        inputProps={{ custom: true, checked: data.emailReceiveYn === 'Y' }}
                        onChange={(e) => onChangeFormData(e)}
                    />
                    <MokaInputLabel
                        label="이메일"
                        labelWidth={40}
                        className="flex-fill"
                        name="email"
                        placeholder="이메일"
                        value={data.email}
                        onChange={(e) => onChangeFormData(e)}
                    />
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInput className="mb-0" name="title" placeholder="제목을 입력해 주세요." value={data.title} onChange={(e) => onChangeFormData(e)} />
                    </Col>
                </Form.Row>
                {/* 기획서에 백오피스는 설정과 관계 없이 에디터를 표현한다고 textarea 는 주석처리. */}
                {/* {selectBoard.editorYn === 'N' ? (
                    <Form.Row className="mb-2">
                        <Col className="p-0">
                            <MokaInputLabel
                                as="textarea"
                                className="mb-2"
                                inputClassName="resize-none"
                                inputProps={{ rows: 6 }}
                                name="content"
                                value={data.content}
                                // onChange={(e) => onChangeFormData(e)}
                                onChange={(e) => {
                                    dispatch(changeListMenuContent({ content: e.target.value }));
                                    onChangeFormData(e);
                                }}
                            />
                        </Col>
                    </Form.Row>
                ) : ( */}
                <BoardsNote data={data.content} onChangeFormData={onChangeFormData} />
                {/* )} */}

                <hr className="divider" />

                {selectBoard.fileYn === 'Y' && (
                    <>
                        <Form.Row>
                            <Col xs={4} className="p-0">
                                <MokaInputLabel label="첨부파일" as="none" className="mb-2" />
                            </Col>
                            <Col xs={8} className="p-0 text-right">
                                <div className="file btn btn-primary" style={{ position: 'relative', overflow: 'hidden' }}>
                                    등록
                                    <input
                                        type="file"
                                        name="file"
                                        ref={fileinputRef}
                                        onChange={(e) => handleChangeFileInput(e)}
                                        style={{
                                            position: 'absolute',
                                            fontSize: '50px',
                                            opacity: '0',
                                            right: '0',
                                            top: '0',
                                        }}
                                    />
                                </div>
                            </Col>
                        </Form.Row>
                        <hr className="divider" />
                        {uploadFiles.map((element, index) => {
                            return (
                                <Form.Row className="mb-0 pt-1" key={index}>
                                    <Form.Row className="w-100" style={{ backgroundColor: '#f4f7f9', height: '50px' }}>
                                        <Col xs={11} className="w-100 h-100 d-flex align-items-center justify-content-start">
                                            <div onClick={() => handleClickImageName(element)}>{element.name}</div>
                                        </Col>
                                        <Col>
                                            <MokaTableEditCancleButton onClick={() => handleDeleteUploadFile(index)} />
                                        </Col>
                                    </Form.Row>
                                </Form.Row>
                            );
                        })}
                        <hr className="divider" />
                    </>
                )}

                {selectBoard.allowItem && selectBoard.allowItem.split(',').indexOf('EMAIL') >= 0 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="이메일" value={contentsInfo.email} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
                {selectBoard.allowItem && selectBoard.allowItem.split(',').indexOf('MOBILE_POHONE') >= 0 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="휴대폰 번호" value={contentsInfo.mobilePhone} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
                {selectBoard.allowItem && selectBoard.allowItem.split(',').indexOf('ADDR') >= 0 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="주소" value={contentsInfo.addr} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
                {selectBoard.allowItem && selectBoard.allowItem.split(',').indexOf('URL') >= 0 && (
                    <Form.Row>
                        <MokaInputLabel label="URL" value={contentsInfo.url} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
            </Form>
        </>
    );
};

export default BoardsEditForm;
