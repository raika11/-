import React, { useEffect, useState, useRef } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import { MokaInputLabel, MokaInput, MokaTableEditCancleButton } from '@components';
import BoardRepoterSelect from './BoardRepoterSelect';
import { useSelector, useDispatch } from 'react-redux';
import { MokaIcon } from '@components';
import { messageBox } from '@utils/toastUtil';
import { getBoardChannelList, GET_LISTMENU_CONTENTS_INFO } from '@store/board';
import BoardsNote from './BoardsNote';

const BoardsEditForm = ({ EditState, EditData, HandleChangeFormData }) => {
    const dispatch = useDispatch();
    const { selectboard, loading, PDS_URL, contentsinfo } = useSelector((store) => ({
        selectboard: store.board.listmenu.selectboard,
        PDS_URL: store.app.PDS_URL,
        contentsinfo: store.board.listmenu.contents.info,
        loading: store.loading[GET_LISTMENU_CONTENTS_INFO],
    }));

    const [channalList, setChannalList] = useState([]); // 채넌 선택.
    const [gubun1, setGubun1] = useState({
        label: null,
        list: [],
    });
    const [gubun2, setGubun2] = useState({
        label: null,
        list: [],
    });
    const [uploadFiles, setUploadFiles] = useState([]); // 등록 파일.
    let fileinputRef = useRef(null);

    const SelectReport = (e) => {
        HandleChangeFormData({
            target: {
                name: 'channelId',
                value: e,
            },
        });
    };

    useEffect(() => {
        const getchannelTypeItem = (channelType) => {
            // BOARD_DIVC1 -> JPOD.
            // BOARD_DIVC2 -> 기자.
            dispatch(
                getBoardChannelList({
                    type: channelType,
                    callback: (element) => {
                        setChannalList(element);
                    },
                }),
            );
        };

        if (selectboard && selectboard.channelType) {
            getchannelTypeItem(selectboard.channelType);
        }
    }, [dispatch, selectboard]);

    // 게시판 정보창 설정.
    useEffect(() => {
        const { boardId } = selectboard;

        // 구분 설정.
        const setBoardGubun = ({ titlePrefixNm1, titlePrefix1, titlePrefixNm2, titlePrefix2 }) => {
            // 첫번째 구분.
            if (titlePrefixNm1 && titlePrefixNm1.length > 0) {
                setGubun1({
                    label: titlePrefixNm1,
                    list: titlePrefix1
                        .split(',')
                        .map((e) => e.replace(' ', ''))
                        .filter((e) => e !== ''),
                });
            }

            if (titlePrefixNm2 && titlePrefix2.length > 0) {
                setGubun2({
                    label: titlePrefixNm2,
                    list: titlePrefix2
                        .split(',')
                        .map((e) => e.replace(' ', ''))
                        .filter((e) => e !== ''),
                });
            }
        };

        if (!isNaN(Number(boardId)) && boardId > 0) {
            setBoardGubun(selectboard);
        }
    }, [selectboard]);

    // 이미지 추가 처리.
    const handleChangeFileInput = (event) => {
        // 게시판 설정 확장자 체크.
        let extCheck = false;
        try {
            let tempFile = event.target.files[0].name.split('.');
            let tempFileExt = tempFile[1];

            if (selectboard.allowFileExt.split(',').indexOf(tempFileExt) < 0) {
                messageBox.alert(`해당 게시판의 첨부 파일은 (${selectboard.allowFileExt}) 만 등록 가능합니다.`, () => {});
            } else {
                extCheck = true;
            }
        } catch (e) {
            throw e;
        }

        if (!extCheck) return;

        if (uploadFiles.length + 1 > selectboard.allowFileCnt) {
            messageBox.alert(`해당 게시판의 첨부 파일 최대 건수는 ${selectboard.allowFileCnt}개 입니다.`, () => {});
        } else {
            setUploadFiles([...uploadFiles, event.target.files[0]]);
        }
        fileinputRef.current.value = '';
    };

    // 이미지 삭제 처리.
    const handleDeleteUploadFile = (stateIndex) => {
        setUploadFiles(uploadFiles.filter((e, i) => i !== stateIndex));
    };

    // 이미지 리스트 클릭시 새텝
    const handleClickImageName = (element) => {
        const { file_url } = element;
        if (file_url) {
            var win = window.open(file_url, '_blank');
            win.focus();
        }
    };

    useEffect(() => {
        HandleChangeFormData({
            target: {
                name: 'attaches',
                value: uploadFiles,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadFiles]);

    useEffect(() => {
        if (loading === false) {
            setUploadFiles(
                EditData.attaches.map((element, i) => {
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

    return (
        <>
            <Form>
                {EditState.mode === 'modify' && (
                    <>
                        <Form.Row>
                            <Col xs={6} className="ft-12">
                                {`${EditData.boardId !== null && EditData.regInfo ? EditData.regInfo : ''}`}
                            </Col>
                            <Col xs={6} className="ft-12">
                                {`${EditData.boardId !== null && EditData.modInfo ? EditData.modInfo : ''}`}
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <MokaInputLabel label={`조회수`} as="none" />
                            <div className="ft-14 flex-fill text-dark text-truncate">
                                <span>{EditData.viewCnt}</span>
                            </div>
                            {(function () {
                                if (selectboard.recomFlag === '1' || selectboard.recomFlag === '2') {
                                    return (
                                        <>
                                            <MokaInputLabel label={`추천`} as="none" />
                                            <div className="ft-14 flex-fill text-dark text-truncate">
                                                <Row className="mb-0 pr-0">
                                                    <Col xs={3} className="mb-0 pr-0">
                                                        <MokaIcon iconName="fad-thumbs-up" size="1x" /> {EditData.recomCnt}
                                                    </Col>
                                                    <Col xs={3} className="mb-0 pr-0">
                                                        <MokaIcon iconName="fad-thumbs-down" size="1x" /> {EditData.decomCnt}
                                                    </Col>
                                                </Row>
                                            </div>
                                        </>
                                    );
                                }
                            })()}
                            {(function () {
                                if (selectboard.declareYn === 'Y') {
                                    return (
                                        <>
                                            <MokaInputLabel label={`신고`} as="none" />
                                            <div className="ft-14 flex-fill text-dark text-truncate">
                                                <span>{EditData.declareCnt}</span>
                                            </div>
                                        </>
                                    );
                                }
                            })()}
                        </Form.Row>
                    </>
                )}
                {(function () {
                    if (loading === false && selectboard.channelType === 'BOARD_DIVC2') {
                        return (
                            <>
                                <BoardRepoterSelect
                                    ChannalList={channalList}
                                    SelectValue={EditData.channelId}
                                    OnChange={(e) => {
                                        SelectReport(e.value);
                                    }}
                                />
                            </>
                        );
                    } else {
                        if (channalList.length > 0) {
                            return (
                                <Form.Row className="mb-2">
                                    <Col xs={6} className="p-0">
                                        <MokaInputLabel
                                            as="select"
                                            label="채널명"
                                            name="channelId"
                                            id="channelId"
                                            value={EditData.channelId}
                                            onChange={(e) => HandleChangeFormData(e)}
                                        >
                                            <option value="">선택</option>
                                            {channalList.map((item, index) => (
                                                <option key={index} value={item.value}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </MokaInputLabel>
                                    </Col>
                                </Form.Row>
                            );
                        }
                    }
                })()}
                {(gubun1.label !== null || gubun2.label !== null) && (
                    <Form.Row className="mb-2">
                        {gubun1.label !== null && (
                            <Col xs={6} className="p-0 pr-20">
                                <MokaInputLabel
                                    as="select"
                                    label={gubun1.label}
                                    name="titlePrefix1"
                                    id="titlePrefix1"
                                    value={EditData.titlePrefix1}
                                    onChange={(e) => HandleChangeFormData(e)}
                                >
                                    <option value="">선택</option>
                                    {gubun1.list.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </MokaInputLabel>
                            </Col>
                        )}

                        {gubun2.label !== null && (
                            <Col xs={6} className="p-0 pl-20">
                                <MokaInputLabel
                                    as="select"
                                    label={gubun2.label}
                                    name="titlePrefix2"
                                    id="titlePrefix2"
                                    value={EditData.titlePrefix2}
                                    onChange={(e) => HandleChangeFormData(e)}
                                >
                                    <option value="">선택</option>
                                    {gubun2.list.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </MokaInputLabel>
                            </Col>
                        )}
                    </Form.Row>
                )}

                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="노출순서"
                        type="number"
                        className="mb-2"
                        id="ordNo"
                        name="ordNo"
                        placeholder={'노출순서'}
                        value={EditData.ordNo}
                        onChange={(e) => HandleChangeFormData(e)}
                    />
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        as="switch"
                        name="pushReceiveYn"
                        id="pushReceiveYn"
                        label="PUSH"
                        inputProps={{ checked: EditData.pushReceiveYn === 'Y' }}
                        onChange={(e) => HandleChangeFormData(e)}
                        value={'Y'}
                    />
                    <span className="ft-12 text-neutral">%게시물 순서를 사용자가 변경 가능</span>
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        as="switch"
                        name="emailReceiveYn"
                        id="emailReceiveYn"
                        className="mr-40"
                        label="발송 이에밀"
                        inputProps={{ checked: EditData.emailReceiveYn === 'Y' }}
                        onChange={(e) => HandleChangeFormData(e)}
                    />

                    <MokaInputLabel
                        label="이메일"
                        labelWidth={40}
                        id="email"
                        className="flex-fill"
                        name="email"
                        placeholder={'이메일'}
                        value={EditData.email}
                        onChange={(e) => HandleChangeFormData(e)}
                    />
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInput
                            className="mb-0"
                            id="title"
                            name="title"
                            placeholder={'제목을 입력해 주세요.'}
                            value={EditData.title}
                            onChange={(e) => HandleChangeFormData(e)}
                        />
                    </Col>
                </Form.Row>
                {/* 기획서에 백오피스는 설정과 관계 없이 에디터를 표현한다고 textarea 는 주석처리. */}
                {/* {selectboard.editorYn === 'N' ? (
                    <Form.Row className="mb-2">
                        <Col className="p-0">
                            <MokaInputLabel
                                as="textarea"
                                className="mb-2"
                                inputClassName="resize-none"
                                inputProps={{ rows: 6 }}
                                id="content"
                                name="content"
                                value={EditData.content}
                                // onChange={(e) => HandleChangeFormData(e)}
                                onChange={(e) => {
                                    dispatch(changeListmenuContent({ content: e.target.value }));
                                    HandleChangeFormData(e);
                                }}
                            />
                        </Col>
                    </Form.Row>
                ) : ( */}
                <BoardsNote editContentData={contentsinfo.content} />
                {/* )} */}

                <hr className="divider" />
                {(function () {
                    if (selectboard.fileYn === 'Y') {
                        return (
                            <>
                                <Form.Row>
                                    <Col xs={4} className="p-0">
                                        <MokaInputLabel label={`첨부파일`} as="none" className="mb-2" />
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
                        );
                    }
                })()}

                {selectboard.allowItem && selectboard.allowItem.split(',').indexOf('EMAIL') >= 0 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label={`이메일`} as="none" />
                        <div className="ft-14 flex-fill text-dark text-truncate">
                            <span>{EditData.addr}</span>
                        </div>
                    </Form.Row>
                )}
                {selectboard.allowItem && selectboard.allowItem.split(',').indexOf('MOBILE_POHONE') >= 0 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label={`휴대폰 번호`} as="none" />
                        <div className="ft-14 flex-fill text-dark text-truncate">
                            <span>{EditData.addr}</span>
                        </div>
                    </Form.Row>
                )}
                {selectboard.allowItem && selectboard.allowItem.split(',').indexOf('ADDR') >= 0 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label={`주소`} as="none" />
                        <div className="ft-14 flex-fill text-dark text-truncate">
                            <span>{EditData.addr}</span>
                        </div>
                    </Form.Row>
                )}
                {selectboard.allowItem && selectboard.allowItem.split(',').indexOf('URL') >= 0 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label={`URL`} as="none" />
                        <div className="ft-14 flex-fill text-dark text-truncate">
                            <span>{EditData.url}</span>
                        </div>
                    </Form.Row>
                )}
            </Form>
        </>
    );
};

export default BoardsEditForm;
