import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@components';
import ReporterListModal from '@pages/Reporter/modals/ReporterListModal';
import MemberForm from '@pages/Jpod/Channel/MemberForm';

const PannelForm = ({ label, memDiv, members, addMember, onChangeMember, onDeleteMember, onResetMember, reporterToMember }) => {
    const [show, setShow] = useState(false);

    return (
        <React.Fragment>
            <Form.Row className="mb-14">
                <MokaInputLabel label={label} as="none" />
                <Button xs={12} variant="searching" className="mb-0 mr-1" onClick={() => setShow(true)}>
                    기자 검색
                </Button>
                <ReporterListModal show={show} onHide={() => setShow(false)} onRowClicked={(reporter) => reporterToMember(reporter, memDiv)} />

                <Button variant="positive" onClick={() => addMember(memDiv)}>
                    추가
                </Button>
            </Form.Row>

            {members.length === 0 && (
                <div className="d-flex mb-2 p-3 d-flex justify-content-center rounded-lg color-gray-900" style={{ backgroundColor: '#f4f7f9' }}>
                    {label}이 없습니다
                </div>
            )}
            {members.map((member, index) => (
                <div className="d-flex mb-2 rounded-lg" key={index} style={{ backgroundColor: '#f4f7f9' }}>
                    <MemberForm
                        index={index}
                        member={member}
                        onChangeMember={(e, idx) => onChangeMember(e, idx, memDiv)}
                        onDeleteMember={(idx) => onDeleteMember(idx, memDiv)}
                        onResetMember={(idx) => onResetMember(idx, memDiv)}
                    />
                </div>
            ))}
        </React.Fragment>
    );
};

export default PannelForm;
