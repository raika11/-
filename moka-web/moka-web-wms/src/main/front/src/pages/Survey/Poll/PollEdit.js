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
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import toast from '@utils/toastUtil';

const tempItem = { imgUrl: null, linkUrl: '', pollSeq: 1897, title: '' };

const PollEdit = () => {
    const { pollSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [edit, setEdit] = useState(initialState.poll);
    const [isSet, setIsSet] = useState(false);
    const [isPollLayoutInfoModalShow, setIsPollLayoutInfoModalShow] = useState(false);

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
        setEdit(
            produce(edit, (draft) => {
                draft[name] = value;
            }),
        );
    };

    const handleDebounceChangeValue = useDebounce(handleChangeValue);

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
    };

    const handleClickSave = () => {
        if (commonUtil.isEmpty(edit.pollSeq)) {
            dispatch(
                savePoll({
                    data: edit,
                    callback: (response) => {
                        history.push(`/poll/${response.body.pollSeq}`);
                        dispatch(getPollList(search));
                        toast.result(response);
                    },
                }),
            );
        } else {
            dispatch(
                updatePoll({
                    data: edit,
                    callback: (response) => {
                        dispatch(getPoll(response.body.pollSeq));
                        dispatch(getPollList(search));
                        toast.result(response);
                    },
                }),
            );
        }
    };

    useEffect(() => {
        if (!commonUtil.isEmpty(pollSeq)) {
            dispatch(getPoll(pollSeq));
        } else {
            dispatch(clearPoll());
        }
    }, [dispatch, pollSeq]);

    useEffect(() => {
        setEdit(poll);
        if (!commonUtil.isEmpty(poll.pollSeq)) {
            //setIsSet(true);
        } else {
            //setIsSet(false);
        }
    }, [poll]);

    return (
        <MokaCard
            title="투표 등록"
            className="w-100"
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                {
                    text: '저장',
                    variant: 'positive',
                    onClick: handleClickSave,
                    className: 'mr-05',
                },
                { text: '취소', variant: 'negative', onClick: () => history.push('/poll'), className: 'mr-05' },
            ]}
            width={570}
            loading={loading}
        >
            <Form>
                <Form.Row className="mb-2 justify-content-between">
                    <Col xs={6}>
                        <MokaInputLabel
                            as="select"
                            label="서비스 상태"
                            labelWidth={70}
                            name="status"
                            labelClassName="text-right"
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
                        <MokaInputLabel label="투표ID" labelWidth={70} name="pollSeq" labelClassName="text-right" value={edit.pollSeq} disabled={true} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2 justify-content-between">
                    <Col xs={6}>
                        <MokaInputLabel
                            as="select"
                            label="그룹"
                            name="pollGroup"
                            labelWidth={70}
                            labelClassName="text-right"
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
                            labelWidth={70}
                            name="pollCategory"
                            labelClassName="text-right"
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
                            labelWidth={70}
                            name="pollDiv"
                            labelClassName="text-right"
                            value={edit.pollDiv}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                            disabled={isSet}
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
                            labelWidth={30}
                            inputProps={{ custom: true, label: 'text형', checked: edit.pollType === 'T' }}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                            disabled={isSet}
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
                            disabled={isSet}
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
                            disabled={isSet}
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
                            labelWidth={70}
                            name="startDt"
                            labelClassName="text-right"
                            value={edit.startDt}
                            onChange={(data) => {
                                handleChangeValue({ name: 'startDt', value: moment(data._d).format(DB_DATEFORMAT) });
                            }}
                        />
                    </Col>
                    <span>~</span>
                    <Col xs={5}>
                        <MokaInput
                            as="dateTimePicker"
                            name="endDt"
                            value={edit.endDt}
                            onChange={(data) => {
                                handleChangeValue({ name: 'endDt', value: moment(data._d).format(DB_DATEFORMAT) });
                            }}
                        />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={3}>
                        <MokaInputLabel
                            as="switch"
                            label="메인노출"
                            labelWidth={70}
                            labelClassName="text-right"
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
                            labelWidth={70}
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
                            labelWidth={50}
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
                            labelWidth={120}
                            name="repetitionYn"
                            id="repetitionYn"
                            labelClassName="text-right mr-1"
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
                            labelWidth={70}
                            name="bbsYn"
                            id="bbsYn"
                            labelClassName="text-right"
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
                                labelWidth={35}
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
                    <MokaCard height={65} className="w-100" header={false} bodyClassName="pt-3 pb-3 mt-0 mb-0">
                        <Form.Row className="align-items-center h-100">
                            <Col xs={2} className="d-flex h-100 align-items-center" style={{ borderRight: '1px solid' }}>
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
                                    disabled={isSet}
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
                                    disabled={isSet}
                                    inputProps={{ style: { flex: 'initial !important', width: '59.33px' }, min: 1 }}
                                />
                            </Col>
                            <Col xs={2} className="p-0  pr-2 text-right">
                                <Button variant="positive" onClick={handleClickAnswerSetting} disabled={isSet}>
                                    생성
                                </Button>
                            </Col>
                        </Form.Row>
                    </MokaCard>
                </Form.Row>
                {edit.itemCnt > 0 && (
                    <Form.Row className="mb-2">
                        <MokaCard
                            className="flex-fill pl-0 h-100"
                            minHeight="300px"
                            titleAs={
                                <MokaInputLabel
                                    as="textarea"
                                    name="title"
                                    onChange={(e) => {
                                        handleChangeValue(e.target);
                                    }}
                                    value={edit.title}
                                    label="Q."
                                    labelWidth={20}
                                />
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
                                />
                            )}
                            {edit.pollDiv === 'V' && <PollDetailCompareAnswerContainer type={edit.pollType} items={edit.pollItems} />}
                        </MokaCard>
                    </Form.Row>
                )}
            </Form>
            <PollLayoutInfoModal show={isPollLayoutInfoModalShow} onHide={() => setIsPollLayoutInfoModalShow(false)} />
        </MokaCard>
    );
};

export default PollEdit;
