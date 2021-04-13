import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel } from '@components';

/**
 * A/B 테스트 > 탭 > 정보 > 기타 설정폼
 * 공통 UI
 */
const ABEtcForm = (props) => {
    const { data = {}, onChange } = props;
    const [disabled, setDisabled] = useState(true);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        if (!onChange) return;

        const { name, value, checked } = e.target;
        let changeData = {};

        if (name === 'device' || name === 'browser' || name === 'referer' || name === 'utm') {
            if (value === 'all') {
                changeData[name] = checked
                    ? [...document.querySelectorAll(`[name="${name}"]`)]
                          .map((ele) => ele.attributes.value.value)
                          .filter((v) => v !== 'all')
                          .join(',')
                    : '';
            } else {
                let arr = (data[name] || '').split(',');
                if (checked) arr.push(value);
                else arr = arr.filter((f) => f !== value);
                changeData[name] = arr.join(',');
            }
        } else if (name === 'subscribeYn' || name === 'pwaYn' || name === 'pushYn') {
            changeData[name] = checked ? 'Y' : 'N';
        } else {
            changeData[name] = value;
        }

        if (Object.keys(changeData).length > 0) {
            onChange(changeData);
        }
    };

    const isChecked = (field, value) => new RegExp(`(^${value})|,${value}`).test(data[field] || '');

    const isAllChecked = (field, count) => (data[field] || '').split(',').filter(Boolean).length >= count;

    useEffect(() => {
        onChange ? setDisabled(false) : setDisabled(true);
    }, [onChange]);

    return (
        <div>
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel
                    label="구독여부"
                    as="checkbox"
                    name="subscribeYn"
                    id="subscribeYn"
                    inputProps={{ label: '구독', checked: data.subscribeYn === 'Y' }}
                    onChange={handleChangeValue}
                    className="mr-32"
                    disabled={disabled}
                />
                <MokaInput as="autocomplete" value={data.subscribeSeq} options={[]} placeholder="구독상품 선택" />
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="로그인 상태" as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="radio"
                            id="loginYn-all"
                            name="loginYn"
                            value="all"
                            inputProps={{ label: '전체', checked: !data.loginYn || data.loginYn === 'all' }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="radio"
                            id="loginYn-y"
                            name="loginYn"
                            value="Y"
                            inputProps={{ label: '로그인 사용자', checked: data.loginYn === 'Y' }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="radio"
                            id="loginYn-n"
                            name="loginYn"
                            value="N"
                            inputProps={{ label: '비로그인 사용자', checked: data.loginYn === 'N' }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="디바이스" as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="device-all"
                            value="all"
                            name="device"
                            inputProps={{ label: '전체', checked: isAllChecked('device', 3) }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="device-p"
                            value="P"
                            name="device"
                            inputProps={{ label: 'PC', checked: isChecked('device', 'P') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="device-m"
                            value="M"
                            name="device"
                            inputProps={{ label: 'Mobile Web', checked: isChecked('device', 'M') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="device-a"
                            value="A"
                            name="device"
                            inputProps={{ label: 'Mobile APP', checked: isChecked('device', 'A') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="브라우저" as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="browser-all"
                            name="browser"
                            value="all"
                            inputProps={{ label: '전체', checked: isAllChecked('browser', 7) }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="browser-ie11"
                            name="browser"
                            value="IE"
                            inputProps={{ label: 'IE11', checked: isChecked('browser', 'IE') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="browser-chrome"
                            name="browser"
                            value="CRM"
                            inputProps={{ label: 'Chrome', checked: isChecked('browser', 'CRM') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="browser-edge"
                            name="browser"
                            value="EDG"
                            inputProps={{ label: 'Edge', checked: isChecked('browser', 'EDG') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="browser-safari"
                            name="browser"
                            value="SAF"
                            inputProps={{ label: 'Safari', checked: isChecked('browser', 'SAF') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="browser-and"
                            name="browser"
                            value="AW"
                            inputProps={{ label: 'Android Web View', checked: isChecked('browser', 'AW') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="browser-samsung"
                            name="browser"
                            value="SIE"
                            inputProps={{ label: 'Samsung Internet', checked: isChecked('browser', 'SIE') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="browser-etc"
                            name="browser"
                            value="ETC"
                            inputProps={{ label: '기타', checked: isChecked('browser', 'ETC') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="유입처별" as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="referer-all"
                            value="all"
                            name="referer"
                            inputProps={{ label: '전체', checked: isAllChecked('referer', 6) }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    {/* 직접방문 필드가 없음 확인 필요함 */}
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="referer-direct"
                            value="DIRECT"
                            name="referer"
                            inputProps={{ label: '직접방문', checked: isChecked('referer', 'DIRECT') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="referer-naver"
                            name="referer"
                            value="NAVER"
                            inputProps={{ label: 'Naver', checked: isChecked('referer', 'NAVER') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="referer-google"
                            name="referer"
                            value="GOOGLE"
                            inputProps={{ label: 'Google', checked: isChecked('referer', 'GOOGLE') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="referer-kakao"
                            name="referer"
                            value="KAKAO"
                            inputProps={{ label: 'Kakao', checked: isChecked('referer', 'KAKAO') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="referer-twitter"
                            name="referer"
                            value="TWITTER"
                            inputProps={{ label: 'Twitter', checked: isChecked('referer', 'TWITTER') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="pr-2">
                        <MokaInput
                            as="checkbox"
                            id="referer-etc"
                            name="referer"
                            value="ETC"
                            inputProps={{ label: '기타', checked: isChecked('referer', 'ETC') }}
                            disabled={disabled}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel
                    label="PWA 설정"
                    as="checkbox"
                    id="pwaYn"
                    name="pwaYn"
                    inputProps={{ label: '설정', checked: data.pwaYn === 'Y' }}
                    onChange={handleChangeValue}
                    disabled={disabled}
                />
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel
                    label="PUSH 설정"
                    name="pushYn"
                    as="checkbox"
                    id="pushYn"
                    inputProps={{ label: '설정', checked: data.pushYn === 'Y' }}
                    onChange={handleChangeValue}
                    disabled={disabled}
                />
            </Form.Row>

            <MokaInputLabel
                label="UTM"
                as="checkbox"
                id="utm"
                value="all"
                name="utm"
                inputProps={{ label: '전체', checked: isAllChecked('utm', 5) }}
                className="mb-2"
                onChange={handleChangeValue}
                disabled={disabled}
            />

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={5} className="d-flex align-items-center">
                        <MokaInput
                            as="checkbox"
                            name="utm"
                            id="utmSource"
                            value="SOURCE"
                            inputProps={{ label: 'UTM_SOURCE(출처)', checked: isChecked('utm', 'SOURCE') }}
                            onChange={handleChangeValue}
                            disabled={disabled}
                        />
                    </Col>
                    <Col xs={7}>
                        <MokaInput value={data.utmSource} name="utmSource" onChange={handleChangeValue} disabled={disabled || !isChecked('utm', 'SOURCE')} />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={5} className="d-flex align-items-center">
                        <MokaInput
                            as="checkbox"
                            name="utm"
                            id="utmMedium"
                            value="MEDIUM"
                            inputProps={{ label: 'UTM_MEDIUM(매체)', checked: isChecked('utm', 'MEDIUM') }}
                            onChange={handleChangeValue}
                            disabled={disabled}
                        />
                    </Col>
                    <Col xs={7}>
                        <MokaInput value={data.utmMedium} name="utmMedium" onChange={handleChangeValue} disabled={disabled || !isChecked('utm', 'MEDIUM')} />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={5} className="d-flex align-items-center">
                        <MokaInput
                            as="checkbox"
                            name="utm"
                            id="utmCampaign"
                            value="CAMPAIGN"
                            inputProps={{ label: 'UTM_CAMPAIGN(캠페인)', checked: isChecked('utm', 'CAMPAIGN') }}
                            onChange={handleChangeValue}
                            disabled={disabled}
                        />
                    </Col>
                    <Col xs={7}>
                        <MokaInput value={data.utmCampaign} name="utmCampaign" onChange={handleChangeValue} disabled={disabled || !isChecked('utm', 'CAMPAIGN')} />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={5} className="d-flex align-items-center">
                        <MokaInput
                            as="checkbox"
                            value="TERM"
                            name="utm"
                            id="utmTerm"
                            inputProps={{ label: 'UTM_TERM(키워드)', checked: isChecked('utm', 'TERM') }}
                            onChange={handleChangeValue}
                            disabled={disabled}
                        />
                    </Col>
                    <Col xs={7}>
                        <MokaInput value={data.utmTerm} name="utmTerm" onChange={handleChangeValue} disabled={disabled || !isChecked('utm', 'TERM')} />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={5} className="d-flex align-items-center">
                        <MokaInput
                            as="checkbox"
                            name="utm"
                            id="utmContent"
                            value="CONTENT"
                            inputProps={{ label: 'UTM_CONTENT(콘텐츠)', checked: isChecked('utm', 'CONTENT') }}
                            onChange={handleChangeValue}
                            disabled={disabled}
                        />
                    </Col>
                    <Col xs={7}>
                        <MokaInput value={data.utmContent} name="utmContent" onChange={handleChangeValue} disabled={disabled || !isChecked('utm', 'CONTENT')} />
                    </Col>
                </Row>
            </Form.Row>
        </div>
    );
};

export default ABEtcForm;
