import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@components';
import BackgroundImageForm from './BackgroundImageForm';
// import RelArticleForm from './RelArticleForm';
import RelArticleTable from './RelArticleTable';
import RelationPollModal from '@pages/Survey/Poll/modals/RelationPollModal';

/**
 * 시민마이크 아젠다 폼
 */
const MicAgendaForm = ({ AGENDA_ARTICLE_PROGRESS = [], agenda, onChange, categoryAllList, error, gridInstance, setGridInstance }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [cts, setCts] = useState([]);
    const [show, setShow] = useState(false);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'usedYn' || name === 'agndTop') {
            onChange({ key: name, value: checked ? 'Y' : 'N' });
        } else {
            onChange({ key: name, value });
        }
    };

    /**
     * 공개일 변경
     * @param {object} date 날짜데이터
     */
    const handleDate = (date) => {
        if (typeof date === 'object') {
            onChange({ key: 'agndServiceDt', value: date });
        } else if (date === '') {
            onChange({ key: 'agndServiceDt', value: null });
        }
    };

    /**
     * 카테고리 변경
     * @param {*} value 변경값
     */
    const handleChangeCategory = (value) => onChange({ key: 'categoryList', value });

    useEffect(() => {
        // 카테고리 옵션 변경
        setCategoryOptions(
            categoryAllList.map((c) => ({
                ...c,
                label: c.catNm,
                value: String(c.catSeq),
            })),
        );
    }, [categoryAllList]);

    useEffect(() => {
        // 카테고리 리스트 value, label 셋팅
        let nl = [];
        if (agenda?.categoryList) {
            nl = agenda.categoryList.map((c) => ({
                ...c,
                label: c.catNm,
                value: String(c.catSeq),
            }));
        }
        setCts(nl);
    }, [agenda.categoryList]);

    return (
        <Form>
            {/* 사용여부, 최상단 여부 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    label="사용 여부"
                    className="mr-3"
                    as="switch"
                    name="usedYn"
                    id="usedYn"
                    inputProps={{
                        custom: true,
                        checked: agenda.usedYn === 'Y',
                    }}
                    onChange={handleChangeValue}
                />
                <MokaInputLabel
                    label="최상단 여부"
                    as="switch"
                    name="agndTop"
                    id="agndTop"
                    inputProps={{
                        custom: true,
                        checked: agenda.agndTop === 'Y',
                    }}
                    onChange={handleChangeValue}
                />
            </Form.Row>

            {/* 공개일, 타입 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    label="공개일"
                    className="mr-40"
                    as="dateTimePicker"
                    value={agenda.agndServiceDt}
                    inputProps={{ timeFormat: null, width: 136 }}
                    name="agndServiceDt"
                    onChange={handleDate}
                />
                <MokaInputLabel label="타입" as="select" name="agndType" value={agenda.agndType} onChange={handleChangeValue}>
                    <option value="0">일반</option>
                    <option value="">그외</option>
                </MokaInputLabel>
            </Form.Row>

            {/* 기사화 단계, 관련기사 URL */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="기사화 단계" className="mr-40" as="select" name="artProgress" value={agenda.artProgress} onChange={handleChangeValue}>
                    <option hidden>선택</option>
                    {AGENDA_ARTICLE_PROGRESS.map((progress) => (
                        <option key={progress.code} value={progress.code}>
                            {progress.name}
                        </option>
                    ))}
                </MokaInputLabel>
                <MokaInputLabel label="관련기사 URL" className="flex-fill" name="artLink" value={agenda.artLink} onChange={handleChangeValue} />
            </Form.Row>

            {/* 카테고리 */}
            <MokaInputLabel
                label="카테고리"
                className="mb-2"
                as="autocomplete"
                name="category"
                value={cts}
                inputProps={{ options: categoryOptions, isMulti: true, maxMenuHeight: 250 }}
                onChange={handleChangeCategory}
            />

            {/* 아젠다키워드 */}
            <MokaInputLabel label="아젠다" className="mb-1" name="agndKwd" value={agenda.agndKwd} onChange={handleChangeValue} />
            <div className="d-flex mb-2">
                <MokaInputLabel label=" " as="none" className="mb-0" />
                <p className="mb-0 color-secondary">※ 예) 가계부채</p>
            </div>

            {/* 아젠다 제목 */}
            <MokaInputLabel label="아젠다 제목" className="mb-1" name="agndTitle" value={agenda.agndTitle} onChange={handleChangeValue} isInvalid={error.agndTitle} required />
            <div className="d-flex mb-2">
                <MokaInputLabel label=" " as="none" />
                <p className="mb-0 color-secondary">※ 예) # 가계부채에 대한 # 당신의 생각은 어떠신가요?</p>
            </div>

            {/* 아젠다 본문 */}
            <MokaInputLabel
                label="아젠다 본문"
                className="mb-2"
                as="textarea"
                inputProps={{ rows: 3 }}
                name="agndMemo"
                value={agenda.agndMemo}
                isInvalid={error.agndMemo}
                onChange={handleChangeValue}
                required
            />

            {/* 아젠다 코멘트 */}
            <MokaInputLabel
                label="아젠다 코멘트"
                className="mb-2"
                as="textarea"
                inputProps={{ rows: 3 }}
                name="agndComment"
                value={agenda.agndComment}
                onChange={handleChangeValue}
            />

            {/* 아젠다 리드 */}
            <MokaInputLabel label="아젠다 리드" className="mb-2" as="textarea" inputProps={{ rows: 3 }} name="agndLead" value={agenda.agndLead} onChange={handleChangeValue} />

            {/* 동영상 코드 */}
            <MokaInputLabel label="동영상\nHTML 코드" className="mb-2" as="textarea" inputProps={{ rows: 3 }} name="agndMov" value={agenda.agndMov} onChange={handleChangeValue} />

            {/* 찬반 투표 */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="찬반 투표" className="flex-fill mr-2" value={agenda.pollSeq} disabled />
                <Button variant="searching" className="flex-shrink-0" onClick={() => setShow(true)}>
                    투표 찾기
                </Button>

                {/* 투표 모달 */}
                <RelationPollModal show={show} onHide={() => setShow(false)} />
            </Form.Row>

            {/* 배경이미지 */}
            <BackgroundImageForm className="mb-2 justify-content-between" onChange={onChange} agenda={agenda} />

            <hr className="divider" />

            {/* 관련기사 1,2,3,4 */}
            {/* <RelArticleForm agenda={agenda} onChange={onChange} /> */}
            <RelArticleTable agenda={agenda} gridInstance={gridInstance} setGridInstance={setGridInstance} />
        </Form>
    );
};

export default MicAgendaForm;
