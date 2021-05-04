import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { MokaInputLabel, MokaInput } from '@components';

const defaultProps = {
    scb: {},
};
const labelWidth = 35;

/**
 * 구독 설계 공통 폼
 * 구독 방법(구독 옵션), 개시 일정
 */
const DesignCommonForm = ({ scb, onChangeValue, CHANNEL_TYPE }) => {
    const [repeatDy, setRepeatDy] = useState([]);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'loginYn' || name === 'myScb' || name === 'newsletter' || name === 'push' || name === 'artView' || name === 'endDtYn' || name === 'repeatYn') {
            onChangeValue({ [name]: checked ? 'Y' : 'N' });
        } else if (name === 'repeatDyAll') {
            onChangeValue({ repeatDy: checked ? 'A' : '' });
        } else {
            onChangeValue({ [name]: value });
        }
    };

    /**
     * 날짜, 시간 변경
     * @param {string} name field name
     * @param {*} date date
     */
    const handleChangeDate = (name, date) => {
        if (typeof date === 'object') {
            onChangeValue({ [name]: date });
        } else if (date === '') {
            onChangeValue({ [name]: null });
        }
    };

    useEffect(() => {
        setRepeatDy(scb.repeatDy === 'A' ? ['0', '1', '2', '3', '4', '5', '6'] : (scb.repeatDy || '').split(''));
    }, [scb.repeatDy]);

    return (
        <React.Fragment>
            {/* 구독 방법 | 구독 옵션 */}
            <Row noGutters>
                <Col xs={2}>
                    <MokaInputLabel as="none" label="구독 방법&nbsp;&nbsp;|&nbsp;&nbsp;구독 옵션" labelClassName="w-100" />
                </Col>
                <Col xs={10} className="d-flex flex-column pl-3">
                    <div className="mb-2">
                        <MokaInput
                            as="checkbox"
                            className="float-left"
                            name="loginYn"
                            id="loginY"
                            inputProps={{ label: '로그인', checked: scb.loginYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                        <hr className="vertical-divider float-left" />
                        <MokaInput
                            as="radio"
                            className="float-left mr-3"
                            name="payFlag"
                            value="N"
                            id="payFlagN"
                            inputProps={{ label: '일반 구독', checked: scb.payFlag === 'N' }}
                            onChange={handleChangeValue}
                        />
                        <MokaInput
                            as="radio"
                            className="float-left"
                            name="payFlag"
                            value="Y"
                            id="payFlagY"
                            inputProps={{ label: '유료 구독', checked: scb.payFlag === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </div>
                    <div>
                        <MokaInput
                            as="checkbox"
                            className="float-left mr-3"
                            name="myScb"
                            value="Y"
                            id="myScb"
                            inputProps={{ label: '내 구독', checked: scb.myScb === 'Y' }}
                            onChange={handleChangeValue}
                            disabled={
                                scb.channelType === CHANNEL_TYPE[0].code ||
                                scb.channelType === CHANNEL_TYPE[1].code ||
                                scb.channelType === CHANNEL_TYPE[2].code ||
                                scb.channelType === CHANNEL_TYPE[3].code ||
                                scb.channelType === CHANNEL_TYPE[4].code
                            }
                        />
                        <MokaInput
                            as="checkbox"
                            className="float-left mr-3"
                            name="newsletter"
                            value="Y"
                            id="newsletter"
                            inputProps={{ label: '뉴스레터', checked: scb.newsletter === 'Y' }}
                            onChange={handleChangeValue}
                            disabled={
                                scb.channelType === CHANNEL_TYPE[0].code ||
                                scb.channelType === CHANNEL_TYPE[1].code ||
                                scb.channelType === CHANNEL_TYPE[2].code ||
                                scb.channelType === CHANNEL_TYPE[3].code ||
                                scb.channelType === CHANNEL_TYPE[4].code
                            }
                        />
                        <MokaInput
                            as="checkbox"
                            className="float-left mr-3"
                            name="push"
                            value="Y"
                            id="push"
                            inputProps={{ label: 'App Push', checked: scb.push === 'Y' }}
                            onChange={handleChangeValue}
                            disabled={
                                scb.channelType === CHANNEL_TYPE[0].code ||
                                scb.channelType === CHANNEL_TYPE[1].code ||
                                scb.channelType === CHANNEL_TYPE[2].code ||
                                scb.channelType === CHANNEL_TYPE[3].code ||
                                scb.channelType === CHANNEL_TYPE[4].code
                            }
                        />
                        <MokaInput
                            as="checkbox"
                            className="float-left"
                            name="artView"
                            value="Y"
                            id="artView"
                            inputProps={{ label: '기사 열람', checked: scb.artView === 'Y' }}
                            onChange={handleChangeValue}
                            disabled={scb.channelType === CHANNEL_TYPE[0].code}
                        />
                    </div>
                </Col>
            </Row>
            <hr className="divider" />
            {/* 개시 일정 */}
            <Row noGutters>
                <Col xs={2}>
                    <MokaInputLabel as="none" label="개시 일정" labelClassName="w-100" />
                </Col>
                <Col xs={10} className="d-flex flex-column pl-3">
                    <div className="d-flex align-items-center mb-2">
                        <ToggleButtonGroup value={scb.reserveYn} className="mr-3" name="reserveYn" size="sm" type="radio" onChange={(val) => onChangeValue({ reserveYn: val })}>
                            <ToggleButton type="radio" variant="outline-gray-700" value="N">
                                바로개시
                            </ToggleButton>
                            <ToggleButton type="radio" variant="outline-gray-700" value="Y">
                                예약개시
                            </ToggleButton>
                        </ToggleButtonGroup>
                        {scb.reserveYn === 'N' && <span>기본정보 설정이 바로 적용되어 개시됩니다.</span>}
                    </div>
                    <MokaInput
                        as="switch"
                        className="mb-2"
                        name="endDtYn"
                        id="endDtYn"
                        inputProps={{ label: `종료 일시 (선택하지 않을 경우, 수동으로 '중지' 전까지 상품이 유지됩니다.)`, checked: scb.endDtYn === 'Y' }}
                        onChange={handleChangeValue}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        className="top mb-2"
                        name="endDt"
                        inputProps={{ width: 180 }}
                        value={scb.endDt}
                        onChange={(date) => handleChangeDate('endDt', date)}
                        disabled={scb.endDtYn !== 'Y'}
                    />
                    <MokaInput
                        as="switch"
                        name="repeatYn"
                        id="repeatYn"
                        inputProps={{ label: `반복 개시 (상품 개시 시점부터 설정한 규칙에 따라 반복 적용합니다.)`, checked: scb.repeatYn === 'Y' }}
                        onChange={handleChangeValue}
                        className="mb-2"
                    />
                    <div className="d-flex align-items-center mb-2">
                        <MokaInputLabel
                            as="dateTimePicker"
                            label="시간"
                            labelWidth={labelWidth}
                            name="repeatStartTime"
                            inputClassName="top"
                            value={scb.repeatStartTime}
                            inputProps={{ width: 120, dateFormat: null }}
                            onChange={(date) => handleChangeDate('repeatStartTime', date)}
                            disabled={scb.repeatYn !== 'Y'}
                        />
                        <span className="mx-2">~</span>
                        <MokaInput
                            as="dateTimePicker"
                            name="repeatEndTime"
                            className="top"
                            value={scb.repeatEndTime}
                            inputProps={{ width: 120, dateFormat: null }}
                            onChange={(date) => handleChangeDate('repaetEndTime', handleChangeDate)}
                            disabled={scb.repeatYn !== 'Y'}
                        />
                    </div>
                    <div className="d-flex">
                        <MokaInputLabel
                            as="checkbox"
                            label="요일"
                            labelWidth={labelWidth}
                            name="repeatDyAll"
                            id="repeatDyAll"
                            inputProps={{ label: '매일', checked: scb.repeatDy === 'A' }}
                            onChange={handleChangeValue}
                            className="mr-2"
                            disabled={scb.repeatYn !== 'Y'}
                        />
                        <ToggleButtonGroup
                            value={repeatDy}
                            name="repeatDy"
                            size="sm"
                            type="checkbox"
                            onChange={(val) => {
                                if (val.length === 7) onChangeValue({ repeatDy: 'A' });
                                else onChangeValue({ repeatDy: val.join('') });
                            }}
                        >
                            {['월', '화', '수', '목', '금', '토', '일'].map((day, idx) => (
                                <ToggleButton type="checkbox" variant="outline-gray-700" value={String(idx)} key={day} disabled={scb.repeatYn !== 'Y'}>
                                    {day}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

DesignCommonForm.defaultProps = defaultProps;

export default DesignCommonForm;
