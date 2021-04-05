import React from 'react';
import { MokaCard } from '@components';
import { Col, Row } from 'react-bootstrap';

const MyPageHelp = () => {
    return (
        <MokaCard title="비밀번호 도움말" className="w-100">
            <Row className="mb-32">
                <Col xs={12}>
                    <p className="m-0">안전한 비밀번호 관리를 위해 "비밀번호 안전등급 체크 프로그램"을 적용하였습니다.</p>
                    <p className="m-0">비밀번호 안전등급은 입력한 비밀번호의 보안 정도를 측정하여 보안에 취약한 비밀번호에 대하여 안내해 드립니다.</p>
                </Col>
            </Row>
            <Row className="mb-14">
                <Col xs={12}>
                    <h6 className="mb-1">비밀번호 안전도</h6>
                    <p className="m-0">
                        <b className="color-positive">사용불가</b> 비밀번호 조합기준에 적합하지 않아 사용할 수 없는 경우
                    </p>
                    <p className="m-0">
                        <b className="color-positive">!취약!</b> 보안이 취약하여 사용할 수 없는 경우
                    </p>
                    <p className="m-0">
                        <b className="color-success">적정</b> 사용가능하며 적정수준의 안전한 비밀번호
                    </p>
                    <p className="m-0">
                        <b className="color-success">안전</b> 매우 안전한 비밀번호
                    </p>
                </Col>
            </Row>
            <Row className="mb-14">
                <Col xs={12}>
                    <h6 className="mb-1">비밀번호 만들기</h6>
                    <p className="m-0">8~15자의 영문, 숫자, 특수문자가 포함되어야 합니다.</p>
                    <p className="m-0">영문, 숫자, 특수문자가 3가지 조합을 모두 사용하는 것이 안전합니다.</p>
                    <p className="m-0">
                        사용가능한 특수문자: &#33; &#34; &#36; &#37; &#38; &#40; &#41; &#42; &#43; &#44; - &#46; &#47; &#58; &#59; &#60; &#62; &#61; &#59; &#64; &#91; &#92; &#93;
                        &#94; &#95; &#96; &#123; &#124; &#125; ~
                    </p>
                    <p className="m-0">연속된 숫자 및 문자 등 쉽게 알아낼 수 있는 비밀번호 사용은 위험합니다.</p>
                    <p className="m-0">비밀번호는 1개월에 한번씩 주기적으로 바꾸어 사용하시는 것이 안전합니다.</p>
                    <p className="m-0">비밀번호는 길수록, 그리고 많이 조합할수록 안전합니다.</p>
                </Col>
            </Row>
            <Row className="mb-14">
                <Col xs={12}>
                    <h6 className="mb-1">사용 불가능한 비밀번호</h6>
                    <p className="m-0">공백은 비밀번호로 사용 불가능합니다.</p>
                    <p className="m-0">숫자, 영문, 특수문자 중 1개만 사용한 비밀번호는 사용 불가능합니다.</p>
                    <p className="m-0">동일한 문자 또는 숫자를 많이 포함한 경우 사용 불가능합니다.</p>
                    <p className="m-0">ID, 주민번호, 생일, 전화번호 등의 개인정보로 이루어진 비밀번호는 사용 불가능 합니다.</p>
                    <p className="m-0">비밀번호 변경 시 현재 사용 중인 비밀번호의 재사용은 불가능하빈다.</p>
                </Col>
            </Row>
        </MokaCard>
    );
};

export default MyPageHelp;
