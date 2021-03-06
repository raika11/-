import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel, MokaPrependLinkInput } from '@components';
import commonUtil from '@utils/commonUtil';
import useDebounce from '@hooks/useDebounce';
import ABFixGroupAreaSelect from '@pages/AB/components/ABFixGroupAreaSelect';

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

function areEqual(prevProps, nextProps) {
    let areEqual = false;
    if (!commonUtil.isEmpty(prevProps.data) && !commonUtil.isEmpty(nextProps.data)) {
        if (prevProps.data.abtestSeq === nextProps.data.abtestSeq) {
            areEqual = true;
        }
    }

    return areEqual;
}

/**
 * A/B 테스트 > 탭 > 정보 > 주요 설정폼
 * 공통 UI
 */
const ABMainForm = (props) => {
    const { data: abtestInfo, onChange } = props;
    const [disabled, setDisabled] = useState(true);
    const [data, setData] = useState({});

    const handleDebounce = useDebounce(onChange, 200);
    /**
     * 입력값 변경
     */
    const handleChangeValue = ({ name, value }) => {
        const changeData = { ...data, [name]: value };
        setData(changeData);
        handleDebounce(changeData);
    };

    useEffect(() => {
        onChange ? setDisabled(false) : setDisabled(true);
    }, [onChange]);

    useEffect(() => {
        if (!commonUtil.isEmpty(abtestInfo)) {
            setData(abtestInfo);
        }
    }, [abtestInfo]);

    return (
        <div>
            <MokaInputLabel label="매체" className="mb-2" as="select" value={data.source} required disabled={disabled}>
                <option>매체</option>
            </MokaInputLabel>

            <MokaInputLabel
                label="설계명"
                value={data.abtestTitle}
                name="abtestTitle"
                onChange={(e) => {
                    handleChangeValue(e.target);
                }}
                className="mb-2"
                required
                disabled={disabled}
            />

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
                    id="abtestGrpMethod-r"
                    name="abtestGrpMethod"
                    value="R"
                    inputProps={{ label: '랜덤그룹', checked: data.abtestGrpMethod === 'R' }}
                    className="mr-32"
                    disabled={disabled}
                    onChange={(e) => {
                        handleChangeValue(e.target);
                    }}
                />
                <MokaInput
                    as="radio"
                    id="abtestGrpMethod-s"
                    name="abtestGrpMethod"
                    value="S"
                    inputProps={{ label: '고정그룹', checked: data.abtestGrpMethod === 'S' }}
                    disabled={disabled}
                    onChange={(e) => {
                        handleChangeValue(e.target);
                    }}
                />
            </Form.Row>

            {/* 그룹생성 방식 > 랜덤일 때 노출 */}
            {data.abtestGrpMethod === 'R' && (
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel label=" " as="none" />
                    <MokaInputLabel
                        label="A그룹"
                        type="number"
                        name="abtestRandomGrpA"
                        labelWidth={40}
                        className="mr-2"
                        disabled={disabled}
                        inputProps={{ style: { width: 90 } }}
                        value={data.abtestRandomGrpA}
                        onChange={(e) => {
                            handleChangeValue(e.target);
                        }}
                    />
                    <span className="mr-32">%</span>
                    <MokaInputLabel
                        label="B그룹"
                        type="number"
                        name="abtestRandomGrpB"
                        labelWidth={40}
                        className="mr-2"
                        disabled={disabled}
                        inputProps={{ style: { width: 90 } }}
                        value={data.abtestRandomGrpB}
                        onChange={(e) => {
                            handleChangeValue(e.target);
                        }}
                    />
                    <span>%</span>
                </Form.Row>
            )}

            {/* 그룹생성 방식 > 고정일 때 노출 */}
            {data.abtestGrpMethod === 'S' && (
                <ABFixGroupAreaSelect
                    aGroup={data.abtestFixGrpA}
                    bGroup={data.abtestFixGrpB}
                    onChange={(abGroup) => {
                        const changeData = { ...data, ...abGroup };
                        onChange(changeData);
                    }}
                />
            )}

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="기간" as="none" />
                <MokaInputLabel
                    label="시작일시"
                    labelWidth={50}
                    as="dateTimePicker"
                    value={data.startDt}
                    onChange={(date) => {
                        handleChangeValue({ name: 'startDt', value: date });
                    }}
                    className="mr-3"
                    required
                />
                <MokaInput as="checkbox" id="check-enddt" inputProps={{ label: ' ' }} disabled={disabled} />
                <MokaInputLabel
                    label="종료일시"
                    labelWidth={50}
                    as="dateTimePicker"
                    value={data.endDt}
                    onChange={(date) => {
                        handleChangeValue({ name: 'endDt', value: date });
                    }}
                    inputClassName="right"
                />
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Col xs={3} className="p-0 align-items-center d-flex">
                    <MokaInput
                        as="checkbox"
                        id="check-time"
                        inputProps={{ label: ' ', checked: !commonUtil.isEmpty(data.endPeriod) && data.endPeriod !== '' }}
                        disabled={disabled}
                        onChange={() => {
                            handleChangeValue({ name: 'endPeriod', value: '' });
                        }}
                    />
                    <MokaInputLabel
                        label="주기"
                        name="endPeriod"
                        value={data.endPeriod}
                        labelWidth={32}
                        className="mr-2"
                        disabled={disabled}
                        onChange={(e) => {
                            handleChangeValue(e.target);
                        }}
                    />
                    <span>분</span>
                </Col>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="목표 달성" as="checkbox" id="check-aim" inputProps={{ label: '기간 기준' }} disabled={disabled} />
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <div style={{ width: 90 }} className="d-flex align-items-center">
                    <MokaInput as="checkbox" id="check-test" inputProps={{ label: '성과 기준' }} disabled={disabled} />
                </div>
                <span className="mr-2" style={{ marginLeft: '22px' }}>
                    시작 후
                </span>
                <div style={{ width: 70 }} className="mr-2">
                    <MokaInput
                        name="kpiPeriodCondi"
                        value={data.kpiPeriodCondi}
                        onChange={(e) => {
                            handleChangeValue(e.target);
                        }}
                        disabled={disabled}
                    />
                </div>
                <span>분 이후부터 적용</span>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <div style={{ width: 70 }} className="mr-2">
                    <MokaInput
                        name="endKpi"
                        value={data.endKpi}
                        onChange={(e) => {
                            handleChangeValue(e.target);
                        }}
                        disabled={disabled}
                    />
                </div>
                <span className="mr-2">% 클릭수</span>
                <div style={{ width: 70 }} className="mr-2">
                    <MokaInput
                        name="kpiClickCondi"
                        value={data.kpiClickCondi}
                        onChange={(e) => {
                            handleChangeValue(e.target);
                        }}
                        disabled={disabled}
                    />
                </div>
                <span>건 이상일 경우</span>
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
                    onChange={(e) => {
                        handleChangeValue(e.target);
                    }}
                    disabled={disabled}
                />
                <MokaInput
                    as="radio"
                    id="autoApplyYn-y"
                    value="Y"
                    name="autoApplyYn"
                    inputProps={{ label: '자동반영', checked: data.autoApplyYn === 'Y' }}
                    onChange={(e) => {
                        handleChangeValue(e.target);
                    }}
                    disabled={disabled}
                />
            </Form.Row>

            <MokaInputLabel
                label="설명"
                name="abtestDesc"
                value={data.abtestDesc}
                onChange={(e) => {
                    handleChangeValue(e.target);
                }}
                as="textarea"
                inputProps={{ rows: 3 }}
                disabled={disabled}
            />
        </div>
    );
};

ABMainForm.propTypes = propTypes;
ABMainForm.defaultProps = defaultProps;

export default React.memo(ABMainForm, areEqual);
