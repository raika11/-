import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel, MokaPrependLinkInput } from '@components';

const propTypes = {
    /**
     * ABTEST_TYPE
     * A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터
     * @default
     */
    abTestType: PropTypes.string,
};
const defaultProps = {
    abTestType: 'A',
};

/**
 * A/B 테스트 > 탭 > 정보 > 주요 설정폼
 * 공통 UI
 */
const ABMainForm = (props) => {
    const { data = {}, onChange } = props;
    const [disabled, setDisabled] = useState(true);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        let changeData = {};

        changeData[name] = value;
        if (Object.keys(changeData).length > 0) {
            onChange(changeData);
        }
    };

    /**
     * 시작일 변경
     * @param {*} date moment
     */
    const handleChangeStartDt = (date) => (date ? onChange({ startDt: date }) : onChange({ startDt: null }));

    /**
     * 종료일 변경
     * @param {*} date moment
     */
    const handleChangeEndDt = (date) => (date ? onChange({ endDt: date }) : onChange({ endDt: null }));

    useEffect(() => {
        onChange ? setDisabled(false) : setDisabled(true);
    }, [onChange]);

    return (
        <div>
            <MokaInputLabel label="매체" className="mb-2" as="select" value={data.source} required disabled={disabled}>
                <option>매체</option>
            </MokaInputLabel>

            <MokaInputLabel label="설계명" value={data.abTitle} name="abTitle" onChange={handleChangeValue} className="mb-2" required disabled={disabled} />

            <Form.Row className="mb-2">
                <MokaInputLabel label="유형" className="mr-32" disabled={disabled} />
                <MokaInputLabel label="페이지" className="flex-fill" as="select" required disabled={disabled}>
                    <option>메인페이지</option>
                </MokaInputLabel>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label="영역" className="mr-32 flex-fill" as="select" disabled={disabled} required>
                    <option>주요기사-오른쪽</option>
                </MokaInputLabel>
                <MokaInputLabel label="테스트대상" className="flex-fill" as="select" required disabled={disabled}>
                    <option>디자인</option>
                </MokaInputLabel>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label="변수 선택" as="none" />
                <MokaPrependLinkInput linkText="ID 235" inputList={{ as: 'autocomplete', options: [], placeholder: '' }} className="mr-32" />
                <MokaPrependLinkInput linkText="ID 236" inputList={{ as: 'autocomplete', options: [], placeholder: '' }} />
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel
                    label="그룹할당"
                    as="radio"
                    id="grpMethod-r"
                    name="grpMethod"
                    value="R"
                    inputProps={{ label: '랜덤그룹', checked: data.grpMethod === 'R' }}
                    className="mr-32"
                    disabled={disabled}
                    onChange={handleChangeValue}
                />
                <MokaInput
                    as="radio"
                    id="grpMethod-s"
                    name="grpMethod"
                    value="S"
                    inputProps={{ label: '고정그룹', checked: data.grpMethod === 'S' }}
                    disabled={disabled}
                    onChange={handleChangeValue}
                />
            </Form.Row>

            {/* 그룹생성 방식 > 랜덤일 때 노출 */}
            {data.grpMethod === 'R' && (
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel label=" " as="none" />
                    <MokaInputLabel label="A그룹" labelWidth={40} className="mr-2" disabled={disabled} inputProps={{ style: { width: 90 } }} />
                    <span className="mr-32">%</span>
                    <MokaInputLabel label="B그룹" labelWidth={40} className="mr-2" disabled={disabled} inputProps={{ style: { width: 90 } }} />
                    <span>%</span>
                </Form.Row>
            )}

            {/* 그룹생성 방식 > 고정일 때 노출 */}
            {data.grpMethod === 'S' && (
                <React.Fragment>
                    <Form.Row className="mb-2 align-items-center">
                        <MokaInputLabel label=" " as="none" />
                        <MokaInputLabel label="A그룹" labelWidth={40} as="none" />
                        {[...Array(10)].map((x, idx) => (
                            <MokaInput key={`fix-a-${idx}`} value={idx} as="checkbox" id={`fix-a-${idx}`} inputProps={{ label: String(idx) }} disabled={disabled} />
                        ))}
                    </Form.Row>

                    <Form.Row className="mb-2 align-items-center">
                        <MokaInputLabel label=" " as="none" />
                        <MokaInputLabel label="B그룹" labelWidth={40} as="none" />
                        {[...Array(10)].map((x, idx) => (
                            <MokaInput key={`fix-b-${idx}`} value={idx} as="checkbox" id={`fix-b-${idx}`} inputProps={{ label: String(idx) }} disabled={disabled} />
                        ))}
                    </Form.Row>
                </React.Fragment>
            )}

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="기간" as="none" />
                <MokaInputLabel label="시작일시" labelWidth={50} as="dateTimePicker" value={data.startDt} onChange={handleChangeStartDt} className="mr-3" required />
                <MokaInput as="checkbox" id="check-enddt" inputProps={{ label: ' ' }} disabled={disabled} />
                <MokaInputLabel label="종료일시" labelWidth={50} as="dateTimePicker" value={data.endDt} onChange={handleChangeEndDt} inputClassName="right" />
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Col xs={3} className="p-0 align-items-center d-flex">
                    <MokaInput as="checkbox" id="check-time" inputProps={{ label: ' ' }} disabled={disabled} />
                    <MokaInputLabel label="주기" labelWidth={32} className="mr-2" disabled={disabled} />
                    <span>분</span>
                </Col>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="목표 달성" as="checkbox" id="check-aim" inputProps={{ label: '기간' }} disabled={disabled} />
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <div style={{ width: 90 }} className="d-flex align-items-center">
                    <MokaInput as="checkbox" id="check-test" inputProps={{ label: 'KPI 기준' }} disabled={disabled} />
                </div>
                <div style={{ width: 70 }} className="mr-2">
                    <MokaInput name="endKpi" value={data.endKpi} onChange={handleChangeValue} disabled={disabled} />
                </div>
                <span className="mr-2">% 클릭수</span>
                <div style={{ width: 70 }} className="mr-2">
                    <MokaInput name="kpiCntCondi" value={data.kpiCntCondi} onChange={handleChangeValue} disabled={disabled} />
                </div>
                <span>건 이상일 경우</span>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <span className="mr-2" style={{ marginLeft: '22px' }}>
                    시작 후
                </span>
                <div style={{ width: 70 }} className="mr-2">
                    <MokaInput name="kpiPeriodCondi" value={data.kpiPeriodCondi} onChange={handleChangeValue} disabled={disabled} />
                </div>
                <span>분 이후부터 적용</span>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel
                    label="결과반영"
                    as="radio"
                    id="autoApplyYn-n"
                    value="N"
                    name="autoApplyYn"
                    inputProps={{ label: '수동반영', checked: data.autoApplyYn === 'N' }}
                    className="mr-32"
                    onChange={handleChangeValue}
                    disabled={disabled}
                />
                <MokaInput
                    as="radio"
                    id="autoApplyYn-y"
                    value="Y"
                    name="autoApplyYn"
                    inputProps={{ label: '자동반영', checked: data.autoApplyYn === 'Y' }}
                    onChange={handleChangeValue}
                    disabled={disabled}
                />
            </Form.Row>

            <MokaInputLabel label="설명" name="desc" value={data.desc} onChange={handleChangeValue} as="textarea" inputProps={{ rows: 3 }} disabled={disabled} />
        </div>
    );
};

ABMainForm.propTypes = propTypes;
ABMainForm.defaultProps = defaultProps;

export default ABMainForm;
