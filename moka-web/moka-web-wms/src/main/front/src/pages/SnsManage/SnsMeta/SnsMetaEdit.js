import React, { useEffect, useState } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button, Figure } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSnsMeta, GET_SNS_META, initialState, clearSnsMeta, saveSnsMeta, publishSnsMeta, getSNSMetaList } from '@store/snsManage';
import commonUtil from '@utils/commonUtil';
import toast from '@utils/toastUtil';
import SnsPreviewModal from '@pages/SnsManage/SnsMeta/modal/SnsPreviewModal';
import { DB_DATEFORMAT, snsNames } from '@/constants';
import DefaultInputModal from '@pages/commons/DefaultInputModal';
import { changeSpecialCharCode, getSpecialCharCode, saveSpecialCharCode } from '@store/codeMgt';
import moment from 'moment';
import { EditThumbModal } from '@pages/Desking/modals';

const SnsMetaEdit = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { totalId } = useParams();

    const [isFacebookTokenModalOpen, setIsFacebookTokenModalOpen] = useState(false);
    const [articlePreviewModalShow, setArticlePreviewModalShow] = useState(false);
    const [edit, setEdit] = useState(initialState.meta.meta);

    const [isTwitterImageModalOpen, setIsTwitterImageModalOpen] = useState(false);
    const [isFacebookImageModalOpen, setIsFacebookImageModalOpen] = useState(false);

    const { meta, errors, cdNm: fbToken, loading, search } = useSelector((store) => {
        return {
            meta: store.sns.meta.meta,
            cdNm: store.codeMgt.specialCharCode.cdNm,
            loading: store.loading[GET_SNS_META],
            errors: store.sns.meta.errors,
            search: store.sns.meta.search,
        };
    });

    const handleChangeCheckedValue = ({ target: { name } }) => {
        const divideName = name.split('-');
        const snsType = divideName[0];
        const targetName = divideName[1];

        if (!edit[snsType][targetName] === false) {
            setEdit({ ...edit, [snsType]: { ...edit[snsType], [targetName]: !edit[snsType][targetName], reserveDt: null } });
        } else {
            changeEditValue(snsType, targetName, !edit[snsType][targetName]);
        }
    };

    const handleChangeTextValue = ({ target: { name, value } }) => {
        const divideName = name.split('-');
        const snsType = divideName[0];
        const targetName = divideName[1];
        changeEditValue(snsType, targetName, value);
    };

    const changeEditValue = (snsType, targetName, value) => {
        setEdit({ ...edit, [snsType]: { ...edit[snsType], [targetName]: value } });
    };

    const handleClickCancel = () => {
        history.push('/sns-meta');
    };

    // 임시.
    const handleClickFbTokenModalShow = () => {
        dispatch(getSpecialCharCode({ grpCd: 'specialChar', dtlCd: 'fbToken' }));
        setIsFacebookTokenModalOpen(true);
    };

    const handleClickFbTokenModalHide = () => {
        setIsFacebookTokenModalOpen(false);
    };

    const handleClickFbTokenModalSave = ({ value: token }) => {
        dispatch(changeSpecialCharCode(token));
        dispatch(
            saveSpecialCharCode({
                grpCd: 'specialChar',
                dtlCd: 'fbToken',
                cdNm: token,
                callback: (response) => {
                    toast.result(response);
                    if (response.header.success) {
                        setIsFacebookTokenModalOpen(false);
                    }
                },
            }),
        );
    };

    const handleClickArticlePreviewModalShow = () => {
        setArticlePreviewModalShow(true);
    };

    const handleClickArticlePreviewModalHide = () => {
        setArticlePreviewModalShow(false);
    };

    const handleClickPublish = (type) => {
        snsMetaSave(type);
    };

    const handleClickSave = () => {
        const data = [
            { ...edit['fb'], snsType: 'FB' },
            { ...edit['tw'], snsType: 'TW' },
        ];

        if (validSaveData(data)) {
            dispatch(
                saveSnsMeta({
                    totalId: edit.totalId,
                    data,
                    callback: (response) => {
                        dispatch(getSnsMeta(totalId));
                        dispatch(getSNSMetaList({ payload: search }));
                        toast.result(response);
                    },
                }),
            );
        }
        //snsMetaSave('all');
    };

    const snsMetaSave = (type) => {
        let data = [{ ...edit[type], snsType: type.toUpperCase() }];
        if (type === 'all') {
            data = [
                { ...edit['fb'], snsType: 'FB' },
                { ...edit['tw'], snsType: 'TW' },
            ];
        }
        if (validSaveData(data, 'send')) {
            dispatch(
                publishSnsMeta({
                    totalId: edit.totalId,
                    data,
                    callback: (response) => {
                        dispatch(getSnsMeta(totalId));
                        dispatch(getSNSMetaList({ payload: search }));
                        toast.result(response);
                    },
                }),
            );
        }
    };

    const validSaveData = (data, type) => {
        for (const item of data) {
            const snsTypeEng = item.snsType.toLowerCase();
            const snsKor = snsNames[snsTypeEng];

            if (commonUtil.isEmpty(item.title)) {
                toast.warning(`${snsKor} 제목을 입력해 주세요.`);
                return false;
            }

            if (commonUtil.isEmpty(item.summary)) {
                toast.warning(`${snsKor} 설명을 입력해 주세요.`);
                return false;
            }

            if (item.isReserve) {
                if (commonUtil.isEmpty(item.reserveDt)) {
                    toast.warning(`${snsKor} 예약일자를 입력해 주세요.`);
                    return false;
                }
            }

            if (type === 'send') {
                if (commonUtil.isEmpty(item.postMessage)) {
                    toast.warning(`${snsKor} 메세지를 입력해 주세요.`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleClickCopyContent = (from) => {
        try {
            let to = '';
            switch (from) {
                case 'tw':
                    to = 'fb';
                    break;
                case 'fb':
                    to = 'tw';
                    break;
            }
            setEdit({ ...edit, [to]: edit[from] });
            toast.info(`${snsNames[from]}에서 ${snsNames[to]}로 복사 되었습니다.`);
        } catch (e) {
            toast.warning('오류가 발생 했습니다. 관리자에게 문의하세요.');
            console.log(e);
        }
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
        } else {
            dispatch(clearSnsMeta());
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
                { text: '전송', variant: 'positive', onClick: () => handleClickPublish('all'), className: 'mr-05' },
                { text: '임시저장', variant: 'positive', onClick: handleClickSave, className: 'mr-05' },
                { text: '취소', variant: 'negative', onClick: handleClickCancel, className: 'mr-05' },
                { text: '기사보기', variant: 'outline-neutral', onClick: handleClickArticlePreviewModalShow, className: 'mr-05' },
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
                            <Button
                                variant="outline-neutral"
                                className="mr-05"
                                onClick={() => {
                                    handleClickPublish('fb');
                                }}
                            >
                                FB 전송
                            </Button>
                            <Button
                                variant="outline-neutral"
                                className="mr-05"
                                onClick={() => {
                                    window.open(`https://developers.facebook.com/tools/debug/?q=https://mnews.joins.com/article/${totalId}`);
                                }}
                            >
                                FB 캐시삭제
                            </Button>
                            <Button variant="outline-neutral" className="mr-05" onClick={handleClickFbTokenModalShow}>
                                토큰 관리
                            </Button>
                            <Button
                                variant="outline-neutral"
                                className="mr-05"
                                onClick={() => {
                                    window.open(`https://www.facebook.com/sharer.php?u=https://mnews.joins.com/article/${totalId}`, '', 'width=500,height=500');
                                }}
                            >
                                공유
                            </Button>
                            <Button
                                variant="outline-neutral"
                                className="mr-05"
                                onClick={() => {
                                    handleClickCopyContent('fb');
                                }}
                            >
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
                            <Figure.Image className="mb-0" src={meta.fb.imgUrl} />
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
                            <Button
                                variant="outline-neutral"
                                onClick={() => {
                                    setIsTwitterImageModalOpen(true);
                                }}
                            >
                                신규 등록
                            </Button>
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
                            onChange={(e) => {
                                handleChangeTextValue({ target: { name: 'fb-reserveDt', value: new Date(moment(e._d).format(DB_DATEFORMAT)) } });
                            }}
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
                                <Button
                                    variant="outline-neutral"
                                    className="mr-05"
                                    onClick={() => {
                                        handleClickPublish('tw');
                                    }}
                                >
                                    TW 전송
                                </Button>
                            </div>
                            <div className="justify-content-end pr-2">
                                <Button
                                    variant="outline-neutral"
                                    className="mr-05"
                                    onClick={() => {
                                        window.open('https://cards-dev.twitter.com/validator');
                                    }}
                                >
                                    TW 캐시삭제
                                </Button>
                            </div>
                            <div className="justify-content-end pr-2">
                                <Button
                                    variant="outline-neutral"
                                    className="mr-05"
                                    onClick={() => {
                                        handleClickCopyContent('tw');
                                    }}
                                >
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
                            <Figure.Image className="mb-0" src={edit.tw.imgUrl} />
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
                            <Button
                                variant="outline-neutral"
                                onClick={() => {
                                    setIsFacebookImageModalOpen(true);
                                }}
                            >
                                신규 등록
                            </Button>
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
                            onChange={(e) => {
                                handleChangeTextValue({ target: { name: 'tw-reserveDt', value: moment(e._d).format(DB_DATEFORMAT) } });
                            }}
                            inputProps={{ dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' }}
                            disabled={!edit.tw.isReserve}
                        />
                    </Col>
                </Form.Row>
            </Form>

            <DefaultInputModal
                title="페이스북 관리용 토큰"
                inputData={{ title: '페이스북 토큰', value: fbToken, isInvalid: false }}
                show={isFacebookTokenModalOpen}
                onHide={handleClickFbTokenModalHide}
                onSave={handleClickFbTokenModalSave}
            />
            <SnsPreviewModal show={articlePreviewModalShow} onHide={handleClickArticlePreviewModalHide} totalId={totalId} />
            <EditThumbModal
                show={isFacebookImageModalOpen}
                onHide={() => setIsFacebookImageModalOpen(false)}
                setFileValue={(data) => console.log('fb-setFileValue', data)}
                thumbFileName={edit.fb.imgUrl}
                setThumbFileName={(data) => console.log('fb-handleThumbFileName', data)}
            />
            <EditThumbModal
                show={isTwitterImageModalOpen}
                onHide={() => setIsTwitterImageModalOpen(false)}
                setFileValue={(data) => console.log('tw-setFileValue', data)}
                thumbFileName={edit.tw.imgUrl}
                setThumbFileName={(data) => console.log('tw-handleThumbFileName', data)}
            />
        </MokaCard>
    );
};

export default SnsMetaEdit;
