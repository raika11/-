import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { snsNames } from '@/constants';
import { clearSnsMeta, GET_SNS_META, getSnsMeta, getSnsSendArticleList, initialState, publishSnsMeta } from '@store/snsManage';
import toast from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';
import imageEditer from '@utils/imageEditorUtil';
import { MokaCard, MokaInputLabel, MokaInput, MokaImage, MokaImageInput } from '@components';
import { EditThumbModal } from '@pages/Desking/modals';

const FbArtEdit = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { totalId } = useParams();

    const [showEditThumbModal, setShowEditThumbModal] = useState(false);
    const [edit, setEdit] = useState(initialState.meta.meta);

    const { meta, loading, search } = useSelector((store) => {
        return {
            meta: store.sns.meta.meta,
            cdNm: store.codeMgt.specialCharCode.cdNm,
            loading: store.loading[GET_SNS_META],
            errors: store.sns.meta.errors,
            search: store.sns.meta.search,
        };
    });

    const handleChangeEditValue = ({ target: { name, value } }, isCheckedValue = false) => {
        console.log(edit);
        if (isCheckedValue) {
            value = !edit['fb'].usedYn;
        }
        setEdit({ ...edit, fb: { ...edit['fb'], [name]: value } });
    };

    const handleClickCancel = () => {
        dispatch(clearSnsMeta());
        history.push('/fb-art');
    };

    const handleClickPublish = () => {
        let data = [{ ...edit['fb'], snsType: 'FB' }];

        if (validSaveData(data)) {
            dispatch(
                publishSnsMeta({
                    totalId: edit.totalId,
                    data,
                    callback: (response) => {
                        dispatch(getSnsMeta(totalId));
                        dispatch(getSnsSendArticleList({ payload: search }));
                        toast.result(response);
                    },
                }),
            );
        }
    };

    const validSaveData = (data) => {
        for (const item of data) {
            const snsTypeEng = item.snsType.toLowerCase();
            const snsKor = snsNames[snsTypeEng];

            if (commonUtil.isEmpty(item.title)) {
                toast.warning(`${snsKor} 제목을 입력해 주세요.`);
                return false;
            }

            if (commonUtil.isEmpty(item.postMessage)) {
                toast.warning(`${snsKor} 메세지를 입력해 주세요.`);
                return false;
            }
        }

        return true;
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

    const handleThumbFileApply = (imageSrc, file) => {
        setEdit({ ...edit, fb: { ...edit['fb'], imgUrl: imageSrc, imgFile: file || null } });
    };

    const handleEditClick = () => {
        imageEditer.create(
            edit.fb.imgUrl,
            (imageSrc) => {
                (async () => {
                    await fetch(imageSrc)
                        .then((r) => r.blob())
                        .then((blobFile) => {
                            const file = commonUtil.blobToFile(blobFile, moment().format('YYYYMMDDsss'));
                            setEdit({ ...edit, fb: { ...edit['fb'], imgUrl: imageSrc, imgFile: file || null } });
                        });
                })();
            },
            { cropWidth: 300, cropHeight: 300 },
        );
    };

    return (
        <MokaCard
            width={550}
            title={`페이스북 메타 ${true ? '정보' : '등록'}`}
            titleClassName="mb-0"
            loading={loading}
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                {
                    text: '저장',
                    variant: 'positive',
                    className: 'mr-1',
                    onClick: handleClickPublish,
                    useAuth: true,
                },
                { text: '취소', variant: 'negative', onClick: handleClickCancel },
            ]}
        >
            {/* 기사정보 */}
            <div>
                {/*<Row className="m-0">
                    <Col xs={4} className="p-0 pr-12"></Col>
                    <Col xs={8} className="p-0 text-neutral">
                        <span className="ft-12">ID {edit.totalId}</span>
                    </Col>
                </Row>*/}

                <Row className="m-0 mb-2">
                    <Col xs={12} className="p-0 pr-12 d-flex align-items-center">
                        <Form.Label className="mb-0 h4 font-weight-bold color-gray-800 mr-12" style={{ width: '70px' }}>
                            원본 기사
                        </Form.Label>
                        <span className="ft-12 text-neutral">ID {edit.totalId}</span>
                    </Col>
                </Row>

                <Row className="m-0">
                    <Col xs={4} className="p-0 pr-12">
                        <MokaImage width={155} img={edit.article.imgUrl} />
                    </Col>
                    <Col xs={8} className="p-0">
                        {/*<MokaInput value={edit.article.title} inputProps={{ plaintext: true }} className="font-weight-bold pt-0" disabled />*/}
                        <div className="flex-fill font-weight-bold pt-0 form-control-plaintext" title={edit.article.title}>
                            {edit.article.title}
                        </div>
                        <MokaInput as="textarea" className="resize-none custom-scroll bg-white" value={edit.article.summary} inputProps={{ readOnly: true, rows: 6 }} />
                    </Col>
                </Row>
            </div>

            <hr className="divider my-32" />

            {/* 페이스북 메타 정보 */}
            <div>
                <Row className="m-0 mb-2">
                    <Col xs={4} className="p-0 pr-12 d-flex align-items-center">
                        <p className="mb-0 h4 font-weight-bold color-gray-800">페이스북 메타 정보</p>
                    </Col>
                    <Col xs={8} className="p-0">
                        <MokaInputLabel
                            labelClassName="ft-13"
                            label="사용여부"
                            labelWidth={50}
                            as="switch"
                            name="usedYn"
                            id="temp-status"
                            variant="positive"
                            onChange={(e) => {
                                handleChangeEditValue(e, true);
                            }}
                            inputProps={{ checked: edit.fb.usedYn }}
                        />
                    </Col>
                </Row>

                <Row className="m-0 mb-2">
                    <Col xs={4} className="p-0 pr-12 d-flex flex-column justify-content-between">
                        <div className="d-flex flex-column justify-content-start">
                            <MokaImageInput width={155} img={edit.fb.imgUrl} className="mb-1" deleteButton={true} />
                            <p className="text-danger mb-0">SNS 이미지 (850*350px)</p>
                        </div>
                        <div>
                            <Button
                                variant="gray-700"
                                onClick={() => {
                                    setShowEditThumbModal(true);
                                }}
                                size="sm"
                                className="mr-1"
                            >
                                신규등록
                            </Button>

                            <Button variant="outline-gray-700" size="sm" onClick={handleEditClick}>
                                편집
                            </Button>
                        </div>
                    </Col>

                    <Col xs={8} className="p-0">
                        <MokaInputLabel name="title" onChange={handleChangeEditValue} value={edit.fb.title} className="mb-2" />
                        <MokaInput
                            as="textarea"
                            name="summary"
                            className="resize-none custom-scroll"
                            value={edit.fb.summary}
                            inputProps={{ rows: 5 }}
                            onChange={handleChangeEditValue}
                        />
                    </Col>
                </Row>

                <Row className="m-0 mb-2">
                    <Col xs={12} className="p-0 d-flex justify-content-end">
                        <span className="ft-12">수정정보 {edit.article.snsRegDt}</span>
                    </Col>
                </Row>
            </div>

            <EditThumbModal
                show={showEditThumbModal}
                cropHeight={300}
                cropWidth={300}
                onHide={() => setShowEditThumbModal(false)}
                totalId={totalId}
                thumbFileName={edit.fb.imgUrl}
                saveFileName={moment().format('YYYYMMDDsss')}
                apply={handleThumbFileApply}
            />
        </MokaCard>
    );
};

export default FbArtEdit;
