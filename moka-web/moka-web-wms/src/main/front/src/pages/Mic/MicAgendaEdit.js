import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInputLabel } from '@/components';

const MicAgendaEdit = () => {
    const [temp, setTemp] = useState({});
    const handleClickSave = () => {};
    const handleClickCancel = () => {};
    const handleClickDelete = () => {};
    const handleClickVote = () => {};

    return (
        <MokaCard
            title="아젠다 수정"
            titleClassName="mb-0"
            className="w-100"
            footerClassName="justify-content-center"
            footer
            footerButtons={[
                { text: '수정', variant: 'positive', className: 'mr-2', onClick: handleClickSave },
                { text: '취소', variant: 'negative', className: 'mr-2', onClick: handleClickCancel },
                { text: '삭제', variant: 'negative', onClick: handleClickDelete },
            ]}
        >
            <Form>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="사용 여부"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0 mr-2"
                        as="switch"
                        name="usedYn"
                        id="switch-menu"
                        inputProps={{
                            custom: true,
                            checked: temp.usedYn === 'Y',
                        }}
                        onChange={
                            (e) => setTemp({ ...temp, usedYn: e.target.checked ? 'Y' : 'N' })
                            // handleChangeValue
                        }
                    />
                    <MokaInputLabel
                        label="최상단 여부"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0"
                        as="switch"
                        name="menu"
                        id="switch-menu"
                        inputProps={{
                            custom: true,
                            checked: temp.menu === 'Y',
                        }}
                        onChange={
                            (e) => setTemp({ ...temp, menu: e.target.checked ? 'Y' : 'N' })
                            // handleChangeValue
                        }
                    />
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="공개일"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0 mr-2"
                        inputClassName=""
                        as="dateTimePicker"
                        value={temp.openDate}
                        inputProps={{ timeFormat: null }}
                        name="startDate"
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setTemp({ ...temp, openDate: date });
                            } else {
                                setTemp({ ...temp, openDate: null });
                            }
                            // handleChangeValue
                        }}
                    />
                    <MokaInputLabel
                        label="타입"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0 mr-2"
                        as="select"
                        name="type"
                        value={temp.type}
                        onChange={(e) => setTemp({ ...temp, type: e.target.value })}
                    >
                        <option value="0">일반</option>
                    </MokaInputLabel>
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="기사화 단계"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0 mr-2"
                        as="select"
                        name="step"
                        value={temp.step}
                        onChange={(e) => setTemp({ ...temp, step: e.target.value })}
                    >
                        <option value="0">미노출</option>
                        <option value="1">의견수렴</option>
                        <option value="2">검토중</option>
                        <option value="3">취재중</option>
                        <option value="4">기사화</option>
                    </MokaInputLabel>
                    <MokaInputLabel
                        label="관련기사 URL"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0"
                        name="articleUrl"
                        value={temp.articleUrl}
                        onChange={(e) => setTemp({ ...temp, articleUrl: e.target.value })}
                    />
                </Form.Row>
                <MokaInputLabel
                    label="카테고리"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="autocomplete"
                    name="category"
                    value={temp.category}
                    onChange={(e) => setTemp({ ...temp, category: e.target.value })}
                />
                <MokaInputLabel
                    label="아젠다"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    name="agenda"
                    value={temp.agenda}
                    onChange={(e) => setTemp({ ...temp, agenda: e.target.value })}
                />
                <p className="ft-12 color-secondary">※ 예) 가계부채</p>
                <MokaInputLabel
                    label="아젠다 제목"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    name="agendaTitle"
                    value={temp.agendaTitle}
                    onChange={(e) => setTemp({ ...temp, agendaTitle: e.target.value })}
                />
                <p className="ft-12 color-secondary">※ 예) # 가계부채에 대한 # 당신의 생각은 어떠신가요?</p>
                <MokaInputLabel
                    label="아젠다 본문"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 3 }}
                    name="agendaContent"
                    value={temp.agendaContent}
                    onChange={(e) => setTemp({ ...temp, agendaContent: e.target.value })}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="아젠다 코멘트"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 3 }}
                    name="agendaComent"
                    value={temp.agendaComent}
                    onChange={(e) => setTemp({ ...temp, agendaComent: e.target.value })}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="아젠다 리드"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 3 }}
                    name="agendaLead"
                    value={temp.agendaLead}
                    onChange={(e) => setTemp({ ...temp, agendaLead: e.target.value })}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="동영상 HTML 코드"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 3 }}
                    name="videoHtml"
                    value={temp.videoHtml}
                    onChange={(e) => setTemp({ ...temp, videoHtml: e.target.value })}
                    // isInvalid={}
                />
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="찬반 투표"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0 mr-2"
                        name="vote"
                        value={temp.vote}
                        onChange={(e) => setTemp({ ...temp, vote: e.target.value })}
                        // isInvalid={}
                    />
                    <Button variant="searching" onClick={handleClickVote}>
                        투표 찾기
                    </Button>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default MicAgendaEdit;
