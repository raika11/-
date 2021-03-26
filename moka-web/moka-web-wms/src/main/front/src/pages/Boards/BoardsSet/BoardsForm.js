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
const BoardsForm = ({ channelTypeList, boardInfoData, onChange, error, setError }) => {
    const { boardInfo } = useSelector((store) => ({
        boardInfo: store.board.setMenu.boardInfo,
    }));

    // 게시판 체크박스 컬럼 state
    const [items, setItems] = useState({
        ADDR: false,
        MOBILE_POHONE: false,
        EMAIL: false,
        URL: false,
    });

    // Monaco 에디터 내용 설정용 스테이트
    const [tmpHeaderContent, setTmpHeaderContent] = useState('');
    const [tmpFooterContent, setTmpFooterContent] = useState('');

    const handleChangeValue = (e) => {
        const { name, value, checked, type } = e.target;
        if (name === 'usedYn' || name === 'emailReceiveYn' || name === 'answPushYn' || name === 'emailSendYn' || name === 'pushYn' || name === 'fileYn' || name === 'ordYn') {
            onChange({ [name]: checked ? 'Y' : 'N' });
        } else if (type === 'checkbox') {
            // 답변 checkbox 버튼 checked시 답변메일 발신, 답변 PUSH 발송 활성화
            if (name === 'allowItem') {
                // 로컬 state 사용 컬럼 상태 업데이트
                setItems({ ...items, [value]: checked ? true : false });
            } else {
                onChange({ [name]: checked ? 'Y' : 'N' });
            }
        } else {
            onChange({ [name]: value });
        }

        if (error[name]) {
            setError({ ...error, [name]: false });
        }
    };

    useEffect(() => {
        let itemArr = [];
        Object.keys(items).forEach((i) => {
            if (items[i]) {
                itemArr.push(i);
            }
        });

        if (itemArr.length > 0) {
            onChange({ allowItem: itemArr.join(',') });
        } else {
            onChange({ allowItem: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    useEffect(() => {
        // allowItem이 있으면 로컬 체크박스 컬럼 state 변경
        if (boardInfoData.allowItem) {
            let ai = boardInfoData.allowItem.split(',');
            const findItem = (el) => ai.find((i) => i === el);

            setItems({
                ...items,
                ADDR: findItem('ADDR') ? true : false,
                MOBILE_POHONE: findItem('MOBILE_POHONE') ? true : false,
                EMAIL: findItem('EMAIL') ? true : false,
                URL: findItem('URL') ? true : false,
            });
        } else {
            setItems({ ...items, ADDR: false, MOBILE_POHONE: false, EMAIL: false, URL: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardInfoData.allowItem]);

    useEffect(() => {
        // Monaco 에디터 내용을 따로 스테이트 저장해서 상위에 전달
        onChange({
            headerContent: tmpHeaderContent,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tmpHeaderContent]);

    useEffect(() => {
        // Monaco 에디터 내용을 따로 스테이트 저장해서 상위에 전달
        onChange({
            footerContent: tmpFooterContent,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tmpFooterContent]);

    useEffect(() => {
        // Monaco 에디터 내용 처리
        setTmpHeaderContent(boardInfo.headerContent);
        setTmpFooterContent(boardInfo.footerContent);
    }, [boardInfo]);

    return (
        <Form>
            {/* 사용 여부 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    as="switch"
                    name="usedYn"
                    id="usedYn"
                    label="사용"
                    inputProps={{ custom: true, checked: boardInfoData.usedYn === 'Y' ? true : false }}
                    onChange={handleChangeValue}
                    value={boardInfoData.usedYn}
                />
            </Form.Row>
            {/* 게시판명 */}
            <MokaInputLabel
                label="게시판명"
                className="mb-2"
                name="boardName"
                placeholder="게시판명"
                value={boardInfoData.boardName}
                onChange={handleChangeValue}
                isInvalid={error.boardName}
                required
            />
            {/* 게시판 설명 */}
            <MokaInputLabel
                label="게시판 설명"
                className="mb-2"
                as="textarea"
                name="boardDesc"
                inputClassName="resize-none"
                inputProps={{ rows: 4 }}
                placeholder="게시판 설명"
                value={boardInfoData.boardDesc}
                onChange={handleChangeValue}
            />
            {/* 분류1 */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="분류1" name="titlePrefixNm1" className="mr-2" value={boardInfoData.titlePrefixNm1} onChange={handleChangeValue} placeholder="분류 명 입력" />
                <MokaInputLabel
                    className="flex-fill"
                    name="titlePrefix1"
                    placeholder="분류 값 (,) 포함 100자 이내 입력 가능"
                    value={boardInfoData.titlePrefix1}
                    onChange={handleChangeValue}
                />
            </Form.Row>
            {/* 분류2 */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="분류2" name="titlePrefixNm2" className="mr-2" value={boardInfoData.titlePrefixNm2} onChange={handleChangeValue} placeholder="분류 명 입력" />
                <MokaInputLabel
                    name="titlePrefix2"
                    className="flex-fill"
                    placeholder="분류 값 (,) 포함 100자 이내 입력 가능"
                    value={boardInfoData.titlePrefix2}
                    onChange={handleChangeValue}
                />
            </Form.Row>

            {/* 사용기능 */}
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="사용 기능" as="none" />
                <MokaInput
                    as="checkbox"
                    name="editorYn"
                    id="editorYn"
                    onChange={handleChangeValue}
                    inputProps={{ label: '에디터', custom: true, checked: boardInfoData.editorYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="answYn"
                    id="answYn"
                    onChange={handleChangeValue}
                    inputProps={{ label: '답변', custom: true, checked: boardInfoData.answYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="replyYn"
                    id="replyYn"
                    onChange={handleChangeValue}
                    inputProps={{ label: '댓글', custom: true, checked: boardInfoData.replyYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="declareYn"
                    id="declareYn"
                    onChange={handleChangeValue}
                    inputProps={{ label: '신고', custom: true, checked: boardInfoData.declareYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="captchaYn"
                    id="captchaYn"
                    onChange={handleChangeValue}
                    inputProps={{ label: '캡챠', custom: true, checked: boardInfoData.captchaYn === 'Y' ? true : false }}
                />
                <MokaInput
                    as="checkbox"
                    name="secretYn"
                    id="secretYn"
                    onChange={handleChangeValue}
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
                    label="답변 메일"
                    inputProps={{ custom: true, checked: boardInfoData.emailReceiveYn === 'Y' ? true : false }}
                    disabled={boardInfoData.answYn !== 'Y' ? true : false}
                    onChange={handleChangeValue}
                />

                {/* 이메일 */}
                <MokaInputLabel
                    label="발신 이메일"
                    className="flex-fill"
                    name="receiveEmail"
                    placeholder="이메일"
                    value={boardInfoData.receiveEmail}
                    isInvalid={error.receiveEmail}
                    onChange={handleChangeValue}
                    disabled={boardInfoData.answYn !== 'Y' || boardInfoData.emailReceiveYn !== 'Y' ? true : false}
                />
            </Form.Row>

            {/* 답변 PUSH, 작성글 PUSH */}
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel
                    as="switch"
                    name="answPushYn"
                    className="mr-40"
                    id="answPushYn"
                    label="PUSH 발송"
                    inputProps={{ custom: true, label: '답변', checked: boardInfoData.answPushYn === 'Y' ? true : false }}
                    disabled={boardInfoData.answYn !== 'Y' ? true : false}
                    onChange={handleChangeValue}
                    value={boardInfoData.answPushYn}
                />

                <MokaInput
                    as="switch"
                    name="pushYn"
                    id="pushYn"
                    inputProps={{ custom: true, label: '작성글', checked: boardInfoData.pushYn === 'Y' ? true : false }}
                    onChange={handleChangeValue}
                    value={boardInfoData.pushYn}
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
                    label="게시물 메일"
                    inputProps={{ custom: true, checked: boardInfoData.emailSendYn === 'Y' ? true : false }}
                    onChange={handleChangeValue}
                />

                {/* 발신 이메일 */}
                <MokaInputLabel
                    label="수신 이메일"
                    className="flex-fill"
                    name="sendEmail"
                    placeholder="이메일"
                    isInvalid={error.sendEmail}
                    value={boardInfoData.sendEmail}
                    onChange={handleChangeValue}
                    disabled={boardInfoData.emailSendYn !== 'Y' ? true : false}
                />
            </Form.Row>

            <Form.Row className="mb-2">
                {/* 입력 권한 */}
                <Col xs={6} className="p-0 pr-40">
                    <MokaInputLabel label="입력 권한" as="select" name="insLevel" id="insLevel" value={boardInfoData.insLevel} onChange={handleChangeValue}>
                        <option value="">선택</option>
                        <option value="0">전체</option>
                        <option value="1">회원</option>
                        <option value="9">관리자</option>
                    </MokaInputLabel>
                </Col>

                {/* 조회 권한 */}
                <Col xs={6} className="p-0">
                    <MokaInputLabel label="조회 권한" as="select" name="viewLevel" id="viewLevel" value={boardInfoData.viewLevel} onChange={handleChangeValue}>
                        <option value="">선택</option>
                        <option value="0">전체</option>
                        <option value="1">회원</option>
                        <option value="9">관리자</option>
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            <Form.Row className="mb-2">
                {/* 답변 권한 */}
                <Col xs={6} className="p-0 pr-40">
                    <MokaInputLabel
                        label="답변 권한"
                        as="select"
                        onChange={handleChangeValue}
                        name="answLevel"
                        id="answLevel"
                        value={boardInfoData.answLevel}
                        isInvalid={error.answLevel}
                        disabled={boardInfoData.answYn !== 'Y' ? true : false}
                    >
                        <option value="">선택</option>
                        <option value="0">전체</option>
                        <option value="1">회원</option>
                        <option value="9">관리자</option>
                    </MokaInputLabel>
                </Col>

                {/* 추천 */}
                <Col xs={6} className="p-0">
                    <MokaInputLabel label="추천" as="select" name="recomFlag" id="recomFlag" value={boardInfoData.recomFlag} onChange={handleChangeValue}>
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
                    <MokaInputLabel label="채널" as="select" name="channelType" id="channelType" value={boardInfoData.channelType} onChange={handleChangeValue}>
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
                    inputProps={{ custom: true, checked: boardInfoData.fileYn === 'Y' ? true : false }}
                    onChange={handleChangeValue}
                />
                <Col xs={2} className="p-0 pr-2">
                    <MokaInputLabel
                        label="개수"
                        labelWidth={25}
                        name="allowFileCnt"
                        value={boardInfoData.allowFileCnt}
                        isInvalid={error.allowFileCnt}
                        onChange={handleChangeValue}
                        disabled={boardInfoData.fileYn !== 'Y' ? true : false}
                    />
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel
                        label="용량"
                        labelWidth={25}
                        name="allowFileSize"
                        placeholder="용량(MB)"
                        value={boardInfoData.allowFileSize}
                        isInvalid={error.allowFileSize}
                        onChange={handleChangeValue}
                        disabled={boardInfoData.fileYn !== 'Y' ? true : false}
                    />
                </Col>

                {/* 확장자 선택. */}
                <MokaInputLabel label="확장자" labelWidth={40} as="none" />

                {/* 확장자 선택 */}
                <FileExtSelector
                    value={boardInfoData.allowFileExt}
                    disabled={boardInfoData.fileYn !== 'Y' ? true : false}
                    onChange={(value) => {
                        if (value.indexOf('all') > -1) {
                            onChange({
                                name: 'allowFileExt',
                                value: 'zip,xls,xlsx,ppt,doc,hwp,jpg,png,gif',
                            });
                        } else {
                            onChange({
                                name: 'allowFileExt',
                                value: value,
                            });
                        }
                        setError({ ...error, allowFileExt: false });
                    }}
                    isInvalid={error.allowFileExt}
                />
            </Form.Row>

            {/* 사용 컬럼 선택 */}
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="사용 컬럼" as="none" />

                {/* 주소 */}
                <MokaInput
                    as="checkbox"
                    name="allowItem"
                    id="ADDR"
                    value="ADDR"
                    onChange={handleChangeValue}
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
                    onChange={handleChangeValue}
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
                    onChange={handleChangeValue}
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
                    onChange={handleChangeValue}
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
                    inputProps={{ custom: true, checked: boardInfoData.ordYn === 'Y' ? true : false }}
                    onChange={handleChangeValue}
                    value={boardInfoData.ordYn}
                />
                <p className="mb-0 ft-12 text-neutral">&#8251; 게시물 순서를 사용자가 변경 가능</p>
            </Form.Row>

            {/* 게시판 헤더 */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="헤더" as="none" />
                <div className="flex-fill input-border overflow-hidden" style={{ height: '200px' }}>
                    <MokaEditorCore value={tmpHeaderContent} onBlur={(value) => setTmpHeaderContent(value)} />
                </div>
            </Form.Row>

            {/* 게시판 푸터 */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="푸터" as="none" />
                <div className="flex-fill input-border overflow-hidden" style={{ height: '200px' }}>
                    <MokaEditorCore value={tmpFooterContent} onBlur={(value) => setTmpFooterContent(value)} />
                </div>
            </Form.Row>

            {/* 서비스 URL */}
            <MokaInputLabel label="서비스\n페이지 URL" id="boardUrl" name="boardUrl" value={boardInfoData.boardUrl} onChange={handleChangeValue} />
        </Form>
    );
};

export default BoardsForm;
