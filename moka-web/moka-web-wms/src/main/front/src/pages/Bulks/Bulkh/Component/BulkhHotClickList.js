import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Col, Card, Button } from 'react-bootstrap';
import { MokaCard } from '@components';
import HotClickAgGrid from '@pages/Bulks/Bulkh/HotClickGrid/HotClickAgGrid';
import BulkhHistoryModal from '@pages/Bulks/Bulkh/Modal/BulkhHistoryModal';
import { getHotClickTitle, saveHotClick, getHotclickList, saveHotClickResend, GET_HOTCLICK_LIST } from '@store/bulks';
import toast, { messageBox } from '@/utils/toastUtil';

/**
 * 아티클핫클릭 리스트
 */
const BulkhHotClickList = ({ componentAgGridInstances, setComponentAgGridInstances }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams();
    const selectBulkartSeq = useRef();
    const loading = useSelector(({ loading }) => loading[GET_HOTCLICK_LIST]);
    const { hotclickList, topTitle, bulkPathName } = useSelector((store) => ({
        bulkPathName: store.bulks.bulkPathName,
        hotclickList: store.bulks.bulkh.hotclickList.list,
        topTitle: store.bulks.bulkh.topTitle,
    }));
    const [historyModalShow, setHistoryModalShow] = useState(false);
    const [topTitleItem, setTopTitleItem] = useState({
        send: '',
        wait: '',
    }); // 상단 타이틀 문구
    const handleClickHistoryModalButton = () => setHistoryModalShow(true); // 편집 정보 버튼 클릭 처리

    /**
     * 전송 버튼 임시저장 버튼 처리
     * @param {*} type type
     */
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
                        dispatch(getHotClickTitle());
                        history.push(`/${bulkPathName}/${bulkartSeq}`);
                    } else {
                        // 저장 실패.
                        messageBox.alert(message, () => {});
                    }
                },
            }),
        );
    };

    /**
     * 재전송
     */
    const handleClickResendButton = () => {
        if (!topTitleItem.isWait) {
            dispatch(
                saveHotClickResend({
                    bulkartSeq: selectBulkartSeq.current,
                    callback: ({ header: { success, message } }) => {
                        if (success === true) {
                            toast.success(message);
                            dispatch(getHotClickTitle());
                        } else {
                            messageBox.alert(message, () => {});
                        }
                    },
                }),
            );
        } else {
            messageBox.alert('대기 상태에서는 재전송을 할 수 없습니다.\n전송을 먼저 진행해 주세요.');
        }
    };

    useEffect(() => {
        if (params.seqNo !== selectBulkartSeq.current) {
            selectBulkartSeq.current = params.seqNo;
            // url 기준으로 핫클릭 리스트 조회
            dispatch(getHotclickList({ bulkartSeq: params.seqNo }));
        }
    }, [dispatch, params]);

    useEffect(() => {
        // 타이틀 가져옴
        const getTopTitle = () => dispatch(getHotClickTitle());
        getTopTitle();
    }, [dispatch]);

    useEffect(() => {
        // 상단 타이틀 설정
        const setTopTitle = ({ send, wait }) => {
            let sendDt = send.regDt && send.regDt.length > 10 ? send.regDt.substr(0, 16) : send.regDt;
            let waitDt = wait.regDt && wait.regDt.length > 10 ? wait.regDt.substr(0, 16) : wait.regDt;
            const isWait = moment(send.regDt).diff(wait.regDt) < 0;
            setTopTitleItem({
                send: send && send.regMember && send.regMember.memberId ? `${send.regMember.memberId} | 저장 ${sendDt}` : '',
                wait: wait && wait.regMember && wait.regMember.memberId ? `${wait.regMember.memberId} | 대기 ${waitDt}` : '',
                isWait,
            });

            // 현재 url 기준으로 선택되어 있지 않으면 대기 기준으로 최근것을 불러 오기.
            if (!params.seqNo && wait.bulkartSeq) {
                dispatch(getHotclickList({ bulkartSeq: wait.bulkartSeq }));
            }
        };
        setTopTitle(topTitle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topTitle]);

    return (
        <MokaCard
            width={380}
            loading={loading}
            className="flex-fill h-100 mr-gutter"
            bodyClassName="scrollable d-flex flex-column"
            titleAs={
                <div className="d-flex">
                    <Col xs={3} className="p-0">
                        <Card.Title as="h2" className={clsx({ 'd-none': false }, 'mb-0')}>
                            {`아티클 핫클릭`}
                        </Card.Title>
                    </Col>
                    <Col xs={9} className="p-0 d-flex">
                        <div className="flex-fill text-right">
                            <p className="mb-0">{topTitleItem.send}</p>
                            <p className={clsx('mb-0', topTitleItem.isWait && 'text-danger')}>{topTitleItem.wait}</p>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                            <Button variant="outline-secondary" className="w-auto h-auto" onClick={handleClickHistoryModalButton}>
                                편집정보
                            </Button>
                        </div>
                    </Col>
                </div>
            }
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '재전송', variant: 'outline-neutral', onClick: () => handleClickResendButton(), className: 'mr-1' },
                { text: '저장', variant: 'positive', onClick: () => handleClickSaveButton('publish'), className: 'mr-1' },
                { text: '임시저장', variant: 'secondary', onClick: () => handleClickSaveButton('save'), className: 'mr-1' },
            ]}
        >
            <div
                className={clsx('component-work component-hot-click border-top pt-0', {
                    disabled: false,
                })}
                id={`agGrid-0`}
            >
                <HotClickAgGrid componentAgGridInstances={componentAgGridInstances} setComponentAgGridInstances={setComponentAgGridInstances} />
            </div>

            <BulkhHistoryModal show={historyModalShow} onHide={() => setHistoryModalShow(false)} />
        </MokaCard>
    );
};

export default BulkhHotClickList;
