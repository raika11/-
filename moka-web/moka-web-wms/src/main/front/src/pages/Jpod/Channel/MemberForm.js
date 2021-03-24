import React from 'react';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaIcon, MokaOverlayTooltipButton } from '@components';

const MemberForm = ({ index, member, onChangeMember, onDeleteMember, onResetMember }) => {
    return (
        <div className="d-flex p-2">
            <div className="flex-fill">
                <div className="d-flex mb-2">
                    <MokaInput name="memRepSeq" className="mr-2" value={member.memRepSeq} onChange={(e) => onChangeMember(e, index)} placeholder="기자번호" disabled />
                    <MokaInput name="memNm" className="mr-2" value={member.memNm} onChange={(e) => onChangeMember(e, index)} placeholder="기자명" />
                    <MokaInput name="memMemo" className="mr-2" value={member.memMemo} onChange={(e) => onChangeMember(e, index)} placeholder="직책" />
                    <MokaInput name="nickNm" className="mr-2" value={member.nickNm} onChange={(e) => onChangeMember(e, index)} placeholder="닉네임" />
                    <Button variant="negative" className="flex-shrink-0" onClick={() => onResetMember(index)}>
                        삭제
                    </Button>
                </div>
                <MokaInput as="textarea" name="desc" value={member.desc} onChange={(e) => onChangeMember(e, index)} placeholder="설명" inputProps={{ rows: 3 }} />
            </div>
            <div className="flex-shrink-0 d-flex align-items-center pl-2">
                <MokaOverlayTooltipButton
                    tooltipId="tooltip-table-editc-button"
                    tooltipText="삭제"
                    variant="white"
                    className="border-0 p-0 moka-table-button bg-transparent shadow-none"
                    onClick={() => onDeleteMember(index)}
                >
                    <MokaIcon iconName="fas-minus-circle" />
                </MokaOverlayTooltipButton>
            </div>
        </div>
    );
};

export default MemberForm;
