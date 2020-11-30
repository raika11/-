import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import toast from '@utils/toastUtil';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaCard, MokaInputLabel } from '@components';
import {
    clearDirectLink,
    getDirectLink,
    GET_DIRECT_LINK,
    SAVE_DIRECT_LINK,
    saveDirectLink,
    changeDirectLink,
    changeInvalidList,
    deleteDirectLink,
    changeDirectLinkEditMode,
} from '@store/directLink';

/**
 * 사이트 바로 가기 등록/수정창
 */
const DirectLinkEdit = ({ history }) => {
    const dispatch = useDispatch();
    const { linkSeq } = useParams();
    const imgFileRef = useRef(null);
    const [dateFixYn, setDateFixYn] = useState('Y'); // 계속노출 서정.
    const [dateDisabled, setDateDisabled] = useState(true); // 계속 노출시 datePiker disable
    const [inputBoxDisabled, setInputBoxDisabled] = useState(true);

    const { directLink, invalidList, loading, editmode } = useSelector((store) => ({
        directLink: store.directLink.directLink,
        invalidList: store.directLink.invalidList,
        editmode: store.directLink.editmode,
        loading: store.loading[GET_DIRECT_LINK] || store.loading[SAVE_DIRECT_LINK],
    }));

    // state
    const [temp, setTemp] = useState({});
    const [fileValue, setFileValue] = useState(null);
    const [error, setError] = useState({
        linkUrl: false,
    });

    /**
     * 입력값 변경
     * @param {object} e Event
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'linkTitle') {
            setTemp({ ...temp, linkTitle: value });
        } else if (name === 'linkContent') {
            setTemp({ ...temp, linkContent: value });
        } else if (name === 'linkUrl') {
            setTemp({ ...temp, linkUrl: value });
        } else if (name === 'linkKwd') {
            setTemp({ ...temp, linkKwd: value });
        } else if (name === 'usedYn') {
            setTemp({ ...temp, usedYn: checked ? 'Y' : 'N' });
        } else if (name === 'fixYn') {
            setTemp({ ...temp, fixYn: value });
        } else if (name === 'linkType') {
            setTemp({ ...temp, linkType: value });
        } else if (name === 'dateFixYn') {
            setDateFixYn(checked ? 'Y' : 'N'); // 계속 노출 체크 여부
        }
    };

    /**
     * 계속노출 설정
     */
    const handleSDate = (date) => {
        if (typeof date === 'object') {
            setTemp({ ...temp, viewSDate: date });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleEDate = (date) => {
        if (typeof date === 'object') {
            setTemp({ ...temp, viewEDate: date });
        }
    };

    /**
     * 유효성 검사를 한다.
     */
    const validate = (directLink) => {
        let isInvalid = false;
        let errList = [];

        // 제목
        if (!directLink.linkTitle) {
            errList.push({
                field: 'linkTitle',
                reason: '제목을 입력해 주세요.',
            });
            isInvalid = isInvalid || true;
        }

        // 내용
        if (!directLink.linkContent) {
            errList.push({
                field: 'linkContent',
                reason: '내용을 입력해 주세요.',
            });
            isInvalid = isInvalid || true;
        }

        // 링크
        if (!directLink.linkUrl) {
            errList.push({
                field: 'linkUrl',
                reason: '링크를 입력해 주세요.',
            });
            isInvalid = isInvalid || true;
        } else {
            // URL 체크
            if (!validateLinkCheck()) {
                errList.push({
                    field: 'linkUrl',
                    reason: '정확한 URL을 입력해 주세요.',
                });
                isInvalid = isInvalid || true;
            }
        }

        // 키워드
        if (!directLink.linkKwd) {
            errList.push({
                field: 'linkKwd',
                reason: '키워드를 입력해 주세요.',
            });
            isInvalid = isInvalid || true;
        }

        // 이미지 체크
        if (linkSeq && directLink.directLinkThumbnailFile === null && directLink.imgUrl === '') {
            errList.push({
                field: 'directLinkThumbnailFile',
                reason: '이미지를 선택해 주세요.',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 링크 유효성 검사
     */
    const validateLinkCheck = () => {
        if (temp.linkUrl === undefined || temp.linkUrl.length === 0) {
            return false;
        }
        let regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regex.test(temp.linkUrl);
    };

    // URL 체크.
    const validateLink = () => {
        setError({ ...error, linkUrl: validateLinkCheck() });
    };

    /**
     * 저장 버튼 클릭
     */
    const handleClickSave = () => {
        let saveData = {
            ...directLink,
            ...temp,
            directLinkThumbnailFile: fileValue, // multipart 받는 dto의 필드명으로 변경하세요
        };

        // console.log(saveData);

        let sdt = moment(temp.periodStartDt).format('YYYY-MM-DD');
        let edt = moment(temp.periodEndDt).format('YYYY-MM-DD');

        if (sdt !== 'Invalid date') {
            saveData.viewSdate = sdt;
        }
        if (edt !== 'Invalid date') {
            saveData.viewEdate = edt;
        }

        // 계속 노출시 날짜 초기화
        if (dateFixYn === 'Y') {
            saveData.viewSdate = null;
            saveData.viewEdate = null;
        } else {
            saveData.viewSdate = sdt;
            saveData.viewEdate = edt;
        }

        if (linkSeq && saveData.directLinkThumbnailFile === null && directLink.imgUrl) {
            // console.log(saveData);
        }

        if (validate(saveData)) {
            if (linkSeq) {
                updateDirectLink(saveData); // 업데이트
            } else {
                insertDirectLink(saveData); // 저장
            }
        }
    };

    // 임시 삭제 기능.
    const handleClickDelete = () => {
        if (linkSeq) {
            dispatch(
                deleteDirectLink({
                    linkSeq: linkSeq,
                    callback: ({ header }) => {
                        // 삭제 성공
                        if (header.success) {
                            toast.success('삭제 되었습니다.');
                            history.push('/direct-link');
                        }
                        // 삭제 실패
                        else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        }
    };

    // 업데이트 처리.
    const updateDirectLink = (tmp) => {
        dispatch(
            saveDirectLink({
                type: 'update',
                actions: [
                    changeDirectLink({
                        ...tmp,
                    }),
                ],
                callback: (response) => {
                    if (response.header.success) {
                        toast.success('수정하였습니다.');
                    } else {
                        toast.fail('실패하였습니다.');
                    }
                },
            }),
        );
    };

    // 등록 처리.
    const insertDirectLink = (tmp) => {
        dispatch(
            saveDirectLink({
                type: 'insert',
                actions: [
                    changeDirectLink({
                        ...tmp,
                    }),
                ],
                callback: (response) => {
                    if (response.header.success) {
                        toast.success('등록하였습니다.');
                        // TODO 저장 완료후 어떻게 해야 할지?
                        history.push(`direct-link/${response.body.linkSeq}`);
                        // dispatch(clearDirectLink());
                        // history.push('/direct-link');
                        // setTemp({});
                    } else {
                        toast.fail('실패하였습니다.');
                    }
                },
            }),
        );
    };

    // 정보 조회.
    useEffect(() => {
        if (linkSeq) {
            if (editmode === false) {
                dispatch(changeDirectLinkEditMode({ editmode: true }));
            }
            dispatch(
                getDirectLink({
                    linkSeq: linkSeq,
                }),
            );
        } else {
            dispatch(clearDirectLink());
        }
    }, [dispatch, editmode, linkSeq]);

    useEffect(() => {
        // 스토어에서 가져온 데이터 셋팅
        setTemp({
            ...directLink,
            viewSDate: moment(directLink.viewSdate, DB_DATEFORMAT),
            viewEDate: moment(directLink.viewEdate, DB_DATEFORMAT),
        });

        if (directLink.viewEdate === '' || directLink.viewSdate === '') {
            setDateFixYn('Y');
        }
        if (imgFileRef.current) {
            imgFileRef.current.deleteFile();
        }
    }, [directLink, dispatch, editmode]);

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            setError(
                invalidList.reduce(
                    (all, c) => ({
                        ...all,
                        [c.field]: true,
                    }),
                    {},
                ),
            );
        }
    }, [invalidList]);

    // 계속 노출 처리.
    useEffect(() => {
        if (dateFixYn === 'Y') {
            setDateDisabled(true);
        } else {
            setDateDisabled(false);
        }
    }, [dateFixYn, temp]);

    useEffect(() => {
        if (inputBoxDisabled) {
            setDateDisabled(true);
        }
    }, [inputBoxDisabled]);

    useEffect(() => {
        if (editmode === true) {
            setInputBoxDisabled(false);
        }
    }, [editmode]);

    return (
        <MokaCard width={535} title={`사이트 바로 가기 ${linkSeq ? '정보' : '등록'}`} titleClassName="mb-0" loading={loading}>
            <Form className="mb-gutter">
                {/* 사용여부 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="usedYn"
                            id="usedYn"
                            className="mb-2"
                            label="사용여부"
                            inputProps={{ checked: temp.usedYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                {/* 제목 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel
                            label="제목"
                            className="mb-0"
                            name="linkTitle"
                            value={temp.linkTitle}
                            onChange={handleChangeValue}
                            isInvalid={error.linkTitle}
                            disabled={inputBoxDisabled}
                        />
                    </Col>
                </Form.Row>

                {/* 내용 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            label="내용"
                            className="mb-0"
                            inputClassName="resize-none"
                            name="linkContent"
                            value={temp.linkContent}
                            onChange={handleChangeValue}
                            isInvalid={error.linkContent}
                            disabled={inputBoxDisabled}
                        />
                    </Col>
                </Form.Row>

                {/* 링크 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel
                            label="LINK"
                            className="mb-0"
                            name="linkUrl"
                            value={temp.linkUrl}
                            onChange={handleChangeValue}
                            isInvalid={error.linkUrl}
                            disabled={inputBoxDisabled}
                        />
                    </Col>
                    <Col xs={3} className="pl-2">
                        <Button variant="outline-neutral" onClick={validateLink}>
                            유효성 검사
                        </Button>
                    </Col>
                </Form.Row>

                {/* 키워드 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel
                            label="키워드"
                            className="mb-0"
                            name="linkKwd"
                            value={temp.linkKwd}
                            onChange={handleChangeValue}
                            isInvalid={error.linkKwd}
                            disabled={inputBoxDisabled}
                        />
                    </Col>
                </Form.Row>

                {/* 계속 노출 */}
                <Form.Row className="mb-2">
                    <Col xs={2} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            className="mb-0 h-100"
                            id="dateFixYn"
                            name="dateFixYn"
                            label="계속노출"
                            inputProps={{ checked: dateFixYn === 'Y' }}
                            onChange={handleChangeValue}
                            disabled={inputBoxDisabled}
                        />
                    </Col>
                </Form.Row>

                {/* 시작일/종료일 */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel
                            label="시작일"
                            as="dateTimePicker"
                            className="mb-0"
                            name="viewSDate"
                            value={temp.viewSdate}
                            onChange={handleSDate}
                            inputProps={{ timeFormat: null }}
                            disabled={dateDisabled}
                        />
                    </Col>
                    <Col xs={6} className="p-0">
                        <MokaInputLabel
                            label="종료일"
                            as="dateTimePicker"
                            className="mb-0"
                            name="viewEDate"
                            value={temp.viewEdate}
                            onChange={handleEDate}
                            inputProps={{ timeFormat: null }}
                            disabled={dateDisabled}
                        />
                    </Col>
                </Form.Row>

                {/* 이미지 */}
                <MokaInputLabel
                    as="imageFile"
                    className="mb-2"
                    name="imageUrl"
                    label={
                        <React.Fragment>
                            이미지
                            <br />
                            (60*50)
                            <br />
                            <Button
                                className="mt-1"
                                size="sm"
                                variant="negative"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    imgFileRef.current.deleteFile();
                                    setTemp({ ...temp, imgUrl: null });
                                }}
                                disabled={inputBoxDisabled}
                            >
                                삭제
                            </Button>
                        </React.Fragment>
                    }
                    ref={imgFileRef}
                    inputProps={{
                        // width: 50,
                        height: 90,
                        img: temp.imgUrl,
                        selectAccept: ['image/jpeg'], // 이미지중 업로드 가능한 타입 설정.
                        setFileValue,
                    }}
                    labelClassName="justify-content-end mr-3"
                    disabled={inputBoxDisabled}
                />

                {/* 노출고정 */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel label="노출고정" as="select" className="mb-0" name="fixYn" value={temp.fixYn} onChange={handleChangeValue} disabled={inputBoxDisabled}>
                            <option value="Y">항상노출</option>
                            <option value="N">검색시만 노출</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>

                {/* 링크타입 */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel
                            label="LINK 타입"
                            as="select"
                            className="mb-0"
                            name="linkType"
                            value={temp.linkType}
                            onChange={handleChangeValue}
                            disabled={inputBoxDisabled}
                        >
                            <option value="N">새창</option>
                            <option value="S">본창</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
            </Form>

            <div className="d-flex justify-content-center" style={{ marginTop: 30 }}>
                <Button variant="positive" onClick={handleClickSave} disabled={inputBoxDisabled}>
                    저장
                </Button>
            </div>
        </MokaCard>
    );
};

export default DirectLinkEdit;
