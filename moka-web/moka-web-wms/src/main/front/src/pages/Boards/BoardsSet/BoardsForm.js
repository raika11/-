import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel, MokaInput } from '@components';
// import { selectItem } from '@pages/Boards/BoardConst';
import { MokaEditorCore } from '@/components/MokaEditor';
import FileExtSelector from './components/FileExtSelector';

/**
 * 게시판 관리 > 전체 게시판 > 편집 폼(등록, 수정)
 */
const BoardsForm = ({ loading, channelTypeList, boardInfoData, setBoardInfoData, items, onChange, inputfieldDisabled }) => {
    const { boardInfo } = useSelector((store) => ({
        boardInfo: store.board.setMenu.boardInfo,
    }));

    // Monaco 에디터 내용 설정용 스테이트.
    const [tmpHeaderContent, setTmpHeaderContent] = useState('');
    const [tmpFooterContent, setTmpFooterContent] = useState('');

    useEffect(() => {
        // Monaco 에디터 내용을 따로 스테이트 저장해서 상위에 전달
        onChange({
            target: {
                name: 'headerContent',
                value: tmpHeaderContent,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tmpHeaderContent]);

    useEffect(() => {
        // Monaco 에디터 내용을 따로 스테이트 저장해서 상위에 전달
        onChange({
            target: {
                name: 'footerContent',
                value: tmpFooterContent,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tmpFooterContent]);

    useEffect(() => {
        // Monaco 에디터 내용 처리
        setTmpHeaderContent(boardInfo.headerContent);
        setTmpFooterContent(boardInfo.footerContent);
    }, [loading, boardInfo]);

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
                    onChange={(e) => onChange(e)}
                    value={boardInfoData.usedYn}
                />
            </Form.Row>
            {/* 게시판명 */}
            <MokaInputLabel
                label="게시판명"
                className="mb-2"
                id="boardName"
                name="boardName"
                placeholder={'게시판명'}
                value={boardInfoData.boardName}
                onChange={(e) => onChange(e)}
                required
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
                onChange={(e) => onChange(e)}
            />
            {/* 분류1 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    label="분류1"
                    name="titlePrefixNm1"
                    id="titlePrefixNm1"
                    className="mr-2"
                    value={boardInfoData.titlePrefixNm1}
                    onChange={(e) => onChange(e)}
                    placeholder={`분류 명 입력`}
                />
                <MokaInputLabel
                    className="flex-fill"
                    name="titlePrefix1"
                    id="titlePrefix1"
                    placeholder="분류 값 (,) 포함 100자 이내 입력 가능"
                    value={boardInfoData.titlePrefix1}
                    onChange={(e) => onChange(e)}
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
                    onChange={(e) => onChange(e)}
                    placeholder={`분류 명 입력`}
                />
                <MokaInputLabel
                    id="titlePrefix2"
                    name="titlePrefix2"
                    className="flex-fill"
                    placeholder="분류 값 (,) 포함 100자 이내 입력 가능"
                    value={boardInfoData.titlePrefix2}
                    onChange={(e) => onChange(e)}
                />
            </Form.Row>

            {/* 사용기능 */}
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label={`사용 기능 선택`} as="none" />
                <MokaInput
                    as="checkbox"
                    name="editorYn"
                    id="editorYn"
                    onChange={(e) => onChange(e)}
                    inputProps={{ label: '에디터', custom: true, checked: boardInfoData.editorYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="answYn"
                    id="answYn"
                    onChange={(e) => onChange(e)}
                    inputProps={{ label: '답변', custom: true, checked: boardInfoData.answYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="replyYn"
                    id="replyYn"
                    onChange={(e) => onChange(e)}
                    inputProps={{ label: '댓글', custom: true, checked: boardInfoData.replyYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="declareYn"
                    id="declareYn"
                    onChange={(e) => onChange(e)}
                    inputProps={{ label: '신고', custom: true, checked: boardInfoData.declareYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="captchaYn"
                    id="captchaYn"
                    onChange={(e) => onChange(e)}
                    inputProps={{ label: '캡챠', custom: true, checked: boardInfoData.captchaYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="secretYn"
                    id="secretYn"
                    onChange={(e) => onChange(e)}
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
                    disabled={boardInfoData.answYn !== 'Y' ? true : false}
                    onChange={(e) => {
                        if (boardInfoData.answYn === 'Y') {
                            onChange(e);
                        } else {
                            setBoardInfoData({ ...boardInfoData, emailReceiveYn: 'N' });
                        }
                    }}
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
                    onChange={(e) => onChange(e)}
                    disabled={boardInfoData.answYn !== 'Y' || boardInfoData.emailReceiveYn !== 'Y' ? true : false}
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
                    disabled={boardInfoData.answYn !== 'Y' ? true : false}
                    onChange={(e) => {
                        if (boardInfoData.answYn === 'Y') {
                            onChange(e);
                        } else {
                            setBoardInfoData({ ...boardInfoData, answPushYn: 'N' });
                        }
                    }}
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
                    onChange={(e) => onChange(e)}
                />

                {/* 발신 이메일 */}
                <MokaInputLabel
                    label="이메일"
                    labelWidth={40}
                    className="flex-fill"
                    id="sendEmail"
                    name="sendEmail"
                    placeholder={'이메일'}
                    value={boardInfoData.sendEmail}
                    onChange={(e) => onChange(e)}
                    disabled={boardInfoData.emailSendYn !== 'Y' ? true : false}
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
                    onChange={(e) => onChange(e)}
                    value={boardInfoData.pushYn}
                />
            </Form.Row>

            <Form.Row className="mb-2">
                {/* 입력 권한 */}
                <Col xs={6} className="p-0 pr-40">
                    <MokaInputLabel label={`입력 권한`} as="select" name="insLevel" id="insLevel" value={boardInfoData.insLevel} onChange={(e) => onChange(e)}>
                        <option value="">선택</option>
                        <option value="0">전체</option>
                        <option value="1">회원</option>
                        <option value="2">관리자</option>
                    </MokaInputLabel>
                </Col>

                {/* 조회 권한 */}
                <Col xs={6} className="p-0">
                    <MokaInputLabel label={`조회 권한`} as="select" labelWidth={48} name="viewLevel" id="viewLevel" value={boardInfoData.viewLevel} onChange={(e) => onChange(e)}>
                        <option value="">선택</option>
                        <option value="0">전체</option>
                        <option value="1">회원</option>
                        <option value="2">관리자</option>
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            <Form.Row className="mb-2">
                {/* 답변 권한 */}
                <Col xs={6} className="p-0 pr-40">
                    <MokaInputLabel
                        label={`답변 권한`}
                        as="select"
                        onChange={(e) => onChange(e)}
                        name="answLevel"
                        id="answLevel"
                        value={boardInfoData.answLevel}
                        disabled={boardInfoData.answYn !== 'Y' ? true : false}
                    >
                        <option value="">선택</option>
                        <option value="0">전체</option>
                        <option value="1">회원</option>
                        <option value="2">관리자</option>
                    </MokaInputLabel>
                </Col>

                {/* 추천 */}
                <Col xs={6} className="p-0">
                    <MokaInputLabel label={`추천`} as="select" labelWidth={48} name="recomFlag" id="recomFlag" value={boardInfoData.recomFlag} onChange={(e) => onChange(e)}>
                        <option value="">선택</option>
                        <option value="0">미사용</option>
                        <option value="1">추천/비추천</option>
                        <option value="2">추천만</option>
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            {/* 채널 */}
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0 pr-40">
                    <MokaInputLabel label={`채널`} as="select" name="channelType" id="channelType" value={boardInfoData.channelType} onChange={(e) => onChange(e)}>
                        <option value="">선택</option>
                        {channelTypeList.map((item, index) => (
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
                    onChange={(e) => onChange(e)}
                />
                <Col xs={2} className="p-0 pr-2">
                    <MokaInputLabel
                        label="개수"
                        labelWidth={25}
                        id="allowFileCnt"
                        name="allowFileCnt"
                        value={boardInfoData.allowFileCnt}
                        onChange={(e) => onChange(e)}
                        disabled={boardInfoData.fileYn !== 'Y' ? true : false}
                    />
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel
                        label="용량"
                        labelWidth={25}
                        id="allowFileSize"
                        name="allowFileSize"
                        placeholder={'용량(MB)'}
                        value={boardInfoData.allowFileSize}
                        onChange={(e) => onChange(e)}
                        disabled={boardInfoData.fileYn !== 'Y' ? true : false}
                    />
                </Col>

                {/* 확장자 선택. */}
                <MokaInputLabel label={`확장자`} labelWidth={40} as="none" />

                {/* 확장자 선택 */}
                <FileExtSelector
                    // onChange={(value) => {
                    //     if (value.indexOf('all') > -1) {
                    //         setSearch({ ...search, originCode: 'all' });
                    //     } else {
                    //         setSearch({ ...search, originCode: value });
                    //     }
                    //     setError({ ...error, originCode: false });
                    // }}
                    // isInvalid={error.originCode}
                    value={boardInfoData.allowFileExt}
                    disabled={boardInfoData.fileYn !== 'Y' ? true : false}
                    onChange={(value) => {
                        if (value.indexOf('all') > -1) {
                            setBoardInfoData({ ...boardInfoData, allowFileExt: 'zip,xls,xlsx,ppt,doc,hwp,jpg,png,gif' });
                        } else {
                            setBoardInfoData({ ...boardInfoData, allowFileExt: value });
                        }
                    }}
                />
            </Form.Row>

            {/* 사용 컬럼 선택 */}
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label={`사용 컬럼 선택`} as="none" />

                {/* 주소 */}
                <MokaInput
                    as="checkbox"
                    name="allowItem"
                    id="ADDR"
                    value="ADDR"
                    onChange={(e) => onChange(e)}
                    inputProps={{
                        label: '주소',
                        custom: true,
                        checked: items['ADDR'],
                    }}
                />

                {/* 휴대폰 */}
                <MokaInput
                    as="checkbox"
                    name="allowItem"
                    id="MOBILE_POHONE"
                    value="MOBILE_POHONE"
                    onChange={(e) => onChange(e)}
                    inputProps={{
                        label: '휴대폰',
                        custom: true,
                        checked: items['MOBILE_POHONE'],
                    }}
                />

                {/* 이메일 */}
                <MokaInput
                    as="checkbox"
                    name="allowItem"
                    id="EMAIL"
                    value="EMAIL"
                    onChange={(e) => onChange(e)}
                    inputProps={{
                        label: '이메일',
                        custom: true,
                        checked: items['EMAIL'],
                    }}
                />

                {/* URL */}
                <MokaInput
                    as="checkbox"
                    name="allowItem"
                    id="URL"
                    value="URL"
                    onChange={(e) => onChange(e)}
                    inputProps={{
                        label: 'URL',
                        custom: true,
                        checked: items['URL'],
                    }}
                />
            </Form.Row>

            {/* 순서 지정 여부 */}
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel
                    as="switch"
                    name="ordYn"
                    id="ordYn"
                    label="순서 지정"
                    inputProps={{ checked: boardInfoData.ordYn === 'Y' ? true : false }}
                    onChange={(e) => onChange(e)}
                    value={boardInfoData.ordYn}
                />
                <p className="mb-0 ft-12 text-neutral">&#8251; 게시물 순서를 사용자가 변경 가능</p>
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
            <MokaInputLabel label="서비스페이지 URL" id="boardUrl" name="boardUrl" value={boardInfoData.boardUrl} onChange={(e) => onChange(e)} />
        </Form>
    );
};

export default BoardsForm;
