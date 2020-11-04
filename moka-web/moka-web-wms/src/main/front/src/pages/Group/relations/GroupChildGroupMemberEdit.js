import React from 'react';
import GroupChildGroupMemberList from '@pages/Group/relations/GroupChildGroupMemberList';
import GroupChildSearchMemberList from '@pages/Group/relations/GroupChildSearchMemberList';
import { MokaCard } from '@components';
import { Col, Row } from 'react-bootstrap';

const GroupChildGroupMemberEdit = () => {
    return (
        <MokaCard title="사용자 목록" width={1000}>
            <Row>
                <Col xs={6}>
                    <GroupChildGroupMemberList />
                </Col>
                <Col xs={6}>
                    <GroupChildSearchMemberList />
                </Col>
            </Row>
        </MokaCard>
    );
};

export default GroupChildGroupMemberEdit;
