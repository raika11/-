import React, { useEffect, useState } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Container, Row, Col, Figure, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import commonUtil from '@utils/commonUtil';
import { clearSnsMeta, GET_SNS_META, getSnsMeta, initialState } from '@store/snsManage';

const FbArtEdit = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { totalId } = useParams();

    const [edit, setEdit] = useState(initialState.meta.meta);

    const tempOnchange = (e) => {};
    const { meta, errors, cdNm: fbToken, loading, search } = useSelector((store) => {
        return {
            meta: store.sns.meta.meta,
            cdNm: store.codeMgt.specialCharCode.cdNm,
            loading: store.loading[GET_SNS_META],
            errors: store.sns.meta.errors,
            search: store.sns.meta.search,
        };
    });

    const handleClickCancel = () => {
        history.push('/fb-art');
    };

    useEffect(() => {
        setEdit(meta);
    }, [meta]);

    useEffect(() => {
        if (!commonUtil.isEmpty(totalId)) {
            dispatch(getSnsMeta(totalId));
        } else {
            dispatch(clearSnsMeta());
        }
    }, [dispatch, totalId]);

    return (
        <>
            <MokaCard width={550} title={`페이스북 메타 ${true ? '정보' : '등록'}`} titleClassName="mb-0" loading={null}>
                <hr />
                <Container>
                    <Row xs={12}>
                        <Col xs={3} className="pr-0">
                            <div className="d-flex h4">원본 기사</div>
                        </Col>
                        <Col xs={4}>
                            <div className="d-flex">기사 ID {edit.totalId}</div>
                        </Col>
                    </Row>
                    <Row xs={12}>
                        <Col xs={4}>
                            <Figure.Image className="mb-0" src={edit.article.imgUrl} />
                        </Col>
                        <Col>
                            <div className="d-flex mb-3 display-5 font-weight-bold text-left">{edit.article.title}</div>
                            <div className="d-flex">
                                <MokaInput as={'textarea'} className="resize-none" value={edit.article.summary} inputProps={{ plaintext: true, readOnly: true, rows: '4' }} />
                            </div>
                        </Col>
                    </Row>
                </Container>
                <hr />
                <Container>
                    <Row xs={12}>
                        <Col xs={5} className="d-flex">
                            <div className="d-flex h4">페이스북 메타 정보</div>
                        </Col>
                    </Row>
                    <Row xs={12}>
                        <Col xs={4} className="d-flex p-0 m-0 pl-3" style={{ fontSize: '0.775rem' }}>
                            <Form.Label className="text-danger">{`SNS 이미지 (850*350 px)`}</Form.Label>
                        </Col>
                        <MokaInputLabel
                            labelClassName="d-flex p-0 pl-3"
                            label="사용유무"
                            labelWidth={80}
                            as="none"
                            name="temp-status"
                            id="temp-status"
                            variant="positive"
                            style={{ paddingLeft: '15px' }}
                        />
                        <MokaInputLabel
                            labelClassName="d-flex"
                            as="switch"
                            name="temp-status"
                            id="temp-status"
                            variant="positive"
                            inputProps={{ label: '', checked: edit.fb.usedYn }}
                        />
                    </Row>
                    <Row xs={12}>
                        <Col xs={4}>
                            <Figure.Image className="mb-0" src={edit.fb.imgUrl} />
                            <div className="d-flex justify-content-end mb-0 pt-3">
                                <div className="d-flex justify-content-end pr-2">
                                    <Button variant="outline-neutral">신규 등록</Button>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Button variant="outline-neutral">편집</Button>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <MokaInputLabel onChange={(e) => tempOnchange(e)} value={edit.fb.title} />
                            <MokaInput as="textarea" className="resize-none" value={edit.fb.postMessage} inputProps={{ rows: '5' }} onChange={(e) => tempOnchange(e)} />
                        </Col>
                    </Row>
                    <Row xs={12}>
                        <Col className="d-flex justify-content-end align-items-end pt-3">
                            <div className="justify-content-end align-items-end pr-2">수정정보 2020-12-03 09:36:00 </div>
                        </Col>
                    </Row>
                </Container>
                <hr />
                <div className="d-flex justify-content-center" style={{ marginTop: 30 }}>
                    <div className="d-flex justify-content-center">
                        <Button variant="positive" className="mr-05">
                            저장
                        </Button>
                        <Button variant="negative" className="mr-05" onClick={handleClickCancel}>
                            취소
                        </Button>
                    </div>
                </div>
            </MokaCard>
        </>
    );
};

export default FbArtEdit;
