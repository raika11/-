import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';

/**
 * A/B 테스트 > 전체 목록 > 리스트 > 검색
 */
const ABSearch = ({ match }) => {
    return (
        <div className="mb-14">
            <Row className="mb-2" noGutters>
                <Col xs={2} className="pr-2">
                    <MokaInput as="select" disabled>
                        <option>중앙일보</option>
                    </MokaInput>
                </Col>
                <Col xs={6} className="d-flex pr-2">
                    <MokaInput as="select" className="mr-2" disabled>
                        <option>상태 전체</option>
                    </MokaInput>
                    <MokaInput as="select" className="mr-2" disabled>
                        <option>목표 전체</option>
                    </MokaInput>
                    <MokaInput as="select" disabled>
                        <option>페이지 전체</option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="d-flex">
                    <MokaInput as="select" className="mr-2" disabled>
                        <option>영역 전체</option>
                    </MokaInput>
                    <Button variant="negative" className="flex-shrink-0">
                        초기화
                    </Button>
                </Col>
            </Row>

            <Row noGutters>
                <Col xs={5} className="pr-2 d-flex">
                    <MokaInput as="dateTimePicker" className="mr-1" inputProps={{ timeFormat: null, timeDefault: 'start' }} />
                    <MokaInput as="dateTimePicker" className="ml-1" inputProps={{ timeFormat: null, timeDefault: 'end' }} />
                </Col>

                <Col xs={3} className="d-flex pr-2">
                    <MokaInput as="select" className="mr-2" disabled>
                        <option>유형 전체</option>
                    </MokaInput>
                    <MokaInput as="select" disabled>
                        <option>전체</option>
                    </MokaInput>
                </Col>

                <Col xs={4}>
                    <MokaSearchInput disabled />
                </Col>
            </Row>
        </div>
    );
};

export default ABSearch;
