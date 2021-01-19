import React, { useEffect, useState } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button, Figure } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSnsMeta, GET_SNS_META, initialState, clearSnsMeta, saveSnsMeta, publishSnsMeta, getSnsMetaList, clearSnsMetaList } from '@store/snsManage';
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
        dispatch(clearSnsMeta());
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
        let data = [{ ...edit[type], snsType: type.toUpperCase() }];
        if (type === 'all') {
            data = [
                { ...edit['fb'], snsType: 'FB' },
                { ...edit['tw'], snsType: 'TW' },
            ];
        }
        if (validSaveData(data, 'send')) {
            dispatch(clearSnsMetaList());
            dispatch(
                publishSnsMeta({
                    totalId: edit.totalId,
                    data,
                    callback: (response) => {
                        dispatch(getSnsMeta(totalId));
                        dispatch(getSnsMetaList({ payload: search }));
                        toast.result(response);
                    },
                }),
            );
        }
    };

    const handleClickSave = () => {
        const data = [
            { ...edit['fb'], snsType: 'FB' },
            { ...edit['tw'], snsType: 'TW' },
        ];

        if (validSaveData(data)) {
            dispatch(clearSnsMetaList());
            dispatch(
                saveSnsMeta({
                    totalId: edit.totalId,
                    data,
                    callback: (response) => {
                        dispatch(getSnsMeta(totalId));
                        dispatch(getSnsMetaList({ payload: search }));
                        toast.result(response);
                    },
                }),
            );
        }
        //snsMetaSave('all');
    };

    // const snsMetaSave = (type) => {};

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
                default:
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
                { text: '전송', variant: 'positive', onClick: () => handleClickPublish('all'), className: 'mr-2' },
                { text: '임시저장', variant: 'positive', onClick: handleClickSave, className: 'mr-2' },
                { text: '취소', variant: 'negative', onClick: handleClickCancel, className: 'mr-2' },
                { text: '기사보기', variant: 'outline-neutral', onClick: handleClickArticlePreviewModalShow, className: 'mr-2' },
            ]}
            footer
        >
            {/* 페이스북 */}
            <div className="d-flex mb-2 w-100">
                <MokaInputLabel label="Facebook" labelWidth={70} className="m-0 h5" as="none" />
                <div className="d-flex">
                    <Button
                        variant="outline-neutral"
                        className="mr-2"
                        onClick={() => {
                            handleClickPublish('fb');
                        }}
                        size="sm"
                    >
                        FB 전송
                    </Button>
                    <Button
                        variant="outline-neutral"
                        className="mr-2"
                        onClick={() => {
                            window.open(`https://developers.facebook.com/tools/debug/?q=https://mnews.joins.com/article/${totalId}`);
                        }}
                        size="sm"
                    >
                        FB 캐시삭제
                    </Button>
                    <Button size="sm" variant="outline-neutral" className="mr-2" onClick={handleClickFbTokenModalShow}>
                        토큰 관리
                    </Button>
                    <Button
                        variant="outline-neutral"
                        className="mr-2"
                        onClick={() => {
                            window.open(`https://www.facebook.com/sharer.php?u=https://mnews.joins.com/article/${totalId}`, '', 'width=500,height=500');
                        }}
                        size="sm"
                    >
                        공유
                    </Button>
                    <Button
                        variant="outline-neutral"
                        className="mr-2"
                        onClick={() => {
                            handleClickCopyContent('fb');
                        }}
                        size="sm"
                    >
                        TW로 복사
                    </Button>
                </div>
            </div>

            <Form className="mb-gutter">
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        as="switch"
                        name="fb-usedYn"
                        id="fb-usedYn"
                        label="사용유무"
                        onChange={handleChangeCheckedValue}
                        inputProps={{ label: '', checked: edit.fb.usedYn }}
                    />
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="타이틀" name="fb-title" onChange={handleChangeTextValue} value={edit.fb.title} />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            name="fb-summary"
                            label="설명\n(리드문)"
                            inputClassName="resize-none custom-scroll"
                            onChange={handleChangeTextValue}
                            value={edit.fb.summary}
                        />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            name="fb-postMessage"
                            label="메시지"
                            inputClassName="resize-none custom-scroll"
                            onChange={handleChangeTextValue}
                            value={edit.fb.postMessage}
                        />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <div className="d-flex w-100">
                        <MokaInputLabel as="none" label="SNS 이미지\n850*350px" />
                        <div className="d-flex flex-column mr-2 flex-fill">
                            <Figure.Image className="mb-1" src={meta.fb.imgUrl} />
                            <Form.Label className="text-danger ft-12">1200*628 이미지 용량 제한: 1MB.</Form.Label>
                        </div>
                        <div className="d-flex flex-column">
                            <Button variant="outline-neutral" size="sm" className="mb-1">
                                편집
                            </Button>
                            <Button
                                variant="positive"
                                onClick={() => {
                                    setIsTwitterImageModalOpen(true);
                                }}
                                size="sm"
                            >
                                신규 등록
                            </Button>
                        </div>
                    </div>
                </Form.Row>

                <Form.Row className="mb-2">
                    <div className="d-flex w-100 align-items-center">
                        <MokaInputLabel as="none" label="예약" />
                        <MokaInput
                            as="checkbox"
                            name="fb-isReserve"
                            id="fb-isReserve"
                            className="mr-2"
                            onChange={handleChangeCheckedValue}
                            inputProps={{ label: '예약 노출', checked: edit.fb.isReserve, custom: true }}
                        />
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
                    </div>
                </Form.Row>
            </Form>

            <hr />

            {/* 트위터 */}
            <div className="d-flex mb-2 w-100">
                <MokaInputLabel label="Twitter" className="m-0 h5" as="none" />
                <div className="d-flex">
                    <Button
                        variant="outline-neutral"
                        className="mr-2"
                        size="sm"
                        onClick={() => {
                            handleClickPublish('tw');
                        }}
                    >
                        TW 전송
                    </Button>
                    <Button
                        variant="outline-neutral"
                        className="mr-2"
                        size="sm"
                        onClick={() => {
                            window.open('https://cards-dev.twitter.com/validator');
                        }}
                    >
                        TW 캐시삭제
                    </Button>
                    <Button
                        variant="outline-neutral"
                        className="mr-2"
                        size="sm"
                        onClick={() => {
                            handleClickCopyContent('tw');
                        }}
                    >
                        FB로 복사
                    </Button>
                </div>
            </div>

            <Form className="mb-gutter">
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        as="switch"
                        name="tw-usedYn"
                        id="tw-usedYn"
                        label="사용유무"
                        variant="positive"
                        onChange={handleChangeCheckedValue}
                        inputProps={{ label: '', checked: edit.tw.usedYn }}
                    />
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="타이틀" name="tw-title" onChange={handleChangeTextValue} value={edit.tw.title} />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            name="tw-summary"
                            label="설명\n(리드문)"
                            inputClassName="resize-none custom-scroll"
                            onChange={handleChangeTextValue}
                            value={edit.tw.summary}
                        />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            name="tw-postMessage"
                            label="메시지"
                            inputClassName="resize-none custom-scroll"
                            onChange={handleChangeTextValue}
                            value={edit.tw.postMessage}
                        />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <div className="d-flex w-100">
                        <MokaInputLabel as="none" label="SNS 이미지\n850*350px" />
                        <div className="d-flex flex-column mr-2 flex-fill">
                            <Figure.Image className="mb-1" src={edit.tw.imgUrl} />
                            <Form.Label className="text-danger ft-12">1200*628 이미지 용량 제한: 1MB.</Form.Label>
                        </div>
                        <div className="d-flex flex-column">
                            <Button variant="outline-neutral" size="sm" className="mb-1">
                                편집
                            </Button>
                            <Button
                                variant="positive"
                                onClick={() => {
                                    setIsFacebookImageModalOpen(true);
                                }}
                                size="sm"
                            >
                                신규 등록
                            </Button>
                        </div>
                    </div>
                </Form.Row>

                <Form.Row className="mb-2">
                    <div className="d-flex w-100 align-items-center">
                        <MokaInputLabel as="none" label="예약" />
                        <MokaInput
                            as="checkbox"
                            name="tw-isReserve"
                            id="tw-isReserve"
                            className="mr-2"
                            onChange={handleChangeCheckedValue}
                            inputProps={{ label: '예약 노출', checked: edit.tw.isReserve, custom: true }}
                        />
                        <MokaInput
                            as="dateTimePicker"
                            name="tw-reserveDt"
                            value={edit.tw.reserveDt}
                            onChange={(e) => {
                                handleChangeTextValue({ target: { name: 'tw-reserveDt', value: moment(e._d).format(DB_DATEFORMAT) } });
                            }}
                            inputProps={{ dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm', inputClassName: 'ft-12' }}
                            disabled={!edit.tw.isReserve}
                        />
                    </div>
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
