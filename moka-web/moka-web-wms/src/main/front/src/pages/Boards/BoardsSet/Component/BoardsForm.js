import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel } from '@components';
import { selectItem } from '@pages/Boards/BoardConst';

const BoardsForm = ({ channeltype_list, boardInfoData, storeBoardType, onChange, inputfieldDisabled }) => {
    return (
        <Form>
            {/* 사용 여부 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    as="switch"
                    name="usedYn"
                    id="usedYn"
                    labelWidth={86}
                    label="사용"
                    inputProps={{ checked: boardInfoData.usedYn === 'Y' ? true : false }}
                    onChange={onChange}
                    value={boardInfoData.usedYn}
                />
            </Form.Row>

            {/* 타입 */}
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0">
                    <MokaInputLabel label={`타입`} as="select" labelWidth={86} name="boardType" id="boardType" value={storeBoardType} onChange={onChange}>
                        {selectItem.boardType
                            .filter((item) => item.value === storeBoardType)
                            .map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            {/* 게시판명 */}
            <MokaInputLabel
                label="게시판명"
                labelWidth={86}
                className="mb-2"
                id="boardName"
                name="boardName"
                placeholder={'게시판명'}
                value={boardInfoData.boardName}
                onChange={onChange}
                disabled={false}
            />

            {/* 게시판 설명 */}
            <MokaInputLabel
                label="게시판 설명"
                labelWidth={86}
                className="mb-2"
                name="boardDesc"
                id="boardDesc"
                placeholder={'게시판 설명'}
                value={boardInfoData.boardDesc}
                onChange={onChange}
                disabled={false}
            />

            {/* 말머리1 */}
            <MokaInputLabel
                label="말머리1"
                labelWidth={86}
                className="mb-2"
                id="titlePrefix1"
                name="titlePrefix1"
                value={boardInfoData.titlePrefix1}
                onChange={onChange}
                disabled={false}
            />

            {/* 말머리2 */}
            <MokaInputLabel
                label="말머리2"
                labelWidth={86}
                className="mb-2"
                id="titlePrefix2"
                name="titlePrefix2"
                value={boardInfoData.titlePrefix2}
                onChange={onChange}
                disabled={false}
            />

            {/* 스위치 그룹 */}
            <Form.Row className="mb-2">
                <MokaInputLabel labelWidth={86} as="none" label=" " />

                {/* 에디터 */}
                <MokaInputLabel
                    as="switch"
                    labelWidth={35}
                    name="editorYn"
                    id="editorYn"
                    className="mr-3"
                    label="에디터"
                    inputProps={{ checked: boardInfoData.editorYn === 'Y' ? true : false }}
                    onChange={onChange}
                />

                {/* 답변 */}
                <MokaInputLabel
                    as="switch"
                    name="answYn"
                    id="answYn"
                    className="mr-3"
                    label="답변"
                    labelWidth={25}
                    inputProps={{ checked: boardInfoData.answYn === 'Y' ? true : false }}
                    onChange={onChange}
                />

                {storeBoardType === 'S' && (
                    <>
                        {/* 댓글 */}
                        <MokaInputLabel
                            as="switch"
                            name="replyYn"
                            id="replyYn"
                            className="mr-3"
                            label="댓글"
                            labelWidth={25}
                            inputProps={{ checked: boardInfoData.replyYn === 'Y' ? true : false }}
                            onChange={onChange}
                        />

                        {/* 신고 */}
                        <MokaInputLabel
                            as="switch"
                            name="declareYn"
                            id="declareYn"
                            className="mr-3"
                            label="신고"
                            labelWidth={25}
                            inputProps={{ checked: boardInfoData.declareYn === 'Y' ? true : false }}
                            onChange={onChange}
                        />

                        {/* 캡챠 */}
                        <MokaInputLabel
                            as="switch"
                            name="captchaYn"
                            id="captchaYn"
                            className="mr-3"
                            label="캡챠"
                            labelWidth={25}
                            inputProps={{ checked: boardInfoData.captchaYn === 'Y' ? true : false }}
                            onChange={onChange}
                        />
                    </>
                )}
            </Form.Row>

            {storeBoardType === 'S' && (
                <>
                    {/* 이메일 수신여부 */}
                    <Form.Row className="mb-2">
                        {/* 이메일 수신여부 */}
                        <MokaInputLabel
                            as="switch"
                            labelWidth={86}
                            name="emailReceiveYn"
                            id="emailReceiveYn"
                            className="mr-40"
                            label="이메일 수신여부"
                            inputProps={{ checked: boardInfoData.emailReceiveYn === 'Y' ? true : false }}
                            onChange={onChange}
                        />

                        {/* 이메일 */}
                        <MokaInputLabel
                            label="이메일"
                            labelWidth={40}
                            id="receiveEmail"
                            className="flex-fill"
                            name="receiveEmail"
                            placeholder={'이메일'}
                            value={boardInfoData.receiveEmail}
                            onChange={onChange}
                            disabled={inputfieldDisabled.receiveEmail}
                        />
                    </Form.Row>

                    {/* 이메일 발신여부 */}
                    <Form.Row className="mb-2">
                        {/* 이메일 발신여부 */}
                        <MokaInputLabel
                            as="switch"
                            labelWidth={86}
                            name="emailSendYn"
                            id="emailSendYn"
                            className="mr-40"
                            label="이메일 발신여부"
                            inputProps={{ checked: boardInfoData.emailSendYn === 'Y' ? true : false }}
                            onChange={onChange}
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
                            onChange={onChange}
                            disabled={inputfieldDisabled.sendEmail}
                        />
                    </Form.Row>

                    <Form.Row className="mb-2">
                        <Col xs={6} className="p-0 pr-40">
                            <MokaInputLabel label={`입력등급`} as="select" labelWidth={86} onChange={onChange} name="insLevel" id="insLevel" value={boardInfoData.insLevel}>
                                <option value="">선택</option>
                                {selectItem.insLevel.map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.name}
                                    </option>
                                ))}
                            </MokaInputLabel>
                        </Col>
                        <Col xs={6} className="p-0">
                            <MokaInputLabel label={`조회등급`} as="select" labelWidth={48} onChange={onChange} name="viewLevel" id="viewLevel" value={boardInfoData.viewLevel}>
                                <option value="">선택</option>
                                {selectItem.viewLevel.map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.name}
                                    </option>
                                ))}
                            </MokaInputLabel>
                        </Col>
                    </Form.Row>

                    <Form.Row className="mb-2">
                        <Col xs={6} className="p-0 pr-40">
                            <MokaInputLabel
                                label={`답변등급`}
                                as="select"
                                labelWidth={86}
                                onChange={onChange}
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
                        <Col xs={6} className="p-0">
                            <MokaInputLabel
                                label={`댓글등급`}
                                as="select"
                                labelWidth={48}
                                onChange={onChange}
                                name="replyLevel"
                                id="replyLevel"
                                value={boardInfoData.replyLevel}
                                disabled={inputfieldDisabled.replyLevel}
                            >
                                <option value="">선택</option>
                                {selectItem.replyLevel.map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.name}
                                    </option>
                                ))}
                            </MokaInputLabel>
                        </Col>
                    </Form.Row>
                </>
            )}

            <Form.Row className="mb-2">
                <Col xs={6} className="p-0 pr-40">
                    <MokaInputLabel label={`채널`} as="select" labelWidth={86} onChange={onChange} name="channelType" id="channelType" value={boardInfoData.channelType}>
                        <option value="">선택</option>
                        {channeltype_list.map((item, index) => (
                            <option key={index} value={item.dtlCd}>
                                {item.cdNm}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
                {storeBoardType === 'S' && (
                    <Col xs={6} className="p-0">
                        <MokaInputLabel label={`추천`} as="select" labelWidth={48} onChange={onChange} name="recomFlag" id="recomFlag" value={boardInfoData.recomFlag}>
                            <option value="">선택</option>
                            {selectItem.recomFlag.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                )}
            </Form.Row>

            {/* 파일 */}
            <Form.Row className="mb-2">
                <div className="flex-shrink-0 mr-40">
                    <MokaInputLabel
                        as="switch"
                        labelWidth={86}
                        name="fileYn"
                        id="fileYn"
                        label="파일"
                        inputProps={{ checked: boardInfoData.fileYn === 'Y' ? true : false }}
                        onChange={onChange}
                    />
                </div>

                <MokaInputLabel
                    label="개수"
                    labelWidth={25}
                    className="mr-40"
                    id="allowFileCnt"
                    name="allowFileCnt"
                    value={boardInfoData.allowFileCnt}
                    onChange={onChange}
                    disabled={inputfieldDisabled.allowFileCnt}
                />
                <MokaInputLabel
                    label="용량"
                    labelWidth={25}
                    id="allowFileSize"
                    name="allowFileSize"
                    className="flex-fill"
                    placeholder={'용량(MB)'}
                    value={boardInfoData.allowFileSize}
                    onChange={onChange}
                    disabled={inputfieldDisabled.allowFileSize}
                />
            </Form.Row>

            <Form.Row>
                <MokaInputLabel as="none" label=" " labelWidth={86} style={{ marginRight: 61 }} />
                <MokaInputLabel
                    label="확장자"
                    labelWidth={40}
                    className="flex-fill"
                    id="allowFileExt"
                    name="allowFileExt"
                    placeholder="허용 확장자는 텍스트로 Comma(,)로 구분하여 입력해 주세요"
                    value={boardInfoData.allowFileExt}
                    onChange={onChange}
                    disabled={inputfieldDisabled.allowFileExt}
                />
            </Form.Row>
        </Form>
    );
};

export default BoardsForm;
