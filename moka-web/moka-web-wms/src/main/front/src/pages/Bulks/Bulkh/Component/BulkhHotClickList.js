import React, { useState, useEffect, useRef, Suspense } from 'react';
import { MokaCard, MokaInputLabel } from '@components';
import { Col, Row, Form } from 'react-bootstrap';
import HotClickAgGrid from '@pages/Bulks/Bulkh/HotClickGrid/HotClickAgGrid';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import BulkhHistoryModal from '@pages/Bulks/Bulkh/Modal/BulkhHistoryModal';
import { getHotClickTitle, saveHotClick, getHotclickList, saveHotClickResend } from '@store/bulks';
import { useDispatch, useSelector } from 'react-redux';
import toast, { messageBox } from '@/utils/toastUtil';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const BulkhHotClickList = ({ componentAgGridInstances, setComponentAgGridInstances }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams();
    const selectBulkartSeq = useRef();
    const { hotclickList, topTitle, bulkPathName } = useSelector((store) => ({
        bulkPathName: store.bulks.bulkPathName,
        hotclickList: store.bulks.bulkh.hotclickList.list,
        topTitle: store.bulks.bulkh.topTitle,
    }));

    const [tempModalShow, setTempModalShow] = useState(false);
    // 상단 타이틀 문구 스테이트.
    const [topTitleItem, setTopTitleItem] = useState({
        send: '',
        wait: '',
    });

    // 편집 정보 버튼 클릭 처리.
    const handleClickHistoryModalButton = () => {
        setTempModalShow(true);
    };

    // 전송 버튼 임시저장 버튼 처리.
    const handleClickSaveButton = (type) => {
        let tempArray = { title: [], url: [], totalId: [] };

        // 임시 배열에 저장후 api 호출시 보낼 payload 생성.
        hotclickList
            .filter((e) => e.title || e.url)
            .map((element) => {
                if (element.title) tempArray.title.push(element.title);
                if (element.url) tempArray.url.push(element.url);
                if (element.totalId) tempArray.totalId.push(element.totalId);

                return element;
            });

        if (tempArray.title.length === 0) {
            messageBox.alert('문구가 없거나 형식에 맞지 않습니다.');
            return;
        }

        if (tempArray.title.length !== tempArray.url.length) {
            messageBox.alert('문구가 없거나 형식에 맞지 않습니다.');
            return;
        }

        const newSaveData = tempArray.title.map(function (e, i) {
            return {
                bulkartSeq: 0,
                ordNo: i,
                title: e,
                totalId: tempArray.totalId[i],
                url: tempArray.url[i],
            };
        });

        dispatch(
            saveHotClick({
                type: type,
                hotclicklist: newSaveData,
                callback: ({ header: { success, message }, body: { bulkartSeq } }) => {
                    if (success === true) {
                        // 저장 완료.
                        toast.success(message);
                        history.push(`/${bulkPathName}/${bulkartSeq}`);
                    } else {
                        // 저장 실패.
                        messageBox.alert(message, () => {});
                    }
                },
            }),
        );
    };

    // 재전송.
    const handleClickResendButton = () => {
        dispatch(
            saveHotClickResend({
                bulkartSeq: selectBulkartSeq.current,
                callback: ({ header: { success, message } }) => {
                    if (success === true) {
                        toast.success(message);
                    } else {
                        messageBox.alert(message, () => {});
                    }
                },
            }),
        );
    };

    // url 변경 되었을떄 리스트 가지고 오기.
    useEffect(() => {
        if (params.seqNo !== selectBulkartSeq.current) {
            selectBulkartSeq.current = params.seqNo;

            // url 기준으로 핫클릭 리스트를 가지고 오기.
            dispatch(getHotclickList({ bulkartSeq: params.seqNo }));
        }
    }, [dispatch, params]);

    // 로딩시 타이틀 가지고 오기.
    useEffect(() => {
        const getTopTitle = () => {
            dispatch(getHotClickTitle());
        };
        getTopTitle();
    }, [dispatch]);

    // 상단 타이틀 설정.
    useEffect(() => {
        const setTopTitle = ({ send, wait }) => {
            setTopTitleItem({
                send: send && send.regId ? `${send.regId} | 전송 ${send.sendDt}` : '',
                wait: wait && wait.regId ? `${wait.regId} | 대기 ${wait.regDt}` : '',
            });

            // 현재 url 기준으로 선택되어 있지 않으면 대기 기준으로 최근것을 불러 오기.
            if (!params.seqNo && wait.bulkartSeq) {
                dispatch(getHotclickList({ bulkartSeq: wait.bulkartSeq }));
            }
        };

        setTopTitle(topTitle);
    }, [dispatch, params.seqNo, topTitle]);

    return (
        <>
            <MokaCard
                width={130}
                loading={null}
                className={'custom-scroll mr-gutter flex-fill'}
                footer
                footerButtons={[]}
                titleAs={
                    <>
                        <Row>
                            <Col className="align-self-center justify-content-start" xs={2}>
                                <MokaInputLabel label="아티클 핫클릭" labelWidth={80} className="h5" as="none" />
                            </Col>
                            <Col className="align-self-center justify-content-end mb-0 p-0" xs={8}>
                                <Col className="align-self-top justify-content-end text-right">{topTitleItem.send}</Col>
                                <Col className="align-self-bottom justify-content-end text-right">
                                    <Form.Label className="text-danger">{topTitleItem.wait}</Form.Label>
                                </Col>
                            </Col>
                            <Col className="align-self-top justify-content-start mb-0 p-0" xs={2}>
                                <Button variant="outline-neutral" style={{ width: '70px', height: '31px' }} onClick={() => handleClickHistoryModalButton()}>
                                    편집정보
                                </Button>
                            </Col>
                        </Row>
                    </>
                }
                footerAs={
                    <>
                        <Col>
                            <Button variant="outline-neutral" onClick={() => handleClickResendButton()}>
                                재전송
                            </Button>
                        </Col>
                        <Col className="offset-6 pr-0">
                            <Button variant="positive" onClick={() => handleClickSaveButton('publish')}>
                                전송
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="positive" onClick={() => handleClickSaveButton('save')}>
                                임시저장
                            </Button>
                        </Col>
                    </>
                }
            >
                <Row>
                    <Col className="w-100 text-center">
                        <div
                            className={clsx('component-work', 'border-top', 'pt-0', {
                                disabled: false,
                            })}
                            id={`agGrid-0`}
                        >
                            <HotClickAgGrid componentAgGridInstances={componentAgGridInstances} setComponentAgGridInstances={setComponentAgGridInstances} />
                        </div>
                    </Col>
                </Row>
            </MokaCard>
            <BulkhHistoryModal show={tempModalShow} onHide={() => setTempModalShow(false)} />
        </>
    );
};

export default BulkhHotClickList;
