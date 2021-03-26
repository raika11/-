import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaIcon, MokaInputLabel, MokaInput, MokaTableEditCancleButton } from '@components';
import { messageBox } from '@utils/toastUtil';
import { GET_JPOD_NOTICE_CONTENTS } from '@store/jpod';
import BoardsNote from '@/pages/Boards/BoardsList/BoardsEdit/BoardsNote';

/**
 * J팟 관리 > 공지 게시판 > 게시글 편집 폼
 */
const NoticeEditForm = ({ data, onChange }) => {
    const { boardSeq, parentBoardSeq } = useParams();

    const PDS_URL = useSelector((store) => store.app.PDS_URL);
    const jpodBoard = useSelector((store) => store.jpod.jpodNotice.jpodBoard);
    const channelList = useSelector((store) => store.jpod.jpodNotice.channelList);
    const contents = useSelector((store) => store.jpod.jpodNotice.contents);
    const loading = useSelector((store) => store.loading[GET_JPOD_NOTICE_CONTENTS]);

    const [uploadFiles, setUploadFiles] = useState([]); // 등록 파일
    const fileRef = useRef(null);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked, type } = e.target;

        if (type === 'checkbox') {
            onChange({ [name]: checked === true ? 'Y' : 'N' });
        } else {
            onChange({ [name]: value });
        }
    };

    /**
     * 첨부 파일 등록
     */
    const handleChangeFile = (e) => {
        let imageFiles = [];

        if (uploadFiles.length + 1 > jpodBoard.allowFileCnt) {
            messageBox.alert(`해당 게시판의 첨부 파일 최대 건수는 ${jpodBoard.allowFileCnt}개 입니다.`, () => {});
        } else {
            Array.from(e.target.files).forEach((f, idx) => {
                const fileName = f.name.split('.');
                const fileExt = fileName[1];
                if (jpodBoard.allowFileExt.split(',').indexOf(fileExt) > -1) {
                    const seqNo = idx;
                    const imageData = { seqNo, attachFile: f };
                    imageFiles.push(imageData);
                } else {
                    // 허용하는 확장자가 아닐경우
                    messageBox.alert(`해당 게시판의 첨부 파일은 (${jpodBoard.allowFileExt})확장자만 등록할 수 있습니다.`, () => {});
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
        if (!boardSeq) {
            setUploadFiles([]);
        }
    }, [boardSeq]);

    useEffect(() => {
        // 로컬 파일 목록 업데이트 하면 파일 업로드 목록 변경
        onChange({ attaches: uploadFiles });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadFiles]);

    useEffect(() => {
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

    return (
        <>
            <Form>
                {boardSeq && !parentBoardSeq && (
                    <>
                        <Form.Row className="mb-2">
                            <Col xs={6} className="p-0 d-flex align-items-center">
                                <MokaInputLabel label="등록일시" as="none" />
                                <div>
                                    <p className="mb-0">{data.boardSeq && data.regDt ? `${data.regDt}` : ''}</p>
                                    <p className="mb-0">{data.boardSeq && data.regName && data.regId ? `${data.regName}(${data.regId})` : ''}</p>
                                </div>
                            </Col>
                            <Col xs={6} className="p-0 d-flex align-items-center">
                                <MokaInputLabel label="수정일시" as="none" />
                                <div>
                                    <p className="mb-0">{data.boardSeq && data.modDt ? `${data.modDt}` : ''}</p>
                                    <p className="mb-0">{data.boardSeq && data.regName && data.regId ? `${data.regName}(${data.regId})` : ''}</p>
                                </div>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2 align-items-center">
                            <Col xs={4} className="p-0 d-flex">
                                <MokaInputLabel label="조회수" as="none" />
                                <p className="mb-0">{data.viewCnt}</p>
                            </Col>
                            {jpodBoard.recomFlag === '1' && (
                                <Col xs={5} className="p-0 d-flex">
                                    <MokaInputLabel label="추천/비추천" as="none" />
                                    <MokaIcon className="mr-2" iconName="fad-thumbs-up" size="1x" />
                                    <p className="mb-0 mr-4">{data.recomCnt}</p>
                                    <MokaIcon className="mr-2" iconName="fad-thumbs-down" size="1x" />
                                    <p className="mb-0">{data.decomCnt}</p>
                                </Col>
                            )}
                            {jpodBoard.recomFlag === '2' && (
                                <Col xs={5} className="p-0 d-flex">
                                    <MokaInputLabel label="추천" as="none" />
                                    <MokaIcon className="mr-2" iconName="fad-thumbs-up" size="1x" />
                                    <p className="mb-0">{data.recomCnt}</p>
                                </Col>
                            )}
                            {jpodBoard.declareYn === 'Y' && (
                                <Col xs={3} className="p-0 d-flex">
                                    <MokaInputLabel label="신고" as="none" />
                                    <p className="mb-0">{data.declareCnt}</p>
                                </Col>
                            )}
                        </Form.Row>
                    </>
                )}
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
                {/* 분류 */}
                {jpodBoard.boardId && (jpodBoard.titlePrefixNm1 || jpodBoard.titlePrefixNm2) && (
                    <Form.Row className="mb-2">
                        {jpodBoard.titlePrefixNm1 && (
                            <Col xs={6} className={jpodBoard.titlePrefixNm2 ? 'p-0 pr-20' : 'p-0'}>
                                <MokaInputLabel as="select" label={jpodBoard.titlePrefixNm1} name="titlePrefix1" value={data.titlePrefix1} onChange={handleChangeValue}>
                                    <option value="">선택</option>
                                    {jpodBoard.titlePrefix1 &&
                                        jpodBoard.titlePrefix1
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

                        {jpodBoard.titlePrefixNm2 && (
                            <Col xs={6} className={jpodBoard.titlePrefixNm1 ? 'p-0 pl-20' : 'p-0'}>
                                <MokaInputLabel as="select" label={jpodBoard.titlePrefixNm2} name="titlePrefix2" value={data.titlePrefix2} onChange={handleChangeValue}>
                                    <option value="">선택</option>
                                    {jpodBoard.titlePrefix2 &&
                                        jpodBoard.titlePrefix2
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
                {jpodBoard.ordYn === 'Y' && (
                    <Form.Row className="mb-2 align-items-center">
                        <MokaInputLabel label="노출 순서" type="number" name="ordNo" placeholder="노출순서" value={data.ordNo} onChange={handleChangeValue} />
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
                    <BoardsNote data={data.content} jpodBoardId={jpodBoard.boardId} onChangeFormData={onChange} />
                )}
                {jpodBoard.fileYn === 'Y' && (
                    <>
                        <Form.Row>
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

                {jpodBoard.allowItem && jpodBoard.allowItem.split(',').indexOf('EMAIL') > -1 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="이메일" value={contents.email} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
                {jpodBoard.allowItem && jpodBoard.allowItem.split(',').indexOf('MOBILE_POHONE') > -1 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="휴대폰 번호" value={contents.mobilePhone} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
                {jpodBoard.allowItem && jpodBoard.allowItem.split(',').indexOf('ADDR') > -1 && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="주소" value={contents.addr} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
                {jpodBoard.allowItem && jpodBoard.allowItem.split(',').indexOf('URL') > -1 && (
                    <Form.Row>
                        <MokaInputLabel label="URL" value={contents.url} inputProps={{ readOnly: true, plaintext: true }} />
                    </Form.Row>
                )}
            </Form>
        </>
    );
};

export default NoticeEditForm;
