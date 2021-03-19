import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import toast, { messageBox } from '@utils/toastUtil';
import moment from 'moment';
import { invalidListToError } from '@utils/convertUtil';
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
    DELETE_DIRECT_LINK,
} from '@store/directLink';

const DATEFORMAT = 'YYYY-MM-DD';
const URL_ERROR = '입력한 링크가 URL 형식과 맞지 않습니다';

/**
 * 사이트 바로 가기 등록/수정창
 */
const DirectLinkEdit = ({ history, match }) => {
    const dispatch = useDispatch();
    const { linkSeq } = useParams();
    const imgFileRef = useRef(null);
    const [dateFixYn, setDateFixYn] = useState('Y'); // 계속노출.
    const [dateDisabled, setDateDisabled] = useState(true); // 계속 노출시 datePiker disable
    const loading = useSelector(({ loading }) => loading[GET_DIRECT_LINK] || loading[SAVE_DIRECT_LINK] || loading[DELETE_DIRECT_LINK]);
    const { directLink, invalidList } = useSelector(({ directLink }) => directLink);

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

        if (name === 'usedYn') {
            setTemp({ ...temp, usedYn: checked ? 'Y' : 'N' });
        } else if (name === 'dateFixYn') {
            setDateFixYn(checked ? 'Y' : 'N'); // 계속 노출 체크 여부
        } else {
            setTemp({ ...temp, [name]: value });
        }
    };

    /**
     * 계속노출 설정
     */
    const handleSDate = (date) => {
        if (typeof date === 'object') {
            setTemp({ ...temp, viewSdate: date });
        } else if (date === '') {
            setTemp({ ...temp, viewSdate: null });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleEDate = (date) => {
        if (typeof date === 'object') {
            setTemp({ ...temp, viewEdate: date });
        } else if (date === '') {
            setTemp({ ...temp, viewEdate: null });
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
                reason: '제목을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }

        // 내용
        if (!directLink.linkContent) {
            errList.push({
                field: 'linkContent',
                reason: '내용을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }

        // 링크
        if (!directLink.linkUrl) {
            errList.push({
                field: 'linkUrl',
                reason: '링크를 입력하세요',
            });
            isInvalid = isInvalid || true;
        } else {
            // URL 체크
            if (!validateLinkCheck()) {
                errList.push({
                    field: 'linkUrl',
                    reason: URL_ERROR,
                });
                isInvalid = isInvalid || true;
            }
        }

        // 키워드
        if (!directLink.linkKwd) {
            errList.push({
                field: 'linkKwd',
                reason: '키워드를 입력하세요',
            });
            isInvalid = isInvalid || true;
        }

        // 이미지 체크
        if (linkSeq && directLink.directLinkThumbnailFile === null && directLink.imgUrl === '') {
            errList.push({
                field: 'directLinkThumbnailFile',
                reason: '이미지를 선택하세요',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 링크 유효성 검사
     * @returns {boolean} true|false 검증된 링크면 true로 보냄
     */
    const validateLinkCheck = () => {
        if (temp.linkUrl === undefined || temp.linkUrl.length === 0) {
            return false;
        }
        let regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regex.test(temp.linkUrl);
    };

    /**
     * URL 체크
     */
    const validateLink = () => {
        const result = validateLinkCheck();
        if (result) {
            toast.success('유효한 URL입니다');
            setError({ ...error, linkUrl: false });
        } else {
            setError({ ...error, linkUrl: !result, linkUrlMessage: URL_ERROR });
        }
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        let saveData = {
            ...directLink,
            ...temp,
            directLinkThumbnailFile: fileValue,
        };

        let sdt = moment(temp.viewSdate).format(DATEFORMAT);
        let edt = moment(temp.viewEdate).format(DATEFORMAT);

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

        if (validate(saveData)) {
            dispatch(
                saveDirectLink({
                    type: linkSeq ? 'update' : 'insert',
                    actions: [changeDirectLink(saveData)],
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        }
    };

    /**
     * 삭제
     */
    const handleDelete = () => {
        messageBox.confirm(
            '사이트 바로가기 정보를 삭제하시겠습니까?',
            () => {
                dispatch(
                    deleteDirectLink({
                        linkSeq,
                        callback: ({ header }) => {
                            if (header.success) {
                                toast.success(header.message);
                                history.push(match.path);
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            },
            () => {},
        );
    };

    /**
     * 취소
     */
    const handleCancle = () => history.push(match.path);

    useEffect(() => {
        /**
         * 데이터 조회
         */
        if (linkSeq) {
            dispatch(
                getDirectLink({
                    linkSeq: linkSeq,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message, () => {
                                history.push(match.path);
                            });
                        }
                    },
                }),
            );
        } else {
            dispatch(clearDirectLink());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, linkSeq]);

    useEffect(() => {
        // 스토어에서 가져온 데이터 셋팅
        let viewSdate = moment(directLink.viewSdate, DATEFORMAT);
        let viewEdate = moment(directLink.viewEdate, DATEFORMAT);
        if (viewSdate === 'Invalid date') {
            viewSdate = null;
        }
        if (viewEdate === 'Invalid date') {
            viewEdate = null;
        }
        setTemp({
            ...directLink,
            viewSdate,
            viewEdate,
        });
        setError({});
        if (!directLink.viewEdate || !directLink.viewSdate) {
            setDateFixYn('Y');
        }
    }, [directLink]);

    useEffect(() => {
        if (imgFileRef.current) {
            imgFileRef.current.deleteFile();
        }
    }, [linkSeq]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    useEffect(() => {
        // 계속 노출 처리.
        if (dateFixYn === 'Y') {
            setDateDisabled(true);
        } else {
            setDateDisabled(false);
        }
    }, [dateFixYn]);

    useEffect(() => {
        return () => {
            dispatch(clearDirectLink());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard
            className="flex-fill"
            title={`사이트 바로 가기 ${linkSeq ? '수정' : '등록'}`}
            loading={loading}
            bodyClassName="overflow-visible"
            footer
            footerButtons={[
                { text: linkSeq ? '수정' : '저장', variant: 'positive', onClick: handleClickSave, className: 'mr-1' },
                linkSeq && { text: '삭제', variant: 'negative', onClick: handleDelete, className: 'mr-1' },
                { text: '취소', variant: 'negative', onClick: handleCancle },
            ].filter(Boolean)}
        >
            <Form className="mb-gutter">
                {/* 사용여부 */}
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel as="switch" name="usedYn" id="usedYn" label="사용여부" inputProps={{ checked: temp.usedYn === 'Y' }} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>

                {/* 제목 */}
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="제목" className="mb-0" name="linkTitle" value={temp.linkTitle} onChange={handleChangeValue} isInvalid={error.linkTitle} required />
                    </Col>
                </Form.Row>

                {/* 내용 */}
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            label="내용"
                            name="linkContent"
                            value={temp.linkContent}
                            onChange={handleChangeValue}
                            isInvalid={error.linkContent}
                            inputProps={{ rows: 5 }}
                            required
                        />
                    </Col>
                </Form.Row>

                {/* 링크 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel label="LINK" className="mb-0" name="linkUrl" value={temp.linkUrl} onChange={handleChangeValue} isInvalid={error.linkUrl} required />
                    </Col>
                    <Col xs={3} className="p-0 pl-2">
                        <Button variant="outline-neutral" onClick={validateLink} className="h-100 w-100">
                            유효성 검사
                        </Button>
                    </Col>
                </Form.Row>

                {/* 링크타입 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel label="LINK 타입" as="select" className="mb-0" name="linkType" value={temp.linkType} onChange={handleChangeValue}>
                        <option value="N">새창</option>
                        <option value="S">본창</option>
                    </MokaInputLabel>
                </Form.Row>

                {/* 키워드 */}
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="키워드" className="mb-0" name="linkKwd" value={temp.linkKwd} onChange={handleChangeValue} isInvalid={error.linkKwd} required />
                    </Col>
                </Form.Row>

                {/* 계속 노출 */}
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel
                        as="switch"
                        className="mr-2"
                        id="dateFixYn"
                        name="dateFixYn"
                        label="계속노출"
                        inputProps={{ checked: dateFixYn === 'Y' }}
                        onChange={handleChangeValue}
                    />
                    <MokaInputLabel
                        label="시작일"
                        labelWidth={46}
                        as="dateTimePicker"
                        name="viewSdate"
                        value={temp.viewSdate}
                        onChange={handleSDate}
                        className="mr-3"
                        inputClassName="top"
                        inputProps={{ timeFormat: null }}
                        disabled={dateDisabled}
                    />
                    <MokaInputLabel
                        label="종료일"
                        labelWidth={46}
                        as="dateTimePicker"
                        name="viewEdate"
                        value={temp.viewEdate}
                        onChange={handleEDate}
                        className="ml-3"
                        inputClassName="right top"
                        inputProps={{ timeFormat: null }}
                        disabled={dateDisabled}
                    />
                </Form.Row>

                {/* 이미지 */}
                <Form.Row className="mb-0">
                    <Col xs={12} className="p-0 d-flex align-items-center">
                        <MokaInputLabel as="none" label=" " />
                        <p className="mb-0 color-neutral">대표 이미지 (미 등록 시, 중앙일보 기본 이미지가 등록 됩니다.)</p>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            as="imageFile"
                            name="imageUrl"
                            ref={imgFileRef}
                            label={
                                <React.Fragment>
                                    이미지
                                    <br />
                                    (60*50)
                                    <br />
                                    <Button variant="gray-700" size="sm" className="mt-2" onClick={(e) => imgFileRef.current.rootRef.onClick(e)}>
                                        신규등록
                                    </Button>
                                </React.Fragment>
                            }
                            inputProps={{ img: temp.imgUrl ? `${temp.imgUrl}?${temp.linkSeq}` : null, width: 115, height: 90, setFileValue, deleteButton: true }}
                            labelClassName="justify-content-end"
                            isInvalid={error.directLinkThumbnailFile}
                            onChange={() => setError({ ...error, directLinkThumbnailFile: false })}
                        />
                    </Col>
                </Form.Row>

                {/* 노출고정 */}
                <Form.Row>
                    <Col xs={5} className="p-0">
                        <MokaInputLabel label="노출고정" as="select" className="mb-0" name="fixYn" value={temp.fixYn} onChange={handleChangeValue}>
                            <option value="N">검색시만 노출</option>
                            <option value="Y">항상노출</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default DirectLinkEdit;
