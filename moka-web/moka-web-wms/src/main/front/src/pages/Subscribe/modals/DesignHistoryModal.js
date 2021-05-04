import React from 'react';
import clsx from 'clsx';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaModal } from '@components';

/**
 * 구독 관리 > 구독 설계 > 변경이력 상세 모달
 */
const DesignHistoryModal = ({ show, onHide }) => {
    /**
     * Row creator
     * @param {string} text1 왼쪽 텍스트
     * @param {string} text2 가운데 텍스트
     * @param {string} text3 오른쪽 텍스트
     * @param {object} options 그외 옵션 (필요할 때마다 추가)
     */
    const makeRow = (text1, text2, text3, options = {}) => {
        const { className, col3ClassName } = options;

        return (
            <Row className={clsx('border', className)} noGutters>
                <Col xs={2} className="px-12 py-2 border-right">
                    {text1}
                </Col>
                <Col xs={5} className="px-12 py-2 border-right">
                    {text2}
                </Col>
                <Col xs={5} className={clsx('px-12 py-2', col3ClassName)}>
                    {text3}
                </Col>
            </Row>
        );
    };
    return (
        <MokaModal
            show={show}
            onHide={onHide}
            title="변경내용"
            size="md"
            width={700}
            height={645}
            buttons={[{ text: '닫기', onClick: onHide, variant: 'negative' }]}
            bodyClassName="custom-scroll"
            centered
        >
            {makeRow('항목', '변경 전', '변경 후', { className: 'bg-light font-weight-bold', col3ClassName: 'bg-dark text-white' })}
            {makeRow('구분', '패키지', '패키지', { className: 'border-top-0' })}
            {makeRow('구독대상', '윤석만의 뉴스뻥', '윤석만의 뉴스뻥', { className: 'border-top-0' })}
            {makeRow('구독방법', '로그인, 일반 구독', '로그인, 일반 구독', { className: 'border-top-0' })}
            {makeRow('개시일자-시작', '2021-01-30 12:20', '2021-03-26 14:40', { className: 'border-top-0' })}
            {makeRow('개시일자-종료', '-', '-', { className: 'border-top-0' })}
            {makeRow('전체대상 여부', 'N', 'N', { className: 'border-top-0' })}
            {makeRow('회원가입 종류', '이메일, 조인스', '이메일, 네이버, 카카오, 페이스북, 조인스', { className: 'border-top-0' })}
            {makeRow('플랫폼 종류', 'PC, Mobile Web', 'PC, Mobile Web', { className: 'border-top-0' })}
            {makeRow('유입처 종류', '-', '-', { className: 'border-top-0' })}
            {makeRow('브라우저 종류', '-', '-', { className: 'border-top-0' })}
            {makeRow('Push 설정여부', '-', '-', { className: 'border-top-0' })}
            {makeRow('방문 빈도(PV)', '3일간 10PV', '3일간 10PV', { className: 'border-top-0' })}
        </MokaModal>
    );
};

export default DesignHistoryModal;
