import React, { useState, useRef, useEffect } from 'react';
import { MokaCard, MokaInputLabel } from '@components';
import { Form, Col, Button } from 'react-bootstrap';
import { SpecialCharModal } from './Modal';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast, { messageBox } from '@utils/toastUtil';
import { getBulkArticle, GET_BULK_LIST, saveBulkArticle, getBulkList, getSpecialchar, showPreviewModal } from '@store/bulks';
import { changeSpecialCharCode, getSpecialCharCode, saveSpecialCharCode } from '@store/codeMgt';
import DefaultInputModal from '@pages/commons/DefaultInputModal';

const propTypes = {
    EditState: PropTypes.string,
    HandleEditEnable: PropTypes.func,
};
const defaultProps = {};

var checkTextLength = function (str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        len++;
    }
    return len;
};

const BulknEdit = (props) => {
    const params = useParams();
    const history = useHistory();

    const { loading, bulkArticle, bulkPathName, cdNm: symbol } = useSelector((store) => ({
        bulkPathName: store.bulks.bulkPathName,
        bulkArticle: store.bulks.bulkn.bulkArticle,
        cdNm: store.codeMgt.specialCharCode.cdNm,
        loading: store.loading[GET_BULK_LIST],
    }));

    const dispatch = useDispatch();
    const checkBulkSeqNumber = useRef();
    const [modalMShow, setModalMShow] = useState(false);
    const [editState, setEditState] = useState(true); // edit 상태 true 일일때 input 상태가 disable.
    const [bulkArticleRow, setBulkArticleRow] = useState(rowInit); // 선택된 벌크 기사들.

    // 약물 수정 삭제 모달 창.
    const handleClickSpecialCharModalButton = () => {
        setModalMShow(true);
    };

    // 모달창 스토어에 문구들과 상태값 전달.
    const handlePreviewModalButton = (e) => {
        dispatch(
            showPreviewModal({
                state: true,
                bulkArticle: bulkArticleRow,
            }),
        );
    };

    // 문구 정보들 값 변경시 state 에 저장.
    const handleChangeBulkinputBox = (e, index) => {
        const { name, value } = e.target;

        setBulkArticleRow(
            bulkArticleRow.map(function (element, element_index) {
                let titleLength = name === 'title' ? checkTextLength(value.replace(/^\s+|\s+$/g, '')) : checkTextLength(element.title.replace(/^\s+|\s+$/g, ''));

                if (element_index === index) {
                    element = {
                        ...element,
                        [name]: value,
                        title_length: titleLength,
                    };
                }

                return {
                    ...element,
                };
            }),
        );
    };

    // props 로 전달 받은 edit 상태가 변경 되었을떄 처리.
    useEffect(() => {
        const changeEditState = (state) => {
            if (state === 'enable') {
                setEditState(false);
            } else if (state === 'clear') {
                // clear 는 라우터 이동시 clear
                setEditState(false);
            } else {
                setEditState(true);
            }
        };
        changeEditState(props.EditState);
    }, [props.EditState]);

    // 리스트 창에서 item 클릭시 변경되는 라우터 로 문구 정보를 가지고 오는 처리.
    useEffect(() => {
        const getCheckGetBulks = (seq) => {
            // 실제 데이터 가지고 오는
            const getBulksData = (seq) => {
                dispatch(
                    getBulkArticle({
                        bulkartSeq: seq,
                    }),
                );
            };

            // seq 값이 현재랑 다르면 데이터 가지고 오기.
            if (checkBulkSeqNumber.current !== seq) {
                checkBulkSeqNumber.current = seq;
                props.HandleEditEnable();
                getBulksData(seq);
            }
        };
        // 현재 에디트 상태 일때
        if (checkBulkSeqNumber.current !== undefined && params.bulkartSeq === undefined) {
            setBulkArticleRow(rowInit);
            checkBulkSeqNumber.current = undefined;
        } else {
            getCheckGetBulks(params.bulkartSeq);
        }

        // params 값이 변경 될때만 실행 되게.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    // Redux Store 에서 벌크 기사가 변경이되면 State 에도 변경처리.
    useEffect(() => {
        const storeBulkArticleToState = (list) => {
            let tempList = rowInit.map(function (e, index) {
                const t_title = list[index] ? list[index].title.replace(/^\s+|\s+$/g, '') : '';
                const t_url = list[index] ? list[index].url.replace(/^\s+|\s+$/g, '') : '';
                const title_length = checkTextLength(t_title);

                return {
                    ...e,
                    title: t_title,
                    url: t_url,
                    title_length: title_length,
                };
            });

            setBulkArticleRow(tempList);
        };
        if (bulkArticle.totalCnt > 0) {
            storeBulkArticleToState(bulkArticle.list);
        }

        // bulkArticle 값이 변경 될때만 실행 되게.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bulkArticle]);

    // 문구 저장.
    const handleClickSaveButton = () => {
        handleSaveBulkArticle('publish');
    };

    // 문구 임시 저장.
    const handleClickTempSaveButton = () => {
        handleSaveBulkArticle('save');
    };

    const handleClickSymbolSave = ({ value: symbol }) => {
        dispatch(changeSpecialCharCode(symbol));
        dispatch(
            saveSpecialCharCode({
                grpCd: 'specialChar',
                dtlCd: 'bulkChar',
                cdNm: symbol,
                callback: (response) => {
                    if (response.header.success) {
                        setModalMShow(false);
                    }
                    toast.result(response);
                },
            }),
        );
    };

    // 실제 저장 처리.
    const handleSaveBulkArticle = (type) => {
        let tempArray = { title: [], url: [] };

        bulkArticleRow
            .filter((e) => e.title || e.url)
            .map((element) => {
                if (element.title) tempArray.title.push(element.title);
                if (element.url) tempArray.url.push(element.url);

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
                ordNo: 0,
                title: e,
                totalId: 0,
                url: tempArray.url[i],
            };
        });

        dispatch(
            saveBulkArticle({
                type: type,
                bulkArticle: newSaveData,
                callback: ({ header: { success, message }, body: { bulkartSeq } }) => {
                    if (success === true) {
                        toast.success(message);

                        // 저장 이 완료 되면 리스트를 다시 가지고오기.
                        dispatch(getBulkList());
                        history.push(`/${bulkPathName}/${bulkartSeq}`);
                    } else {
                        messageBox.alert(message, () => {});
                    }
                },
            }),
        );
    };

    // 문구 정보에 약물 정보를 가지고 오는 처리.
    useEffect(() => {
        dispatch(getSpecialCharCode({ grpCd: 'specialChar', dtlCd: 'bulkChar' }));
    }, [dispatch]);

    // props 로 받은 edit 상태가 변경되면 라우터를 이동 시킴. ( edit disabled 변경.)
    useEffect(() => {
        const initEditState = (state) => {
            if (state === 'clear') {
                history.push(`/${bulkPathName}`);
            }
        };

        initEditState(props.EditState);
    }, [bulkPathName, history, props.EditState]);

    return (
        <>
            <MokaCard
                loading={loading}
                title={`네이버 문구 ${true ? '정보' : '등록'}`}
                titleClassName="mb-0"
                width={425}
                className={'mr-gutter flex-fill'}
                bodyClassName="overflow-hidden"
            >
                <Form>
                    <Form.Row>
                        <Col xs={10} className="justify-content-center align-items-center">
                            <MokaInputLabel
                                name={`bulk_medic`}
                                id={`bulk_medic`}
                                label="약물"
                                onChange={(e) => handleChangeBulkinputBox(e)}
                                labelWidth={87}
                                value={symbol}
                                inputClassName="shadow-none border-0"
                                disabled={editState}
                            />
                        </Col>
                        <Col xs={2} className="justify-content-center align-items-center text-right">
                            <Button variant="outline-neutral" onClick={() => handleClickSpecialCharModalButton()} disabled={editState}>
                                약물 설정
                            </Button>
                        </Col>
                    </Form.Row>
                    {[0, 1, 2].map(function (e, index) {
                        return (
                            <div key={index}>
                                <Form.Row>
                                    <Col xs={11} className="justify-content-center align-items-center">
                                        <MokaInputLabel
                                            name="title"
                                            id="title"
                                            label="타이틀"
                                            onChange={(e) => handleChangeBulkinputBox(e, index)}
                                            labelWidth={87}
                                            value={bulkArticleRow[index] ? bulkArticleRow[index].title : ''}
                                            disabled={editState}
                                        />
                                    </Col>
                                    <Col xs={1} className="justify-content-center align-items-center">
                                        <MokaInputLabel
                                            name="title_length"
                                            id="title_length"
                                            label={`${bulkArticleRow[index] ? bulkArticleRow[index].title_length : 0}자`}
                                            labelWidth={30}
                                            as="none"
                                        />
                                    </Col>
                                </Form.Row>

                                <Form.Row>
                                    <Col xs={12} className="justify-content-center align-items-center">
                                        <MokaInputLabel
                                            name="url"
                                            id="url"
                                            label="url"
                                            onChange={(e) => handleChangeBulkinputBox(e, index)}
                                            value={bulkArticleRow[index] ? bulkArticleRow[index].url : ''}
                                            labelWidth={87}
                                            disabled={editState}
                                        />
                                    </Col>
                                </Form.Row>
                            </div>
                        );
                    })}

                    <Form.Row>
                        <Col xs={12} className="justify-content-center align-items-center text-right">
                            <Button variant="outline-neutral" onClick={(e) => handlePreviewModalButton(e)} disabled={editState}>
                                미리보기
                            </Button>
                        </Col>
                    </Form.Row>
                </Form>
                <hr />
                <Form.Row>
                    <Col className="justify-content-center align-items-center text-center">
                        <Button variant="positive" className="mr-05" onClick={handleClickSaveButton} disabled={editState}>
                            저장
                        </Button>
                        <Button variant="positive" className="mr-05" onClick={handleClickTempSaveButton} disabled={editState}>
                            임시저장
                        </Button>
                    </Col>
                </Form.Row>
                {/*<SpecialCharModal show={modalMShow} onHide={() => setModalMShow(false)} onClickSave={null} />*/}
                <DefaultInputModal
                    title="약물 등록"
                    inputData={{ title: '', value: symbol, isInvalid: false }}
                    show={modalMShow}
                    onHide={() => {
                        dispatch(getSpecialCharCode({ grpCd: 'specialChar', dtlCd: 'bulkChar' }));
                        setModalMShow(false);
                    }}
                    onSave={handleClickSymbolSave}
                />
            </MokaCard>
        </>
    );
};

BulknEdit.propTypes = propTypes;
BulknEdit.defaultProps = defaultProps;

const rowInit = [
    {
        bulkartSeq: 0,
        ordNo: 0,
        title: '',
        totalId: 0,
        url: '',
        title_length: 0,
    },
    {
        bulkartSeq: 0,
        ordNo: 0,
        title: '',
        totalId: 0,
        url: '',
        title_length: 0,
    },
    {
        bulkartSeq: 0,
        ordNo: 0,
        title: '',
        totalId: 0,
        url: '',
        title_length: 0,
    },
];

export default BulknEdit;
