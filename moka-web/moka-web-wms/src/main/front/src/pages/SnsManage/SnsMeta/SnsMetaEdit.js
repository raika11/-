import React, { useEffect, useState } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button, Figure } from 'react-bootstrap';
import SnsMetaModal from './modal/SnsMetaModal';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSnsMeta, GET_SNS_META, initialState } from '@store/snsManage';
import commonUtil from '@utils/commonUtil';
import toast from '@utils/toastUtil';

const SnsMetaEdit = () => {
    const [modalShow, setModalShow] = useState(false);
    const [edit, setEdit] = useState(initialState.meta.meta);
    const { totalId } = useParams();
    const dispatch = useDispatch();
    const { meta, errors, loading } = useSelector((store) => ({
        meta: store.sns.meta.meta,
        loading: store.loading[GET_SNS_META],
        errors: store.sns.meta.errors,
    }));

    const handleChangeCheckedValue = ({ target: { name } }) => {
        const divideName = name.split('-');
        const target = divideName[0];
        const targetName = divideName[1];
        setEdit({ ...edit, [target]: { ...edit[target], [targetName]: !edit[target][targetName] } });
    };

    const handleChangeTextValue = ({ target: { name, value } }) => {
        const divideName = name.split('-');
        const target = divideName[0];
        const targetName = divideName[1];
        setEdit({ ...edit, [target]: { ...edit[target], [targetName]: value } });
    };

    // 임시.
    const handleClickFBTokenManage = () => {
        setModalShow(true);
    };

    const tempFooterButtonClick = (e) => {
        console.log('tempFooterButtonClick', e);
    };

    useEffect(() => {
        if (errors) {
            toast.result(errors);
        }
    }, [errors]);

    useEffect(() => {
        setEdit(meta);
    }, [meta]);

    useEffect(() => {
        if (!commonUtil.isEmpty(totalId)) {
            dispatch(getSnsMeta(totalId));
        }
    }, [dispatch, totalId]);

    return (
        <MokaCard
            width={550}
            title={`메타 ${true ? '정보' : '등록'}`}
            titleClassName="mb-0"
            loading={loading}
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '전송', variant: 'positive', onClick: tempFooterButtonClick, className: 'mr-05' },
                { text: '임시저장', variant: 'positive', onClick: tempFooterButtonClick, className: 'mr-05' },
                { text: '미리보기', variant: 'outline-neutral', onClick: tempFooterButtonClick, className: 'mr-05' },
            ]}
            footer
        >
            <hr />

            {/* 페이스북 */}
            <Form.Row>
                <Col xs={12} className="pb-4">
                    <div className="d-flex">
                        <MokaInputLabel label="Facebook" labelWidth={70} className="m-0 h5" as="none" />
                        <div className="d-flex justify-content-center">
                            <Button variant="outline-neutral" className="mr-05">
                                FB 전송
                            </Button>
                            <Button variant="outline-neutral" className="mr-05">
                                FB 캐시삭제
                            </Button>
                            <Button variant="outline-neutral" className="mr-05" onClick={(e) => handleClickFBTokenManage(e)}>
                                토큰 관리
                            </Button>
                            <Button variant="outline-neutral" className="mr-05">
                                공유
                            </Button>
                            <Button variant="outline-neutral" className="mr-05">
                                TW로 복사
                            </Button>
                        </div>
                    </div>
                </Col>
            </Form.Row>

            <Form className="mb-gutter">
                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel
                            as="switch"
                            name="fb-usedYn"
                            id="fb-usedYn"
                            label="사용유무"
                            onChange={handleChangeCheckedValue}
                            labelWidth={87}
                            inputProps={{ label: '', checked: edit.fb.usedYn }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel label="타이틀" name="fb-title" onChange={handleChangeTextValue} labelWidth={87} value={edit.fb.title} />
                    </Col>
                </Form.Row>

                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel
                            as="textarea"
                            name="fb-summary"
                            label="설명(리드문)"
                            inputClassName="resize-none"
                            onChange={handleChangeTextValue}
                            labelWidth={87}
                            value={edit.fb.summary}
                        />
                    </Col>
                </Form.Row>

                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel
                            as="textarea"
                            name="fb-postMessage"
                            label="메시지"
                            inputClassName="resize-none"
                            onChange={handleChangeTextValue}
                            labelWidth={87}
                            value={edit.fb.postMessage}
                        />
                    </Col>
                </Form.Row>

                <Form.Row xs={12}>
                    <Col xs={2}>
                        <MokaInputLabel as="none" label="SNS 이미지" labelWidth={87} />
                        <MokaInputLabel as="none" label="(850*350px)" labelWidth={87} />
                    </Col>
                    <Col xs={8} className="pl-2">
                        <Col>
                            <Figure.Image className="mb-0" src={meta.fb.metaImage} />
                        </Col>
                        <Col>
                            <Form.Label className="text-danger">1200*628 이미지 용량 제한: 1MB.</Form.Label>
                        </Col>
                    </Col>
                    <Col xs={2} className="pb-5 align-self-end">
                        <Col xs={2} className="pl-0 pb-1">
                            <Button variant="outline-neutral">편집</Button>
                        </Col>
                        <Col xs={2} className="pl-0">
                            <Button variant="outline-neutral">신규 등록</Button>
                        </Col>
                    </Col>
                </Form.Row>
                <Form.Row xs={12}>
                    <Col xs={2}>
                        <MokaInputLabel as="none" label="예약" labelWidth={87} />
                    </Col>
                    <Col xs={4} className="d-flex pl-4 mr-0 pr-1">
                        <Form.Check label="예약 노출" type="checkbox" name="fb-isReserve" onChange={handleChangeCheckedValue} checked={edit.fb.isReserve} />
                    </Col>
                    <Col xs={5} className="d-flex pl-0">
                        <MokaInput
                            as="dateTimePicker"
                            name="fb-reserveDt"
                            value={edit.fb.reserveDt}
                            onChange={handleChangeTextValue}
                            inputProps={{ dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' }}
                            disabled={!edit.fb.isReserve}
                        />
                    </Col>
                </Form.Row>
            </Form>

            <hr />

            {/* 트위터 */}
            <Form.Row>
                <Col xs={12} className="pb-4">
                    <div className="d-flex">
                        <MokaInputLabel label="Twitter" labelWidth={70} className="m-0 h5" as="none" />
                        <Col className="d-flex justify-content-end">
                            <div className="justify-content-end pr-2">
                                <Button variant="outline-neutral" className="mr-05">
                                    TW 전송
                                </Button>
                            </div>
                            <div className="justify-content-end pr-2">
                                <Button variant="outline-neutral" className="mr-05">
                                    TW 캐시삭제
                                </Button>
                            </div>
                            <div className="justify-content-end pr-2">
                                <Button variant="outline-neutral" className="mr-05">
                                    FB로 복사
                                </Button>
                            </div>
                        </Col>
                    </div>
                </Col>
            </Form.Row>

            <Form className="mb-gutter">
                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel
                            as="switch"
                            name="tw-usedYn"
                            id="tw-usedYn"
                            label="사용유무"
                            variant="positive"
                            onChange={handleChangeCheckedValue}
                            labelWidth={87}
                            inputProps={{ label: '', checked: edit.tw.usedYn }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel label="타이틀" name="tw-title" onChange={handleChangeTextValue} labelWidth={87} value={edit.tw.title} />
                    </Col>
                </Form.Row>

                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel
                            as="textarea"
                            name="tw-summary"
                            label="설명(리드문)"
                            inputClassName="resize-none"
                            onChange={handleChangeTextValue}
                            labelWidth={87}
                            value={edit.tw.summary}
                        />
                    </Col>
                </Form.Row>

                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel
                            as="textarea"
                            name="tw-postMessage"
                            label="메시지"
                            inputClassName="resize-none"
                            onChange={handleChangeTextValue}
                            labelWidth={87}
                            value={edit.tw.postMessage}
                        />
                    </Col>
                </Form.Row>

                <Form.Row xs={12}>
                    <Col xs={2}>
                        <MokaInputLabel as="none" label="SNS 이미지" labelWidth={87} />
                        <MokaInputLabel as="none" label="(850*350px)" labelWidth={87} />
                    </Col>
                    <Col xs={8} className="pl-2">
                        <Col>
                            <Figure.Image className="mb-0" src={edit.tw.metaImage} />
                        </Col>
                        <Col>
                            <Form.Label className="text-danger">1200*628 이미지 용량 제한: 1MB.</Form.Label>
                        </Col>
                    </Col>
                    <Col xs={2} className="pb-5 align-self-end">
                        <Col xs={2} className="pl-0 pb-1">
                            <Button variant="outline-neutral">편집</Button>
                        </Col>
                        <Col xs={2} className="pl-0">
                            <Button variant="outline-neutral">신규 등록</Button>
                        </Col>
                    </Col>
                </Form.Row>
                <Form.Row xs={12}>
                    <Col xs={2}>
                        <MokaInputLabel as="none" label="예약" labelWidth={87} />
                    </Col>
                    <Col xs={4} className="d-flex pl-4 mr-0 pr-1">
                        <Form.Check label="예약 노출" type="checkbox" name="tw-isReserve" onChange={handleChangeCheckedValue} checked={edit.tw.isReserve} />
                    </Col>
                    <Col xs={5} className="d-flex pl-0">
                        <MokaInput
                            as="dateTimePicker"
                            name="tw-reserveDt"
                            value={edit.tw.reserveDt}
                            onChange={handleChangeTextValue}
                            inputProps={{ dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' }}
                            disabled={!edit.tw.isReserve}
                        />
                    </Col>
                </Form.Row>
            </Form>

            <SnsMetaModal show={modalShow} onHide={() => setModalShow(false)} onClickSave={null} />
        </MokaCard>
    );
};

export default SnsMetaEdit;
