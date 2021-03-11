import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaInputLabel, MokaInput } from '@components';
import { selectItem } from '@pages/Boards/BoardConst';
import { MokaEditorCore } from '@/components/MokaEditor';
import { useSelector } from 'react-redux';

// import MokaEditor from '@/components/MokaEditor/MokaEditorCore';
import FileExtSelector from './FileExtSelector';

const BoardsForm = ({ loading, channeltype_list, boardInfoData, formInputOnChange, inputfieldDisabled }) => {
    const { boardinfo } = useSelector((store) => ({
        boardinfo: store.board.setmenu.boardinfo,
    }));

    // Monaco 에디터 내용 설정용 스테이트.
    const [tmpHeaderContent, setTmpHeaderContent] = useState('');
    const [tmpFooterContent, setTmpFooterContent] = useState('');

    // Monaco 에디터 내용을 따로 스테이트 저장해서 상위에 전달.
    useEffect(() => {
        formInputOnChange({
            target: {
                name: 'headerContent',
                value: tmpHeaderContent,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tmpHeaderContent]);

    // Monaco 에디터 내용을 따로 스테이트 저장해서 상위에 전달.
    useEffect(() => {
        formInputOnChange({
            target: {
                name: 'footerContent',
                value: tmpFooterContent,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tmpFooterContent]);

    // MOnaco 에디터 내용 처리.
    useEffect(() => {
        setTmpHeaderContent(boardinfo.headerContent);
        setTmpFooterContent(boardinfo.footerContent);
    }, [loading, boardinfo]);

    return (
        <Form>
            {/* 사용 여부 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    as="switch"
                    name="usedYn"
                    id="usedYn"
                    label="사용"
                    inputProps={{ checked: boardInfoData.usedYn === 'Y' ? true : false }}
                    onChange={(e) => formInputOnChange(e)}
                    value={boardInfoData.usedYn}
                />
            </Form.Row>
            {/* 게시판명 */}
            <MokaInputLabel
                label="게시판명"
                className="mb-2"
                required={true}
                id="boardName"
                name="boardName"
                placeholder={'게시판명'}
                value={boardInfoData.boardName}
                onChange={(e) => formInputOnChange(e)}
            />
            {/* 게시판 설명 */}
            <MokaInputLabel
                label="게시판 설명"
                className="mb-2"
                as="textarea"
                name="boardDesc"
                id="boardDesc"
                inputClassName="resize-none"
                inputProps={{ rows: 4 }}
                placeholder={`게시판 설명`}
                value={boardInfoData.boardDesc}
                onChange={(e) => formInputOnChange(e)}
            />
            {/* 분류1 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    label="분류1"
                    name="titlePrefixNm1"
                    id="titlePrefixNm1"
                    className="mr-2"
                    value={boardInfoData.titlePrefixNm1}
                    onChange={(e) => formInputOnChange(e)}
                    placeholder={`분류 명 입력`}
                />
                <MokaInputLabel
                    className="flex-fill"
                    name="titlePrefix1"
                    id="titlePrefix1"
                    placeholder={`전체 채널, 3분 뉴욕커`}
                    value={boardInfoData.titlePrefix1}
                    onChange={(e) => formInputOnChange(e)}
                />
            </Form.Row>
            {/* 분류2 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    label="분류2"
                    id="titlePrefixNm2"
                    name="titlePrefixNm2"
                    className="mr-2"
                    value={boardInfoData.titlePrefixNm2}
                    onChange={(e) => formInputOnChange(e)}
                    placeholder={`분류 명 입력`}
                />
                <MokaInputLabel
                    id="titlePrefix2"
                    name="titlePrefix2"
                    className="flex-fill"
                    placeholder={`분류값 입력`}
                    value={boardInfoData.titlePrefix2}
                    onChange={(e) => formInputOnChange(e)}
                />
            </Form.Row>

            {/* 사용기능 */}
            <Form.Row className="mb-2">
                <MokaInputLabel label={`사용 기능 선택`} as="none" />
                <MokaInput
                    as="checkbox"
                    name="editorYn"
                    id="editorYn"
                    onChange={(e) => formInputOnChange(e)}
                    inputProps={{ label: '에디터', custom: true, checked: boardInfoData.editorYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="answYn"
                    id="answYn"
                    onChange={(e) => formInputOnChange(e)}
                    inputProps={{ label: '답변', custom: true, checked: boardInfoData.answYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="replyYn"
                    id="replyYn"
                    onChange={(e) => formInputOnChange(e)}
                    inputProps={{ label: '댓글', custom: true, checked: boardInfoData.replyYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="declareYn"
                    id="declareYn"
                    onChange={(e) => formInputOnChange(e)}
                    inputProps={{ label: '신고', custom: true, checked: boardInfoData.declareYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="captchaYn"
                    id="captchaYn"
                    onChange={(e) => formInputOnChange(e)}
                    inputProps={{ label: '캡챠', custom: true, checked: boardInfoData.captchaYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="secretYn"
                    id="secretYn"
                    onChange={(e) => formInputOnChange(e)}
                    inputProps={{ label: '비밀글', custom: true, checked: boardInfoData.secretYn === 'Y' ? true : false }}
                />
            </Form.Row>

            {/* 답변 메일 */}
            <Form.Row className="mb-2">
                {/* 이메일 수신여부 */}
                <MokaInputLabel
                    as="switch"
                    name="emailReceiveYn"
                    id="emailReceiveYn"
                    className="mr-40"
                    label="답변 메일 발신"
                    inputProps={{ checked: boardInfoData.emailReceiveYn === 'Y' ? true : false }}
                    onChange={(e) => formInputOnChange(e)}
                />

                {/* 이메일 */}
                <MokaInputLabel
                    label="이메일"
                    labelWidth={40}
                    id="receiveEmail"
                    className="flex-fill"
                    name="receiveEmail"
                    placeholder={`이메일`}
                    value={boardInfoData.receiveEmail}
                    onChange={(e) => formInputOnChange(e)}
                    disabled={inputfieldDisabled.receiveEmail}
                />
            </Form.Row>

            {/* 답변 PUSH */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    as="switch"
                    name="answPushYn"
                    id="answPushYn"
                    label="답변 PUSH 발송"
                    inputProps={{ checked: boardInfoData.answPushYn === 'Y' ? true : false }}
                    onChange={(e) => formInputOnChange(e)}
                    value={boardInfoData.answPushYn}
                />
            </Form.Row>

            {/* 이메일 발신여부 */}
            <Form.Row className="mb-2">
                {/* 이메일 발신여부 */}
                <MokaInputLabel
                    as="switch"
                    name="emailSendYn"
                    id="emailSendYn"
                    className="mr-40"
                    label="게시물 메일 수신"
                    inputProps={{ checked: boardInfoData.emailSendYn === 'Y' ? true : false }}
                    onChange={(e) => formInputOnChange(e)}
                />

                {/*  발신 이메일 */}
                <MokaInputLabel
                    label="이메일"
                    labelWidth={40}
                    className="flex-fill"
                    id="sendEmail"
                    name="sendEmail"
                    placeholder={'이메일'}
                    value={boardInfoData.sendEmail}
                    onChange={(e) => formInputOnChange(e)}
                    disabled={inputfieldDisabled.sendEmail}
                />
            </Form.Row>

            {/* 작성글 PUSH */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    as="switch"
                    name="pushYn"
                    id="pushYn"
                    label="작성글 PUSH 발송"
                    inputProps={{ checked: boardInfoData.pushYn === 'Y' ? true : false }}
                    onChange={(e) => formInputOnChange(e)}
                    value={boardInfoData.pushYn}
                />
            </Form.Row>

            {/* 입력권한 */}
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0 pr-40">
                    <MokaInputLabel label={`입력권한`} as="select" name="insLevel" id="insLevel" value={boardInfoData.insLevel} onChange={(e) => formInputOnChange(e)}>
                        <option value="">선택</option>
                        {selectItem.insLevel.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>

                {/* 조회권한 */}
                <Col xs={6} className="p-0">
                    <MokaInputLabel
                        label={`조회권한`}
                        as="select"
                        labelWidth={48}
                        name="viewLevel"
                        id="viewLevel"
                        value={boardInfoData.viewLevel}
                        onChange={(e) => formInputOnChange(e)}
                    >
                        <option value="">선택</option>
                        {selectItem.viewLevel.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            {/* 답변권한 */}
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0 pr-40">
                    <MokaInputLabel
                        label={`답변권한`}
                        as="select"
                        onChange={(e) => formInputOnChange(e)}
                        name="answLevel"
                        id="answLevel"
                        value={boardInfoData.answLevel}
                        disabled={inputfieldDisabled.answLevel}
                    >
                        <option value="">선택</option>
                        {selectItem.answLevel.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>

                {/* 추천 */}
                <Col xs={6} className="p-0">
                    <MokaInputLabel
                        label={`추천`}
                        as="select"
                        labelWidth={48}
                        name="recomFlag"
                        id="recomFlag"
                        value={boardInfoData.recomFlag}
                        onChange={(e) => formInputOnChange(e)}
                    >
                        <option value="">선택</option>
                        {selectItem.recomFlag.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            {/* 채널 */}
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0 pr-40">
                    <MokaInputLabel label={`채널`} as="select" name="channelType" id="channelType" value={boardInfoData.channelType} onChange={(e) => formInputOnChange(e)}>
                        <option value="">선택</option>
                        {channeltype_list.map((item, index) => (
                            <option key={index} value={item.dtlCd}>
                                {item.cdNm}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            {/* 파일 정보*/}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    as="switch"
                    name="fileYn"
                    id="fileYn"
                    label="파일"
                    className="mr-2"
                    inputProps={{ checked: boardInfoData.fileYn === 'Y' ? true : false }}
                    onChange={(e) => formInputOnChange(e)}
                />
                <MokaInputLabel
                    label="개수"
                    labelWidth={25}
                    className="mr-2"
                    id="allowFileCnt"
                    name="allowFileCnt"
                    value={boardInfoData.allowFileCnt}
                    onChange={(e) => formInputOnChange(e)}
                    disabled={inputfieldDisabled.allowFileCnt}
                />
                <MokaInputLabel
                    label="용량"
                    labelWidth={25}
                    id="allowFileSize"
                    name="allowFileSize"
                    // className="flex-fill"
                    className="mr-2"
                    placeholder={'용량(MB)'}
                    value={boardInfoData.allowFileSize}
                    onChange={(e) => formInputOnChange(e)}
                    disabled={inputfieldDisabled.allowFileSize}
                />

                {/* 확장자 선택. */}
                <MokaInputLabel label={`확장자`} labelClaaName="pr-1" labelWidth={30} as="none" />

                {/* 확장자 선택 */}
                <FileExtSelector value={boardInfoData.allowFileExt} disabled={inputfieldDisabled.allowFileExt} selectChange={(e) => formInputOnChange(e)} />
            </Form.Row>

            {/* 사용 컬럼 선택 */}
            <Form.Row className="mb-2">
                <MokaInputLabel label={`사용 컬럼 선택`} as="none" />

                {/* 주소 */}
                <MokaInput
                    as="checkbox"
                    name="allowItem-ADDR"
                    id="allowItem-ADDR"
                    onChange={(e) => formInputOnChange(e)}
                    inputProps={{
                        label: '주소',
                        custom: true,
                        checked:
                            boardInfoData.allowItem
                                .split(',')
                                .map((e) => e.replace(' ', ''))
                                .indexOf('ADDR') < 0
                                ? false
                                : true,
                    }}
                />

                {/* 휴대폰 */}
                <MokaInput
                    as="checkbox"
                    name="allowItem-MOBILE_POHONE"
                    id="allowItem-MOBILE_POHONE"
                    onChange={(e) => formInputOnChange(e)}
                    inputProps={{
                        label: '휴대폰',
                        custom: true,
                        checked:
                            boardInfoData.allowItem
                                .split(',')
                                .map((e) => e.replace(' ', ''))
                                .indexOf('MOBILE_POHONE') < 0
                                ? false
                                : true,
                    }}
                />

                {/* 이메일 */}
                <MokaInput
                    as="checkbox"
                    name="allowItem-EMAIL"
                    id="allowItem-EMAIL"
                    onChange={(e) => formInputOnChange(e)}
                    inputProps={{
                        label: '이메일',
                        custom: true,
                        checked:
                            boardInfoData.allowItem
                                .split(',')
                                .map((e) => e.replace(' ', ''))
                                .indexOf('EMAIL') < 0
                                ? false
                                : true,
                    }}
                />

                {/* URL */}
                <MokaInput
                    as="checkbox"
                    name="allowItem-URL"
                    id="allowItem-URL"
                    onChange={(e) => formInputOnChange(e)}
                    inputProps={{
                        label: 'URL',
                        custom: true,
                        checked:
                            boardInfoData.allowItem
                                .split(',')
                                .map((e) => e.replace(' ', ''))
                                .indexOf('URL') < 0
                                ? false
                                : true,
                    }}
                />
            </Form.Row>

            {/* 순서 지정 여부 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    as="switch"
                    name="ordYn"
                    id="ordYn"
                    label="순서 지정"
                    inputProps={{ checked: boardInfoData.ordYn === 'Y' ? true : false }}
                    onChange={(e) => formInputOnChange(e)}
                    value={boardInfoData.ordYn}
                />
                <Col>
                    <span className="ft-12 text-neutral">%게시물 순서를 사용자가 변경 가능</span>
                </Col>
            </Form.Row>

            {/* 게시판 헤더 */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="헤더" as="none" />
                <div className="flex-fill input-border overflow-hidden" style={{ height: '200px' }}>
                    {loading === false && <MokaEditorCore value={tmpHeaderContent} onBlur={(value) => setTmpHeaderContent(value)} />}
                </div>
            </Form.Row>

            {/* 게시판 푸터 */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="푸터" as="none" />
                <div className="flex-fill input-border overflow-hidden" style={{ height: '200px' }}>
                    {loading === false && <MokaEditorCore value={tmpFooterContent} onBlur={(value) => setTmpFooterContent(value)} />}
                </div>
            </Form.Row>

            {/* 서비스 URL */}
            <MokaInputLabel label="서비스페이지 URL" id="boardUrl" name="boardUrl" value={boardInfoData.boardUrl} onChange={(e) => formInputOnChange(e)} />
        </Form>
    );
};

export default BoardsForm;
