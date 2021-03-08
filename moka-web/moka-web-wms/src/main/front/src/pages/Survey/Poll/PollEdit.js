import React, { useEffect, useState } from 'react';
import { MokaCard, MokaIcon, MokaInput, MokaInputLabel } from '@components';
import { Form, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { initialState } from '@store/survey/poll/pollReducer';
import PollDetailBasicAnswerContainer from '@pages/Survey/Poll/components/PollDetailBasicAnswerContainer';
import { useHistory, useParams } from 'react-router-dom';
import PollLayoutInfoModal from '@pages/Page/modals/PollLayoutInfoModal';
import { useDispatch, useSelector } from 'react-redux';
import { getPoll, clearPoll, savePoll, GET_POLL, SAVE_POLL, UPDATE_POLL, getPollList, updatePoll } from '@store/survey/poll/pollAction';
import commonUtil from '@utils/commonUtil';
import PollDetailCompareAnswerContainer from '@pages/Survey/Poll/components/PollDetailCompareAnswerContainer';
import produce from 'immer';
import useDebounce from '@hooks/useDebounce';
import toast from '@utils/toastUtil';
import { selectArticleItemChange, selectArticleListChange } from '@store/survey/quiz';
import moment from 'moment';
import { BASIC_DATEFORMAT } from '@/constants';
import clsx from 'clsx';

const tempItem = { imgUrl: null, linkUrl: '', pollSeq: 1897, title: '' };

const PollEdit = ({ onDelete }) => {
    const { pollSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [edit, setEdit] = useState(initialState.poll);
    const [isCompared, setIsCompared] = useState(false);
    const [isSet, setIsSet] = useState(false);
    const [isPollLayoutInfoModalShow, setIsPollLayoutInfoModalShow] = useState(false);
    const [hasLink, setHasLink] = useState(false);
    const [pollStatus, setPollStatus] = useState('N');

    const { codes, poll, loading, search } = useSelector((store) => ({
        codes: store.poll.codes,
        poll: store.poll.poll,
        loading: store.loading[GET_POLL] || store.loading[SAVE_POLL] || store.loading[UPDATE_POLL],
        search: store.poll.search,
    }));

    const handleChangeValue = ({ name, value, type }) => {
        if (type === 'number') {
            value = parseInt(value);
        }
        if (name === 'pollDiv') {
            if (value === 'V') {
                setIsCompared(true);
            } else {
                setIsCompared(false);
            }
            setEdit(
                produce(edit, (draft) => {
                    draft[name] = value;
                    draft['itemCnt'] = 2;
                    draft['allowAnswCnt'] = 1;
                }),
            );
        } else {
            let isValid = true;
            if (name === 'allowAnswCnt') {
                if (edit.itemCnt < value) {
                    toast.warning('허용 답변수는 보기 개수보다 클 수 없습니다.');
                    isValid = false;
                }
            }

            if (isValid) {
                setEdit(
                    produce(edit, (draft) => {
                        draft[name] = value;
                    }),
                );
            }
        }
    };

    const handleDebounceChangeValue = useDebounce(handleChangeValue, 100);

    const handleClickAnswerSetting = () => {
        let pollItems = [...edit.pollItems];
        const itemCnt = edit.itemCnt;
        const gap = itemCnt - pollItems.length;

        if (gap > 0) {
            for (let count = 0; count < gap; count++) {
                const orderNo = pollItems.length + 1;
                pollItems.push({ ...tempItem, orderNo });
            }
        } else if (gap < 0) {
            pollItems = pollItems.slice(0, itemCnt);
        }

        setEdit(
            produce(edit, (draft) => {
                draft.pollItems = pollItems;
            }),
        );

        setIsSet(true);
    };

    const handleClickSave = () => {
        if (validate(edit)) {
            if (commonUtil.isEmpty(edit.pollSeq)) {
                dispatch(
                    savePoll({
                        data: edit,
                        callback: (response) => {
                            history.push(`/poll/${response.body.pollSeq}`);
                            dispatch(getPollList({ search }));
                            toast.result(response);
                        },
                    }),
                );
            } else {
                dispatch(
                    updatePoll({
                        data: edit,
                        callback: (response) => {
                            dispatch(getPoll({ pollSeq: response.body.pollSeq }));
                            dispatch(getPollList({ search }));
                            toast.result(response);
                        },
                    }),
                );
            }
        }
    };

    const validate = (data) => {
        if (commonUtil.isEmpty(data.startDt)) {
            toast.warning('투표 시작일을 입력해 주세요');
            return false;
        }

        if (commonUtil.isEmpty(data.endDt)) {
            toast.warning('투표 종료일을 입력해 주세요');
            return false;
        }
        return true;
    };

    const handleClickHasLink = () => {
        if (hasLink) {
            const noneHasLinkItems = edit.pollItems.map((item) => ({
                ...item,
                linkUrl: '',
            }));
            handleChangeValue({ name: 'pollItems', value: noneHasLinkItems });
        }
        setHasLink(!hasLink);
    };

    const handleClickPollResult = () => {
        let statusKor = '현황';
        if (pollStatus === 'R') {
            statusKor = '결과';
        }
        toast.info(`투표 ${statusKor} 기능은 준비중 입니다.`);
    };

    const dividePollStatus = (startDt, endDt) => {
        let status = 'N';
        if (moment().diff(startDt) >= 0 && moment().diff(endDt) <= 0) {
            status = 'S';
        } else if (moment().diff(startDt) > 0 && moment().diff(endDt) > 0) {
            status = 'R';
        }
        return status;
    };

    useEffect(() => {
        if (!commonUtil.isEmpty(pollSeq)) {
            dispatch(
                getPoll({
                    pollSeq,
                }),
            );
        } else {
            dispatch(clearPoll());
        }
    }, [dispatch, pollSeq]);

    useEffect(() => {
        setEdit(poll);
        if (!commonUtil.isEmpty(poll.pollSeq)) {
            setIsSet(true);
            dispatch(selectArticleListChange(poll.pollRelateContents.filter((content) => content.relType === 'A')));
            dispatch(selectArticleItemChange(poll.pollRelateContents.filter((content) => content.relType === 'A')));
            setPollStatus(dividePollStatus(poll.startDt, poll.endDt));
            setHasLink(poll.pollItems.filter((item) => item.linkUrl !== '' || !commonUtil.isEmpty(item.linkUrl)).length > 0);
        } else {
            setIsSet(false);
        }

        if (poll.pollDiv === 'V') {
            setIsCompared(true);
        } else {
            setIsCompared(false);
        }
    }, [dispatch, poll]);

    const getFooterButtons = () => {
        let buttons = [
            {
                text: '저장',
                variant: 'positive',
                onClick: handleClickSave,
                className: 'mr-05',
                useAuth: true,
            },
            { text: '취소', variant: 'negative', onClick: () => history.push('/poll'), className: 'mr-05' },
        ];
        if (!commonUtil.isEmpty(edit.pollSeq)) {
            if (edit.voteCnt === 0) {
                buttons = [
                    {
                        text: '수정',
                        variant: 'positive',
                        onClick: handleClickSave,
                        className: 'mr-05',
                        useAuth: true,
                    },
                    { text: '삭제', variant: 'negative', onClick: () => onDelete(edit.pollSeq), className: 'mr-05', useAuth: true },
                    { text: '취소', variant: 'negative', onClick: () => history.push('/poll'), className: 'mr-05' },
                ];
            } else {
                buttons = [
                    {
                        text: '수정',
                        variant: 'positive',
                        onClick: handleClickSave,
                        className: 'mr-05',
                        useAuth: true,
                    },
                    { text: '취소', variant: 'negative', onClick: () => history.push('/poll'), className: 'mr-05' },
                ];
            }
        }

        return buttons;
    };

    return (
        <MokaCard
            title={`투표 ${pollSeq ? '수정' : '등록'}`}
            className="w-100"
            footer
            footerClassName="justify-content-center"
            footerButtons={getFooterButtons()}
            width={570}
            loading={loading}
        >
            <Form>
                {pollStatus !== 'N' && (
                    <Form.Row>
                        <Col xs={12} className="mb-14 d-flex justify-content-end">
                            <Button variant="outline-neutral" onClick={handleClickPollResult}>
                                투표 {pollStatus === 'S' ? '현황' : '결과'}
                            </Button>
                        </Col>
                    </Form.Row>
                )}
                <Form.Row className="mb-2 justify-content-between">
                    <Col xs={6}>
                        <MokaInputLabel
                            as="select"
                            label="서비스 상태"
                            name="status"
                            value={edit.status}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        >
                            {codes.status.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                    <Col xs={6}>
                        <MokaInputLabel label="투표ID" labelWidth={35} className="ml-32" name="pollSeq" value={edit.pollSeq} disabled={true} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2 justify-content-between">
                    <Col xs={6}>
                        <MokaInputLabel
                            as="select"
                            label="그룹"
                            name="pollGroup"
                            value={edit.pollGroup}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        >
                            {codes.pollGroup.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                    <Col xs={6}>
                        <MokaInputLabel
                            as="select"
                            label="분류"
                            labelWidth={35}
                            className="ml-32"
                            name="pollCategory"
                            value={edit.pollCategory}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        >
                            {codes.pollCategory.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <Form.Row className="d-flex align-item-center mb-2">
                    <Col xs={4} className="pr-0">
                        <MokaInputLabel
                            as="select"
                            label="레이아웃"
                            name="pollDiv"
                            value={edit.pollDiv}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        >
                            {codes.pollDiv.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                    <Col xs={2} className="d-flex pr-0">
                        <MokaInputLabel
                            name="pollType"
                            id="type1"
                            as="radio"
                            value="T"
                            className="ml-20"
                            labelWidth={30}
                            inputProps={{ custom: true, label: 'text형', checked: edit.pollType === 'T' }}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        />
                    </Col>
                    <Col xs={2} className="d-flex pr-0">
                        <MokaInputLabel
                            name="pollType"
                            id="type2"
                            as="radio"
                            value="P"
                            labelWidth={30}
                            inputProps={{ custom: true, label: '이미지형', checked: edit.pollType === 'P' }}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        />
                    </Col>
                    <Col xs={3} className="d-flex pr-0">
                        <MokaInputLabel
                            name="pollType"
                            id="type3"
                            as="radio"
                            value="M"
                            labelWidth={85}
                            inputProps={{ custom: true, label: 'text형+이미지형', checked: edit.pollType === 'M' }}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        />
                    </Col>
                    <Col xs={1}>
                        <Button variant="white" size="md" onClick={() => setIsPollLayoutInfoModalShow(true)}>
                            <MokaIcon iconName="fal-info-circle" />
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={7}>
                        <MokaInputLabel
                            as="dateTimePicker"
                            label="투표기간"
                            name="startDt"
                            value={edit.startDt}
                            onChange={(date) => {
                                handleChangeValue({ name: 'startDt', value: date });
                            }}
                            inputProps={{ closeOnSelect: false }}
                        />
                    </Col>
                    <span>~</span>
                    <Col xs={5}>
                        <MokaInput
                            as="dateTimePicker"
                            name="endDt"
                            className="right"
                            value={edit.endDt}
                            onChange={(date) => {
                                handleChangeValue({ name: 'endDt', value: date });
                            }}
                            inputProps={{ closeOnSelect: false }}
                        />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={3}>
                        <MokaInputLabel
                            as="switch"
                            label="메인노출"
                            name="mainYn"
                            id="mainYn"
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                let value = 'N';
                                if (checked) {
                                    value = 'Y';
                                }

                                handleChangeValue({ name, value });
                            }}
                            inputProps={{ checked: edit.mainYn === 'Y' }}
                        />
                    </Col>
                    <Col xs={3}>
                        <MokaInputLabel
                            as="switch"
                            label="로그인"
                            labelWidth={35}
                            name="loginYn"
                            id="loginYn"
                            labelClassName="text-right"
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                let value = 'N';
                                if (checked) {
                                    value = 'Y';
                                }
                                handleChangeValue({ name, value });
                            }}
                            inputProps={{ checked: edit.loginYn === 'Y' }}
                        />
                    </Col>
                    <Col xs={2}>
                        <MokaInputLabel
                            as="switch"
                            label="댓글"
                            labelWidth={23}
                            labelClassName="text-right"
                            name="replyYn"
                            id="replyYn"
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                let value = 'N';
                                if (checked) {
                                    value = 'Y';
                                }

                                handleChangeValue({ name, value });
                            }}
                            inputProps={{ checked: edit.replyYn === 'Y' }}
                        />
                    </Col>
                    <Col xs={4}>
                        <MokaInputLabel
                            as="switch"
                            label="중복 투표 제한"
                            labelWidth={80}
                            name="repetitionYn"
                            id="repetitionYn"
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                let value = 'N';
                                if (checked) {
                                    value = 'Y';
                                }
                                handleChangeValue({ name, value });
                            }}
                            inputProps={{ checked: edit.repetitionYn === 'Y' }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={3}>
                        <MokaInputLabel
                            as="switch"
                            label="게시판"
                            name="bbsYn"
                            id="bbsYn"
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                let value = 'N';
                                if (checked) {
                                    value = 'Y';
                                }
                                handleChangeValue({ name, value });
                            }}
                            inputProps={{ checked: edit.bbsYn === 'Y' }}
                        />
                    </Col>
                    {edit.bbsYn === 'Y' && (
                        <Col xs={9}>
                            <MokaInputLabel
                                label="url"
                                labelWidth={15}
                                name="bbsUrl"
                                labelClassName="text-right"
                                onChange={(e) => {
                                    const { name, value } = e.target;
                                    handleChangeValue({ name, value });
                                }}
                                value={edit.bbsUrl}
                            />
                        </Col>
                    )}
                </Form.Row>
                <Form.Row className="d-flex justify-content-center mb-2">
                    <MokaCard height={65} className="w-100 body-bg" header={false} bodyClassName="pt-3 pb-3 mt-0 mb-0">
                        <Form.Row className="align-items-center h-100">
                            <Col xs={2} className="d-flex h-100 align-items-center p-0" style={{ borderRight: '1px solid' }}>
                                <h4 className="text-center pr-2 mb-0">투표 설정</h4>
                            </Col>
                            <Col xs={4}>
                                <MokaInputLabel
                                    type="number"
                                    label="보기 개수"
                                    labelWidth={80}
                                    name="itemCnt"
                                    labelClassName="text-right"
                                    className="pl-0"
                                    value={edit.itemCnt}
                                    onChange={(e) => {
                                        handleChangeValue(e.target);
                                    }}
                                    disabled={isCompared}
                                    inputProps={{ style: { flex: 'initial !important', width: '59.33px' }, min: 2 }}
                                />
                            </Col>
                            <Col xs={4}>
                                <MokaInputLabel
                                    type="number"
                                    label="허용 답변 수"
                                    labelWidth={80}
                                    name="allowAnswCnt"
                                    className="text-right"
                                    value={edit.allowAnswCnt}
                                    onChange={(e) => {
                                        handleChangeValue(e.target);
                                    }}
                                    disabled={isCompared}
                                    inputProps={{ style: { flex: 'initial !important', width: '59.33px' }, min: 1 }}
                                />
                            </Col>
                            <Col xs={2} className="p-0  pr-2 text-right">
                                <Button variant="positive" onClick={handleClickAnswerSetting}>
                                    {commonUtil.isEmpty(edit.pollSeq) || edit.pollItems.length === 0 ? '생성' : '수정'}
                                </Button>
                            </Col>
                        </Form.Row>
                    </MokaCard>
                </Form.Row>
                {edit.itemCnt > 0 && isSet && (
                    <Form.Row className="mb-2">
                        <MokaCard
                            className="flex-fill pl-0 h-100 body-bg"
                            headerClassName="transparent pr-0 pl-0"
                            bodyClassName="pr-0 pl-0"
                            minHeight="300px"
                            titleAs={
                                <Form.Row>
                                    <Col xs={11} className="pl-10">
                                        <Form.Group className="d-flex align-items-center">
                                            <Form.Label
                                                className={clsx('px-0 mb-0 position-relative flex-shrink-0 ft-12', 'text-center')}
                                                style={{ width: 50, minWidth: 50, marginRight: 12, fontSize: '30px' }}
                                                htmlFor="none"
                                            >
                                                Q.
                                            </Form.Label>
                                            <Form.Group className="w-100">
                                                <MokaInput
                                                    as="textarea"
                                                    name="title"
                                                    value={edit.title}
                                                    onChange={(e) => {
                                                        handleChangeValue(e.target);
                                                    }}
                                                    inputProps={{ rows: 3 }}
                                                />
                                                <div className="color-danger">※ 250자 이내로 입력하세요.</div>
                                            </Form.Group>
                                        </Form.Group>
                                        {/* <MokaInputLabel
                                            as="textarea"
                                            name="title"
                                            onChange={(e) => {
                                                handleChangeValue(e.target);
                                            }}
                                            value={edit.title}
                                            label="Q."
                                            labelWidth={50}
                                            labelClassName="text-center"
                                        />*/}
                                    </Col>
                                    <Col xs={1} className="d-flex align-items-top p-0">
                                        <Button
                                            variant="gray-200"
                                            className="p-0 d-flex justify-content-center align-items-center"
                                            onClick={handleClickHasLink}
                                            style={{ width: '20px', height: '20px', color: 'black' }}
                                        >
                                            <MokaIcon iconName={hasLink ? 'fal-unlink' : 'fal-link'} style={{ width: '10px', height: '10px' }} />
                                        </Button>
                                    </Col>
                                </Form.Row>
                            }
                        >
                            {edit.pollDiv === 'W' && (
                                <PollDetailBasicAnswerContainer
                                    type={edit.pollType}
                                    items={edit.pollItems}
                                    onChange={(items) => {
                                        handleDebounceChangeValue({
                                            name: 'pollItems',
                                            value: items,
                                        });
                                    }}
                                    hasUrl={hasLink}
                                />
                            )}
                            {edit.pollDiv === 'V' && (
                                <PollDetailCompareAnswerContainer
                                    type={edit.pollType}
                                    items={edit.pollItems}
                                    onChange={(items) => {
                                        handleDebounceChangeValue({
                                            name: 'pollItems',
                                            value: items,
                                        });
                                    }}
                                    hasUrl={hasLink}
                                />
                            )}
                        </MokaCard>
                    </Form.Row>
                )}
            </Form>
            <PollLayoutInfoModal show={isPollLayoutInfoModalShow} onHide={() => setIsPollLayoutInfoModalShow(false)} />
        </MokaCard>
    );
};

export default PollEdit;
