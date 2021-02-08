import React, { useEffect, useState } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Container, Row, Col, Figure, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import commonUtil from '@utils/commonUtil';
import { clearSnsMeta, GET_SNS_META, getSnsMeta, getSnsSendArticleList, initialState, publishSnsMeta } from '@store/snsManage';
import toast from '@utils/toastUtil';
import { snsNames } from '@/constants';
import { EditThumbModal } from '@pages/Desking/modals';
import imageEditer from '@utils/imageEditorUtil';
import moment from 'moment';

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
                    className: 'mr-2',
                    onClick: handleClickPublish,
                    useAuth: true,
                },
                { text: '취소', variant: 'negative', onClick: handleClickCancel },
            ]}
        >
            <Container>
                <Row className="mb-2">
                    <Col xs={4} className="p-0">
                        <p className="h6 mb-0">원본 기사</p>
                    </Col>
                    <Col xs={8} className="p-0">
                        기사 ID {edit.totalId}
                    </Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={4} className="p-0">
                        <Figure.Image className="mb-0" src={edit.article.imgUrl} />
                    </Col>
                    <Col xs={8} className="p-0">
                        <div className="d-flex mb-2 display-5 font-weight-bold text-left">{edit.article.title}</div>
                        <MokaInput as="textarea" className="resize-none custom-scroll" value={edit.article.summary} inputProps={{ readOnly: true, rows: 6 }} />
                    </Col>
                </Row>
            </Container>

            <hr />

            <Container>
                <Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <p className="h6 mb-0">페이스북 메타 정보</p>
                    </Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={4} className="p-0">
                        <p className="text-danger mb-0 ft-12">SNS 이미지 (850*350 px)</p>
                    </Col>
                    <MokaInputLabel
                        labelClassName="d-flex"
                        label="사용유무"
                        as="switch"
                        name="usedYn"
                        id="temp-status"
                        variant="positive"
                        onChange={(e) => {
                            handleChangeEditValue(e, true);
                        }}
                        inputProps={{ label: '', checked: edit.fb.usedYn }}
                    />
                </Row>

                <Row className="mb-2">
                    <Col xs={4} className="p-0 pr-2">
                        <Figure.Image className="mb-0" src={edit.fb.imgUrl} />
                        <div className="d-flex justify-content-end mb-0 pt-3">
                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="positive"
                                    onClick={() => {
                                        setShowEditThumbModal(true);
                                    }}
                                    size="sm"
                                    className="mr-2"
                                >
                                    신규 등록
                                </Button>

                                <Button variant="outline-neutral" size="sm" onClick={handleEditClick}>
                                    편집
                                </Button>
                            </div>
                        </div>
                    </Col>

                    <Col xs={8} className="p-0">
                        <MokaInputLabel name="title" onChange={handleChangeEditValue} value={edit.fb.title} className="mb-2" />
                        <MokaInput
                            as="textarea"
                            name="postMessage"
                            className="resize-none custom-scroll"
                            value={edit.fb.postMessage}
                            inputProps={{ rows: 5 }}
                            onChange={handleChangeEditValue}
                        />
                    </Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <div className="d-flex justify-content-end">수정정보 {edit.article.snsRegDt}</div>
                    </Col>
                </Row>
            </Container>

            <EditThumbModal
                show={showEditThumbModal}
                cropHeight={300}
                cropWidth={300}
                onHide={() => setShowEditThumbModal(false)}
                contentId={totalId}
                thumbFileName={edit.fb.imgUrl}
                saveFileName={moment().format('YYYYMMDDsss')}
                apply={handleThumbFileApply}
            />
        </MokaCard>
    );
};

export default FbArtEdit;
