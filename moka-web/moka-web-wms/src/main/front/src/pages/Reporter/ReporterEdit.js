import React from 'react';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import { MokaInput, MokaInputLabel } from '@components';
import bg from '@assets/images/bg.jpeg';

/**
 * 기자 정보 조회/수정
 */
const ReporterEdit = () => {
    return (
        <>
            <div className="mb-3 d-flex align-items-center">
                <Image width="100" height="100" src={bg} roundedCircle />
                <div className="w-100">
                    <div className="pb-4 d-flex justify-content-center">
                        <div className="d-flex">
                            <MokaInput as="switch" id="usedYn" name="usedYn" />
                            <MokaInputLabel as="none" label="노출 여부" className="m-0" />
                        </div>
                        <div className="d-flex">
                            <MokaInput as="switch" id="talkYn" name="usedYn" />
                            <MokaInputLabel as="none" label="기자에게 한마디 사용여부" labelWidth={170} className="m-0" />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" className="mr-05">
                            저장
                        </Button>
                        <Button variant="gray150">취소</Button>
                    </div>
                </div>
            </div>

            <hr />

            <Form className="px-4">
                <Form.Row className="d-flex justify-content-between">
                    <div>
                        <MokaInputLabel label="이름" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="김동규" name="repName" />
                        <MokaInputLabel label="소속 1" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="중앙일보" name="jamComNm" />
                        <MokaInputLabel label="소속 3" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="EYE24 담당" name="jplusJobInfo" />
                        <MokaInputLabel label="타입코드" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="Placeholder" name="" />
                        <MokaInputLabel label="중앙 ID" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="Placeholder" name="joinsId" />
                        <MokaInputLabel label="페이스북" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="Placeholder" name="snsFb" />
                        <MokaInputLabel label="인스타그램" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="Placeholder" name="snsIn" />
                    </div>
                    <div>
                        <MokaInputLabel label="표시 직책" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="편집국" name="" />
                        <MokaInputLabel label="소속 2" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="편집국" name="jamDeptNm" />
                        <MokaInputLabel label="소속 4" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="EYE24" name="repTitle" />
                        <MokaInputLabel label="집배신 이메일" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="Placeholder" name="" />
                        <MokaInputLabel label="분야" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="Placeholder" name="" />
                        <MokaInputLabel label="트위터" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="Placeholder" name="snsTw" />
                        <MokaInputLabel label="블로그" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="Placeholder" name="joinsBlog" />
                    </div>
                </Form.Row>
                <MokaInputLabel label="JNET ID" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="Placeholder" name="jnetId" />
                <Form.Row className="d-flex justify-content-between">
                    <div>
                        <MokaInputLabel label="JNET 이메일1" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="joongang@test.com" name="repEmail1" />
                        <MokaInputLabel label="JNET 이메일3" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="joongang@test.com" name="" />
                    </div>
                    <div>
                        <MokaInputLabel label="JNET 이메일2" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="joongang@test.com" name="repEmail2" />
                        <MokaInputLabel label="JNET 이메일4" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="joongang@test.com" name="" />
                    </div>
                </Form.Row>
                <MokaInputLabel label="기자 한마디" labelWidth={100} inputProps={{ plaintext: true, readOnly: true }} value="Placeholder" name="repTalk" />
            </Form>
        </>
    );
};

export default ReporterEdit;
