import React, { useState, useEffect } from 'react';
import { MokaCard, MokaInputLabel } from '@components';
import { Form, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast, { messageBox } from '@utils/toastUtil';
import { GET_BULK_LIST, saveBulkArticle, getBulkList, showPreviewModal, getBulkArticle } from '@store/bulks';
import { changeSpecialCharCode, getSpecialCharCode, saveSpecialCharCode } from '@store/codeMgt';
import DefaultInputModal from '@pages/commons/DefaultInputModal';
import { W3C_URL } from '@/constants';
import commonUtil from '@utils/commonUtil';

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
    // const params = useParams();
    const history = useHistory();

    const { loading, bulkArticle, bulkartSeq, bulkPathName, cdNm: symbol, copyright } = useSelector((store) => ({
        bulkPathName: store.bulks.bulkPathName,
        bulkartSeq: store.bulks.bulkn.bulkartSeq,
        bulkArticle: store.bulks.bulkn.bulkArticle,
        cdNm: store.codeMgt.specialCharCode.cdNm,
        copyright: store.bulks.bulkn.copyright,
        loading: store.loading[GET_BULK_LIST],
    }));

    const dispatch = useDispatch();
    // const checkBulkSeqNumber = useRef();
    const [modalMShow, setModalMShow] = useState(false);
    // 최초엔 정보 영역이 계속 보여지는 상태여서 disable 기능이 필요했지만
    // 현재는 살아졌다 나타났다 하기 때문에 disable 기능이 필요 없어져서 항상 enable 상태로 변경..
    const [bulkArticleRow, setBulkArticleRow] = useState(rowInit); // 선택된 벌크 기사들.

    const [tempButton, setTempButton] = useState(false);

    // 약물 수정 삭제 모달 창.
    // 사용안함.
    // const handleClickSpecialCharModalButton = () => {
    //     setModalMShow(true);
    // };

    // 모달창 스토어에 문구들과 상태값 전달.
    const handlePreviewModalButton = (e) => {
        dispatch(
            showPreviewModal({
                state: true,
                activeKey: 1,
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

    // 현재 선택한 bulkartSeq 가 없을떄 ( 등록 상태.).
    useEffect(() => {
        // 등록 상태.
        if (bulkartSeq === null) {
            setBulkArticleRow(rowInit);
            setTempButton(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bulkartSeq]);

    // Redux Store 에서 벌크 기사가 변경이되면 State 에도 변경처리.
    useEffect(() => {
        const storeBulkArticleToState = (data) => {
            const { list, bulk } = data;
            let tempList = rowInit.map(function (e, index) {
                const t_title = list[index] ? list[index].title.replace(/^\s+|\s+$/g, '') : '';
                const t_url = list[index] ? list[index].url.replace(/^\s+|\s+$/g, '') : '';
                const t_symbol = list[index] ? list[index].symbol : '';
                const title_length = checkTextLength(t_title);

                return {
                    ...e,
                    title: t_title,
                    url: t_url,
                    symbol: t_symbol,
                    title_length: title_length,
                };
            });

            if (bulk.usedYn === 'N') {
                setTempButton(false);
            } else {
                tempButton === false && setTempButton(true);
            }

            setBulkArticleRow(tempList);
        };
        if (bulkArticle.list) {
            storeBulkArticleToState(bulkArticle);
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

    // 취소 버튼
    const handleClickCancleButton = () => {
        history.push(`/${bulkPathName}`);
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
        let tempArray = { title: [], url: [], symbol: [] };

        bulkArticleRow
            .filter((e) => e.title || e.url || e.symbol)
            .map((element) => {
                if (element.title) tempArray.title.push(element.title);
                if (element.url) tempArray.url.push(element.url);
                if (element.symbol) tempArray.symbol.push(element.symbol);

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
                symbol: tempArray.symbol[i],
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
                        dispatch(
                            getBulkArticle({
                                bulkartSeq: bulkartSeq,
                            }),
                        );
                        history.push(`/${bulkPathName}/${bulkartSeq}`);
                    } else {
                        messageBox.alert(message, () => {});
                    }
                },
            }),
        );
    };

    const handleClickW3ccheck = () => {
        let tempArray = { title: [], url: [], symbol: [] };

        const checkBody = `<!doctype html>
<html lang="ko">
<head>

<base href="https://joongang.joins.com"/>
<meta charset="utf-8">
<title>JoongAng Ilbo</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="title" content="중앙일보 - title">
<meta name="description" content="description - 대한민국 No.1 종합 일간지 중앙일보">
<meta name="keywords" content="중앙일보, 중앙, joongang, 조인스, 뉴스, 속보, 신문, 보도, 속보, 이슈, 스페셜, 정치, 경제, 오피니언, 사회, 국제, 문화, 스포츠, 스타기자, 뉴스레터, news, newspaper, south Korea, korea">
<meta property="og:title" content="중앙일보 - title">
<meta property="og:url" content="url">
<meta property="og:image" content="...png">
<meta property="og:description" content="description - 대한민국 No.1 종합 일간지 중앙일보">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="중앙일보 - title">
<meta name="twitter:url" content="url">
<meta name="twitter:image" content="...png">
<meta name="twitter:description" content="description - 대한민국 No.1 종합 일간지 중앙일보">

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
</head>
<body>
${bulkArticleRow
    .filter((e) => e.title || e.url || e.symbol)
    .map((element) => {
        if (element.title) tempArray.title.push(element.title);
        if (element.url) tempArray.url.push(element.url);
        if (element.symbol) tempArray.symbol.push(element.symbol);

        return element;
    })
    .filter((e) => e.url.length > 0)
    .map(function (e) {
        return `▶ <a href="${e.url}" target="joins_nw">${e.title}</a>
`;
    })
    .join(``)}${copyright.cdNm}
</body>
</html>`;
        commonUtil.popupPreview(W3C_URL, { fragment: checkBody }, 'multipart/form-data');
    };

    // 문구 정보에 약물 정보를 가지고 오는 처리.
    useEffect(() => {
        dispatch(getSpecialCharCode({ grpCd: 'specialChar', dtlCd: 'bulkChar' }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 최초 로딩시에 파라미터로 bulkartSeq 값이 있다면 벌크 문구 기사를 가지고 온다.
    useEffect(() => {
        if (props.match.params && props.match.params.bulkartSeq) {
            dispatch(
                getBulkArticle({
                    bulkartSeq: props.match.params.bulkartSeq,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <MokaCard
                loading={loading}
                title={`네이버 문구 ${bulkartSeq ? '정보' : '등록'}`}
                titleClassName="mb-0"
                width={325}
                className={'mr-gutter flex-fill'}
                bodyClassName="overflow-hidden"
                footerClassName="justify-content-center"
                footer
                footerButtons={[
                    { text: 'W3C 검사', variant: 'outline-neutral', onClick: () => handleClickW3ccheck(), className: 'mr-05' },
                    { text: '저장', variant: 'positive', onClick: () => handleClickSaveButton(), className: 'mr-05' }, // , useAuth: true
                    { text: '임시저장', variant: 'positive', onClick: () => handleClickTempSaveButton(), className: 'mr-05', disabled: tempButton === true ? true : false }, //useAuth: true
                    // { text: selectSaveButtonNane.current, variant: 'positive', onClick: handleClickSaveButton, className: 'mr-05' },
                    { text: '미리보기', variant: 'outline-neutral', onClick: (e) => handlePreviewModalButton(e), className: 'mr-05' },
                    { text: '취소', variant: 'negative', onClick: () => handleClickCancleButton(), className: 'mr-05' },
                ]}
            >
                <Form>
                    {/* select box 로 변경. */}
                    {/* <Form.Row>
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
                    </Form.Row> */}
                    {[0, 1, 2].map(function (e, index) {
                        return (
                            <div key={index} className="mb-2 pb-2">
                                <Form.Row className="mb-2">
                                    <Col xs={3} className="p-0">
                                        <MokaInputLabel
                                            label="타이틀"
                                            as="select"
                                            name="symbol"
                                            id="symbol"
                                            value={bulkArticleRow[index] ? bulkArticleRow[index].symbol : ''}
                                            onChange={(e) => handleChangeBulkinputBox(e, index)}
                                        >
                                            <option hidden>선택</option>
                                            {symbol
                                                .split(' ')
                                                .filter((e) => e !== '')
                                                .map((item, index) => (
                                                    <option key={index} value={item}>
                                                        {item}
                                                    </option>
                                                ))}
                                        </MokaInputLabel>
                                    </Col>
                                    {/* <Col xs={1} className="justify-content-center align-items-center"></Col> */}
                                    {/*<div className="mr-2">
                                        <MokaInput
                                            as="select"
                                            name="symbol"
                                            id="symbol"
                                            value={bulkArticleRow[index] ? bulkArticleRow[index].symbol : ''}
                                            onChange={(e) => handleChangeBulkinputBox(e, index)}
                                            style={{ width: '70px' }}
                                        >
                                            <option hidden>선택</option>
                                            {symbol
                                                .split(' ')
                                                .filter((e) => e !== '')
                                                .map((item, index) => (
                                                    <option key={index} value={item}>
                                                        {item}
                                                    </option>
                                                ))}
                                        </MokaInput>
                                    </div>*/}
                                    <Col xs={8} className="pr-0">
                                        <MokaInputLabel
                                            name="title"
                                            id="title"
                                            onChange={(e) => handleChangeBulkinputBox(e, index)}
                                            value={bulkArticleRow[index] ? bulkArticleRow[index].title : ''}
                                        />
                                    </Col>
                                    <Col xs={1}>
                                        <MokaInputLabel
                                            name="title_length"
                                            id="title_length"
                                            label={`${bulkArticleRow[index] ? bulkArticleRow[index].title_length : 0}자`}
                                            as="none"
                                            className="h-100 align-items-center d-flex"
                                        />
                                    </Col>
                                </Form.Row>

                                <Form.Row>
                                    <Col xs={11} className="p-0">
                                        <MokaInputLabel
                                            name="url"
                                            id="url"
                                            label="url"
                                            className="w-100"
                                            onChange={(e) => handleChangeBulkinputBox(e, index)}
                                            value={bulkArticleRow[index] ? bulkArticleRow[index].url : ''}
                                        />
                                    </Col>
                                </Form.Row>
                                <hr />
                            </div>
                        );
                    })}
                </Form>
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
        symbol: '▶',
        title_length: 0,
    },
    {
        bulkartSeq: 0,
        ordNo: 0,
        title: '',
        totalId: 0,
        url: '',
        symbol: '▶',
        title_length: 0,
    },
    {
        bulkartSeq: 0,
        ordNo: 0,
        title: '',
        totalId: 0,
        url: '',
        symbol: '▶',
        title_length: 0,
    },
];

export default BulknEdit;
