import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
// import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
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
    const { boardSeq, parentBoardSeq } = useParams();

    const PDS_URL = useSelector((store) => store.app.PDS_URL);
    const selectBoard = useSelector((store) => store.board.listMenu.selectBoard);
    const contentsInfo = useSelector((store) => store.board.listMenu.contents.info);
    const loading = useSelector((store) => store.loading[GET_LIST_MENU_CONTENTS_INFO]);

    const [channalList, setChannalList] = useState([]); // 채널 선택
    const [uploadFiles, setUploadFiles] = useState([]); // 등록 파일
    let fileRef = useRef(null);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked, type } = e.target;

        if (type === 'checkbox') {
            onChangeFormData({ [name]: checked === true ? 'Y' : 'N' });
        } else {
            onChangeFormData({ [name]: value });
        }
    };

    /**
     * 첨부 파일 등록
     */
    const handleChangeFile = (e) => {
        let imageFiles = [];

        if (uploadFiles.length + 1 > selectBoard.allowFileCnt) {
            messageBox.alert(`해당 게시판의 첨부 파일 최대 건수는 ${selectBoard.allowFileCnt}개 입니다.`, () => {});
        } else {
            Array.from(e.target.files).forEach((f, idx) => {
                const fileName = f.name.split('.');
                const fileExt = fileName[1];
                if (selectBoard.allowFileExt.split(',').indexOf(fileExt) > -1) {
                    const seqNo = idx;
                    const imageData = { seqNo, attachFile: f };
                    imageFiles.push(imageData);
                } else {
                    // 허용하는 확장자가 아닐경우
                    messageBox.alert(`해당 게시판의 첨부 파일은 (${selectBoard.allowFileExt})확장자만 등록할 수 있습니다.`, () => {});
                }
            });
        }

        const arr = uploadFiles.concat(imageFiles);
        setUploadFiles(arr);
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
        const { fileUrl } = element;
        if (fileUrl) {
            var win = window.open(fileUrl, '_blank');
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
        onChangeFormData({ attaches: uploadFiles });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadFiles]);

    useEffect(() => {
        // 첨부 파일 셋팅
        if (!loading) {
            setUploadFiles(
                data.attaches.map((file) => {
                    const { filePath, fileName } = file;
                    const fileUrl = PDS_URL && filePath && fileName ? `${PDS_URL}/${filePath}/${fileName}` : '';
                    return {
                        attachFile: {
                            ...file,
                            fileUrl: fileUrl,
                        },
                    };
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    useEffect(() => {
        if (!boardSeq) {
            setUploadFiles([]);
        }
    }, [boardSeq]);

    return (
        <>
            <Form>
                {boardSeq && !parentBoardSeq && (
                    <>
                        <Form.Row className="mb-2">
                            <Col xs={6} className="p-0 d-flex align-items-center">
                                <MokaInputLabel label="등록일시" as="none" labelWidth={50} />
                                <p className="mb-0">{data.boardSeq && data.regDt ? `${data.regDt}` : ''}</p>
                                <p className="mb-0">{data.boardSeq && data.regName && data.regId ? `${data.regName}(${data.regId})` : ''}</p>
                            </Col>
                            <Col xs={6} className="p-0 d-flex align-items-center justify-content-end">
                                <MokaInputLabel label="수정일시" as="none" labelWidth={50} />
                                <p className="mb-0">{data.boardSeq && data.modDt ? `${data.modDt}` : ''}</p>
                                <p className="mb-0">{data.boardSeq && data.regName && data.regId ? `${data.regName}(${data.regId})` : ''}</p>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2 align-items-center">
                            <Col xs={4} className="p-0 d-flex">
                                <MokaInputLabel label="조회수" as="none" />
                                <p className="mb-0">{data.viewCnt}</p>
                            </Col>
                            {selectBoard.recomFlag === '1' && (
                                <Col xs={5} className="p-0 d-flex">
                                    <MokaInputLabel label="추천/비추천" as="none" />
                                    <MokaIcon className="mr-2" iconName="fad-thumbs-up" size="1x" />
                                    <p className="mb-0 mr-4">{data.recomCnt}</p>
                                    <MokaIcon className="mr-2" iconName="fad-thumbs-down" size="1x" />
                                    <p className="mb-0">{data.decomCnt}</p>
                                </Col>
                            )}
                            {selectBoard.recomFlag === '2' && (
                                <Col xs={5} className="p-0 d-flex">
                                    <MokaInputLabel label="추천" as="none" />
                                    <MokaIcon className="mr-2" iconName="fad-thumbs-up" size="1x" />
                                    <p className="mb-0">{data.recomCnt}</p>
                                </Col>
                            )}
                            {selectBoard.declareYn === 'Y' && (
                                <Col xs={3} className="p-0 d-flex">
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
                        <Form.Row className="mb-2">
                            <Col xs={8} className="p-0">
                                <BoardRepoterSelect
                                    channalList={channalList}
                                    selectValue={data.channelId}
                                    onChange={(value) => {
                                        onChangeFormData({
                                            channelId: value,
                                        });
                                    }}
                                />
                            </Col>
                        </Form.Row>
                    ) : (
                        channalList.length > 0 && (
                            <Form.Row className="mb-2">
                                <Col xs={6} className="p-0">
                                    <MokaInputLabel as="select" label="채널명" name="channelId" value={data.channelId} onChange={handleChangeValue}>
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
                {/* 분류 */}
                {selectBoard.boardId && (selectBoard.titlePrefixNm1 || selectBoard.titlePrefixNm2) && (
                    <Form.Row className="mb-2">
                        {selectBoard.titlePrefixNm1 && (
                            <Col xs={6} className={selectBoard.titlePrefixNm2 ? 'p-0 pr-2' : 'p-0'}>
                                <MokaInputLabel
                                    as="select"
                                    label={selectBoard.titlePrefixNm1}
                                    labelWidth={71}
                                    name="titlePrefix1"
                                    value={data.titlePrefix1}
                                    onChange={handleChangeValue}
                                >
                                    <option value="">선택</option>
                                    {selectBoard.titlePrefix1 &&
                                        selectBoard.titlePrefix1
                                            .replaceAll(' ', '')
                                            .split(',')
                                            .map((prefix, idx) => (
                                                <option key={idx} value={prefix}>
                                                    {prefix}
                                                </option>
                                            ))}
                                </MokaInputLabel>
                            </Col>
                        )}

                        {selectBoard.titlePrefixNm2 && (
                            <Col xs={6} className="p-0">
                                <MokaInputLabel
                                    as="select"
                                    label={selectBoard.titlePrefixNm2}
                                    labelWidth={71}
                                    name="titlePrefix2"
                                    value={data.titlePrefix2}
                                    onChange={handleChangeValue}
                                >
                                    <option value="">선택</option>
                                    {selectBoard.titlePrefix2 &&
                                        selectBoard.titlePrefix2
                                            .replaceAll(' ', '')
                                            .split(',')
                                            .map((prefix, idx) => (
                                                <option key={idx} value={prefix}>
                                                    {prefix}
                                                </option>
                                            ))}
                                </MokaInputLabel>
                            </Col>
                        )}
                    </Form.Row>
                )}
                {selectBoard.ordYn === 'Y' && (
                    <Form.Row className="mb-2 align-items-center">
                        <MokaInputLabel label="노출 순서" type="number" name="ordNo" placeholder={'노출순서'} value={data.ordNo} onChange={handleChangeValue} />
                        <p className="mb-0 ml-20 text-neutral">
                            * 공지 글과 같이 상단에 노출되는 경우는 <br />
                            적은 숫자(예: 0)로 입력해주세요
                        </p>
                    </Form.Row>
                )}
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel
                        as="switch"
                        name="pushReceiveYn"
                        id="pushReceiveYn"
                        label="PUSH"
                        inputProps={{ custom: true, checked: data.pushReceiveYn === 'Y', disabled: boardSeq && !parentBoardSeq }}
                        onChange={handleChangeValue}
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
                        onChange={handleChangeValue}
                    />
                    <MokaInputLabel label="이메일" labelWidth={40} className="flex-fill" name="email" placeholder="이메일" value={data.email} onChange={handleChangeValue} />
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInput className="mb-0" name="title" placeholder="제목을 입력해 주세요." value={data.title} onChange={handleChangeValue} />
                </Form.Row>
                {selectBoard.editorYn === 'N' ? (
                    <Form.Row className="mb-4">
                        <Col className="p-0">
                            <MokaInputLabel
                                as="textarea"
                                className="flex-fill"
                                inputClassName="resize-none"
                                inputProps={{ rows: 6 }}
                                name="content"
                                value={data.content}
                                onChange={handleChangeValue}
                            />
                        </Col>
                    </Form.Row>
                ) : (
                    <BoardsNote data={data.content} onChangeFormData={onChangeFormData} />
                )}

                {selectBoard.fileYn === 'Y' && (
                    <>
                        <Form.Row className="mb-2">
                            <Col xs={4} className="p-0">
                                <MokaInputLabel label="첨부파일" as="none" className="mb-2" />
                            </Col>
                            <Col xs={8} className="p-0 text-right">
                                <Button variant="positive" onClick={() => fileRef.current.click()}>
                                    등록
                                </Button>
                                <input type="file" ref={fileRef} onChange={handleChangeFile} className="d-none" />
                            </Col>
                        </Form.Row>
                        {uploadFiles.map((file, index) => {
                            return (
                                <Form.Row className="mb-0 pt-1" key={index}>
                                    <Form.Row className="w-100" style={{ backgroundColor: '#f4f7f9', height: '50px' }}>
                                        <Col xs={11} className="w-100 h-100 d-flex align-items-center justify-content-start">
                                            {/* <Link to={element.fileUrl} target="_blank" download>
                                                {element.name}
                                            </Link> */}
                                            <div onClick={() => handleClickImageName(file.attachFile)}>{file.attachFile.orgFileName || file.attachFile.name}</div>
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
                {selectBoard.allowItem && selectBoard.allowItem.split(',').indexOf('EMAIL') > -1 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="이메일" value={contentsInfo.email} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
                {selectBoard.allowItem && selectBoard.allowItem.split(',').indexOf('MOBILE_POHONE') > -1 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="휴대폰 번호" value={contentsInfo.mobilePhone} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
                {selectBoard.allowItem && selectBoard.allowItem.split(',').indexOf('ADDR') > -1 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="주소" value={contentsInfo.addr} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
                {selectBoard.allowItem && selectBoard.allowItem.split(',').indexOf('URL') > -1 && (
                    <Form.Row>
                        <MokaInputLabel label="URL" value={contentsInfo.url} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
            </Form>
        </>
    );
};

export default BoardsEditForm;
