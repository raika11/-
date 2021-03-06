import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Form, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { DB_DATEFORMAT, snsNames } from '@/constants';
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
    const { meta, loading, search } = useSelector((store) => ({
        meta: store.sns.meta.meta,
        cdNm: store.codeMgt.specialCharCode.cdNm,
        loading: store.loading[GET_SNS_META],
        errors: store.sns.meta.errors,
        search: store.sns.sendArticle.search,
    }));
    const [showEditThumbModal, setShowEditThumbModal] = useState(false);
    const [edit, setEdit] = useState(initialState.meta.meta);

    const handleChangeEditValue = ({ target: { name, value } }, isCheckedValue = false) => {
        let cpEdit = { ...edit };
        if (isCheckedValue) {
            value = !edit['fb'][name];
            if (name === 'isReserve') {
                cpEdit = { ...cpEdit, fb: { ...cpEdit['fb'], reserveDt: null } };
            }
        }
        setEdit({ ...cpEdit, fb: { ...cpEdit['fb'], [name]: value } });
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

            if (!item.usedYn) {
                toast.warning(`?????????????????? ???????????? ????????????. ???????????? ????????? ?????? ????????? ?????????(${snsKor})`);
                return false;
            }

            if (commonUtil.isEmpty(item.title)) {
                toast.warning(`${snsKor} ????????? ????????? ?????????.`);
                return false;
            }

            if (commonUtil.isEmpty(item.postMessage)) {
                toast.warning(`${snsKor} ???????????? ????????? ?????????.`);
                return false;
            }
        }

        return true;
    };

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
        <MokaCard
            title={`???????????? ?????? ${true ? '??????' : '??????'}`}
            className="w-100 flex-fill"
            loading={loading}
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                {
                    text: '??????',
                    variant: 'positive',
                    className: 'mr-1',
                    onClick: handleClickPublish,
                    useAuth: true,
                },
                { text: '??????', variant: 'negative', onClick: handleClickCancel },
            ]}
        >
            {/* ???????????? */}
            <div className="d-flex mb-1">
                <Col xs={4} className="p-0 pr-12 d-flex align-items-center">
                    <Form.Label className="mb-0 h4 font-weight-bold color-gray-800 mr-12" style={{ width: '70px' }}>
                        ?????? ??????
                    </Form.Label>
                    <span className="ft-12 text-neutral">ID {edit.totalId}</span>
                </Col>
                <Col xs={8} className="p-0">
                    <div className="flex-fill form-control-plaintext text-truncate">
                        <OverlayTrigger overlay={<Tooltip id="title-overlay">{edit.article.title}</Tooltip>}>
                            <span className="font-weight-bold">{edit.article.title}</span>
                        </OverlayTrigger>
                    </div>
                </Col>
            </div>
            <div className="d-flex">
                <Col xs={4} className="p-0 pr-12">
                    <MokaImage width={190} img={edit.article.imgUrl} />
                </Col>
                <Col xs={8} className="p-0">
                    <MokaInput as="textarea" className="resize-none custom-scroll bg-white" value={edit.article.summary} inputProps={{ readOnly: true, rows: 6 }} />
                </Col>
            </div>

            <hr />

            {/* ???????????? ?????? ?????? */}
            <div>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        as="switch"
                        name="usedYn"
                        id="fb-usedYn"
                        label="????????????"
                        onChange={(e) => {
                            handleChangeEditValue(e, true);
                        }}
                        inputProps={{ label: '', checked: edit.fb.usedYn }}
                    />
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="?????????" name="title" onChange={handleChangeEditValue} value={edit.fb.title} />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            name="summary"
                            label="??????\n(?????????)"
                            inputClassName="resize-none custom-scroll"
                            onChange={handleChangeEditValue}
                            value={edit.fb.summary}
                            inputProps={{ rows: 4 }}
                        />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-1">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            name="postMessage"
                            label="?????????"
                            inputClassName="resize-none custom-scroll"
                            onChange={handleChangeEditValue}
                            value={edit.fb.postMessage}
                        />
                    </Col>
                </Form.Row>
                <div className="mb-2 p-0 d-flex justify-content-end">
                    <span>1??? 25??? ??????</span>
                </div>

                <Form.Row className="align-items-end">
                    <MokaInputLabel
                        as="none"
                        label={
                            <div style={{ paddingBottom: '6px' }}>
                                <p className="mb-2">
                                    SNS ?????????
                                    <br />
                                    850*350px
                                </p>
                                <Button variant="gray-700" size="sm" onClick={() => setShowEditThumbModal(true)} className="w-100 mb-1">
                                    ????????????
                                </Button>
                                <Button variant="outline-gray-700" size="sm" className="w-100" onClick={handleEditClick}>
                                    ??????
                                </Button>

                                <EditThumbModal
                                    show={showEditThumbModal}
                                    cropHeight={300}
                                    cropWidth={300}
                                    onHide={() => setShowEditThumbModal(false)}
                                    totalId={totalId}
                                    thumbFileName={edit.fb.imgUrl}
                                    saveFileName={moment().format('YYYYMMDDsss')}
                                    apply={handleThumbFileApply}
                                    accept="image/jpeg, image/gif"
                                />
                            </div>
                        }
                    />
                    <MokaImageInput className="mr-20" img={edit.fb.imgUrl} width={192} deleteButton />
                    <Col xs={6} className="p-0 d-flex flex-column justify-content-end">
                        <MokaInput
                            as="checkbox"
                            name="isReserve"
                            id="fb-isReserve"
                            className="mb-2"
                            onChange={(e) => handleChangeEditValue(e, true)}
                            inputProps={{ label: '?????? ??????', checked: edit.fb.isReserve, custom: true }}
                        />
                        <MokaInput
                            as="dateTimePicker"
                            name="reserveDt"
                            className="right top"
                            value={edit.fb.reserveDt}
                            onChange={(e) => {
                                handleChangeEditValue({ target: { name: 'reserveDt', value: new Date(moment(e._d).format(DB_DATEFORMAT)) } });
                            }}
                            inputProps={{ dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm', width: 180 }}
                            disabled={!edit.fb.isReserve}
                        />
                    </Col>
                </Form.Row>

                <div className="mt-1 d-flex">
                    <MokaInputLabel as="none" label=" " />
                    <p className="text-danger mb-0">1200*628 ????????? ?????? ??????: 1MB.</p>
                </div>
            </div>
        </MokaCard>
    );
};

export default FbArtEdit;
