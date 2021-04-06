import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel } from '@components';

/**
 * A/B 테스트 > 탭 > 정보 > 기타 설정폼
 * 공통 UI
 */
const ABEtcForm = () => {
    return (
        <div>
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="구독여부" as="checkbox" id="check-subscribe" inputProps={{ label: '구독' }} className="mr-32" disabled />
                <MokaInput as="autocomplete" options={[]} placeholder="구독상품 선택" />
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="로그인 상태" as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={4}>
                        <MokaInput as="checkbox" id="checkbox-login-all" name="login" inputProps={{ label: '전체' }} disabled />
                    </Col>
                    <Col xs={4}>
                        <MokaInput as="checkbox" id="checkbox-login-user" name="login" inputProps={{ label: '로그인 사용자' }} disabled />
                    </Col>
                    <Col xs={4}>
                        <MokaInput as="checkbox" id="checkbox-login-no" name="login" inputProps={{ label: '비로그인 사용자' }} disabled />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="디바이스" as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-device-all" name="device" inputProps={{ label: '전체' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-device-p" name="device" inputProps={{ label: 'PC' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-device-m" name="device" inputProps={{ label: 'Mobile Web' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-device-app" name="device" inputProps={{ label: 'Mobile APP' }} disabled />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="브라우저" as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-browser-all" name="browser" inputProps={{ label: '전체' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-browser-ie11" name="browser" inputProps={{ label: 'IE11' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-browser-chrome" name="browser" inputProps={{ label: 'Chrome' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-browser-edge" name="browser" inputProps={{ label: 'Edge' }} disabled />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-browser-safari" name="browser" inputProps={{ label: 'Safari' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-browser-and" name="browser" inputProps={{ label: 'Android Web View' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-browser-samsung" name="browser" inputProps={{ label: 'Samsung Internet' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-browser-etc" name="browser" inputProps={{ label: '기타' }} disabled />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="유입처별" as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-referrer-all" name="referrer" inputProps={{ label: '전체' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-referrer-direct" name="referrer" inputProps={{ label: '직접방문' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-referrer-naver" name="referrer" inputProps={{ label: 'Naver' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-referrer-google" name="referrer" inputProps={{ label: 'Google' }} disabled />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-referrer-kakao" name="referrer" inputProps={{ label: 'Kakao' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-referrer-twitter" name="referrer" inputProps={{ label: 'Twitter' }} disabled />
                    </Col>
                    <Col xs={3}>
                        <MokaInput as="checkbox" id="checkbox-referrer-etc" name="referrer" inputProps={{ label: '기타' }} disabled />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="PWA 설정" as="checkbox" id="pwa" inputProps={{ label: '설정' }} disabled />
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="PUSH 설정" as="checkbox" id="push" inputProps={{ label: '설정' }} disabled />
            </Form.Row>

            <MokaInputLabel label="UTM" as="checkbox" id="utm" inputProps={{ label: '전체' }} className="mb-2" disabled />

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={5} className="d-flex align-items-center">
                        <MokaInput as="checkbox" name="utm" id="utm-source" inputProps={{ label: 'UTM_SOURCE(출처)' }} disabled />
                    </Col>
                    <Col xs={7}>
                        <MokaInput disabled />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={5} className="d-flex align-items-center">
                        <MokaInput as="checkbox" name="utm" id="utm-medium" inputProps={{ label: 'UTM_MEDIUM(매체)' }} disabled />
                    </Col>
                    <Col xs={7}>
                        <MokaInput disabled />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={5} className="d-flex align-items-center">
                        <MokaInput as="checkbox" name="utm" id="utm-campaign" inputProps={{ label: 'UTM_CAMPAIGN(캠페인)' }} disabled />
                    </Col>
                    <Col xs={7}>
                        <MokaInput disabled />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={5} className="d-flex align-items-center">
                        <MokaInput as="checkbox" name="utm" id="utm-term" inputProps={{ label: 'UTM_TERM(키워드)' }} disabled />
                    </Col>
                    <Col xs={7}>
                        <MokaInput disabled />
                    </Col>
                </Row>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Row className="flex-fill" noGutters>
                    <Col xs={5} className="d-flex align-items-center">
                        <MokaInput as="checkbox" name="utm" id="utm-content" inputProps={{ label: 'UTM_CONTENT(콘텐츠)' }} disabled />
                    </Col>
                    <Col xs={7}>
                        <MokaInput disabled />
                    </Col>
                </Row>
            </Form.Row>
        </div>
    );
};

export default ABEtcForm;
