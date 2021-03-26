import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaIcon, MokaOverlayTooltipButton, MokaPrependLinkInput } from '@components';

const propTypes = {
    /**
     * loop 안에 있는 경우 index (있으면 넘김)
     */
    index: PropTypes.number,
    /**
     * 기자정보
     * @default
     */
    member: PropTypes.shape({
        /**
         * 기자번호
         */
        memRepSeq: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        /**
         * 기자명
         */
        memNm: PropTypes.string,
        /**
         * 직책
         */
        memMemo: PropTypes.string,
        /**
         * 닉네임
         */
        nickNm: PropTypes.string,
        /**
         * 설명
         */
        desc: PropTypes.string,
    }),
    /**
     * 기자 정보 수정 함수
     * @default
     */
    onChangeMember: PropTypes.func,
    /**
     * 필드 삭제 함수
     * @default
     */
    onDeleteMemeber: PropTypes.func,
    /**
     * 해당 필드의 데이터를 초기화하는 함수
     * @default
     */
    onResetMember: PropTypes.func,
};
const defaultProps = {
    member: {},
    onChangeMember: () => {},
    onDeleteMemeber: () => {},
    onResetMember: () => {},
};

/**
 * 진행자, 출연진 그리는 폼
 */
const MemberForm = ({ index, member, onChangeMember, onDeleteMember, onResetMember }) => {
    return (
        <div className="d-flex w-100 p-2">
            {/* 입력폼 */}
            <div className="flex-fill">
                <div className="d-flex mb-2">
                    <MokaPrependLinkInput
                        className="mr-2"
                        linkText={member.memRepSeq ? `ID: ${member.memRepSeq}` : 'ID'}
                        inputList={{
                            placeholder: '기자명',
                            className: 'bg-white',
                            name: 'memNm',
                            value: member.memNm,
                            onChange: (e) => onChangeMember(e, index),
                        }}
                    />
                    <MokaInput name="memMemo" className="mr-2" value={member.memMemo} onChange={(e) => onChangeMember(e, index)} placeholder="직책" />
                    <MokaInput name="nickNm" className="mr-2" value={member.nickNm} onChange={(e) => onChangeMember(e, index)} placeholder="닉네임" />
                    <Button variant="negative" className="flex-shrink-0" onClick={() => onResetMember(index)}>
                        삭제
                    </Button>
                </div>
                <MokaInput as="textarea" name="desc" value={member.desc} onChange={(e) => onChangeMember(e, index)} placeholder="설명" inputProps={{ rows: 3 }} />
            </div>

            {/* 필드 삭제 */}
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

MemberForm.propTypes = propTypes;
MemberForm.defaultProps = defaultProps;

export default MemberForm;
