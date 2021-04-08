import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@components';

/**
 * A/B 테스트 > 테스트 결과 > 상세
 */
const ResultInfo = () => {
    return (
        <MokaCard title="AB타입 : AB 제목" className="w-100" bodyClassName="d-flex flex-column">
            <Row className="mb-2" noGutters>
                <Col xs={2}>
                    <strong>테스트 기간</strong>
                </Col>
                <Col xs={10}>2021년 03월 08일 10시 15분 ~ 2021 03월 08시 10시 35분</Col>
            </Row>

            <Row className="mb-2 align-items-center" noGutters>
                <Col xs={2}>
                    <strong>테스트 기간</strong>
                </Col>
                <Col xs={10}>
                    <Row className="mb-1" noGutters>
                        <Col xs={3}>
                            <strong>JAM기사</strong>
                        </Col>
                        <Col xs={9}>AType: 어쩌고 저쩌고</Col>
                    </Row>
                    <Row noGutters>
                        <Col xs={3}>
                            <strong>기사키</strong>
                        </Col>
                        <Col xs={9}>BType: 어쩌고 저쩌고</Col>
                    </Row>
                </Col>
            </Row>

            <Row className="mb-2" noGutters>
                <Col xs={2}>
                    <strong>Test그룹</strong>
                </Col>
                <Col xs={10}>전체 사용자(랜덤 A그룹: 40%, B그룹: 60%)</Col>
            </Row>

            <Row className="mb-3" noGutters>
                <Col xs={2}>
                    <strong>Test목표</strong>
                </Col>
                <Col xs={10}>기간만료(20분 주기)</Col>
            </Row>

            <Row className="mb-3" noGutters>
                <div className="input-border flex-fill mr-3 p-3">
                    <h3>참여율</h3>
                    차트
                </div>
                <div className="input-border flex-fill p-3">
                    <h3>테스트률</h3>
                    차트
                </div>
            </Row>

            <Row className="flex-fill" noGutters>
                <div className="input-border flex-fill p-3">
                    <h3>그룹별 현황</h3>
                    차트
                </div>
            </Row>
        </MokaCard>
    );
};

export default ResultInfo;
