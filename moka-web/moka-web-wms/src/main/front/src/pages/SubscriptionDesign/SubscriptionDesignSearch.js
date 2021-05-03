import React from 'react';
import { useHistory } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';

/**
 * 구독 관리 > 구독 설계 > 리스트 > 검색
 */
const SubscriptionDesignSearch = ({ match }) => {
    const history = useHistory();

    return (
        <React.Fragment>
            <Row className="mb-2" noGutters>
                <Col xs={2} className="pr-2">
                    <MokaInput as="select" disabled>
                        <option>구분 전체</option>
                    </MokaInput>
                </Col>
                <Col xs={2} className="pr-2">
                    <MokaInput as="select" disabled>
                        <option>상태 전체</option>
                    </MokaInput>
                </Col>
                <Col xs={2}>
                    <MokaInput as="select" disabled>
                        <option value="">대표여부 전체</option>
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                    </MokaInput>
                </Col>
            </Row>
            <Row className="mb-14" noGutters>
                <Col xs={2} className="pr-2">
                    <MokaInput as="select" disabled>
                        <option value="">등록일</option>
                    </MokaInput>
                </Col>
                <Col xs={1} className="pr-2">
                    <MokaInput as="select" disabled>
                        <option value="">1주일</option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="d-flex pr-2">
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, timeDefault: 'start' }} className="mr-1" disabled />
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, timeDefault: 'end' }} className="ml-1" disabled />
                </Col>
                <Col xs={5} className="d-flex">
                    <MokaSearchInput disabled className="mr-2 flex-fill" />
                    <Button variant="positive" className="flex-shrink-0" onClick={() => history.push(`${match.path}/add`)}>
                        상품 등록
                    </Button>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default SubscriptionDesignSearch;
