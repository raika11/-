import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaCard, MokaInputLabel } from '@components';
import { clearDirectLink, getDirectLink, GET_DIRECT_LINK, SAVE_DIRECT_LINK, changeInvalidList } from '@store/directLink';

/**
 * 사이트 바로 가기 등록/수정창
 */
const DirectLinkEdit = () => {
    const dispatch = useDispatch();
    const { linkSeq } = useParams();
    const imgFileRef = useRef(null);

    const { directLink, invalidList, loading } = useSelector((store) => ({
        directLink: store.directLink.directLink,
        invalidList: store.directLink.invalidList,
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
        } else if (name === 'linkKeyword') {
            setTemp({ ...temp, linkKeyword: value });
        } else if (name === 'usedYn') {
            setTemp({ ...temp, usedYn: checked ? 'Y' : 'N' });
        } else if (name === 'fixYn') {
            setTemp({ ...temp, fixYn: value });
        } else if (name === 'linkType') {
            setTemp({ ...temp, linkType: value });
        }
    };

    /**
     * 시작일 변경
     * @param {object} date moment object
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
     * 링크 유효성 검사
     */
    const validateLink = () => {
        setError({ ...error, linkUrl: true });
    };

    /**
     * 저장 버튼 클릭
     */
    const handleClickSave = () => {
        let saveData = {
            ...directLink,
            ...temp,
            viewSDate: null,
            viewEDate: null,
            imageFile: fileValue, // multipart 받는 dto의 필드명으로 변경하세요
        };

        let sdt = moment(temp.periodStartDt).format(DB_DATEFORMAT);
        let edt = moment(temp.periodEndDt).format(DB_DATEFORMAT);

        if (sdt !== 'Invalid date') {
            saveData.viewSDate = sdt;
        }
        if (edt !== 'Invalid date') {
            saveData.viewEDate = edt;
        }

        // validate
        // 저장
    };

    useEffect(() => {
        if (linkSeq) {
            dispatch(
                getDirectLink({
                    linkSeq: linkSeq,
                }),
            );
        } else {
            dispatch(clearDirectLink());
        }
    }, [dispatch, linkSeq]);

    useEffect(() => {
        // 스토어에서 가져온 데이터 셋팅
        setTemp({
            ...directLink,
            viewSDate: moment(directLink.viewSDate, DB_DATEFORMAT),
            viewEDate: moment(directLink.viewEDate, DB_DATEFORMAT),
        });

        if (imgFileRef.current) {
            imgFileRef.current.deleteFile();
        }
    }, [directLink]);

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

    return (
        <MokaCard width={535} title={`사이트 바로 가기 ${linkSeq ? '정보' : '등록'}`} titleClassName="mb-0" loading={loading}>
            <Form className="mb-gutter">
                {/* 제목 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel label="제목" className="mb-0" name="linkTitle" value={temp.linkTitle} onChange={handleChangeValue} />
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
                        />
                    </Col>
                </Form.Row>

                {/* 링크 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel label="LINK" className="mb-0" name="linkUrl" value={temp.linkUrl} onChange={handleChangeValue} isInvalid={error.linkUrl} />
                    </Col>
                    <Col xs={3} className="pl-2">
                        <Button variant="dark" onClick={validateLink}>
                            유효성 검사
                        </Button>
                    </Col>
                </Form.Row>

                {/* 키워드 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel label="키워드" className="mb-0" name="linkKeyword" value={temp.linkKeyword} onChange={handleChangeValue} />
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
                            value={temp.viewSDate}
                            onChange={handleSDate}
                            inputProps={{ timeFormat: null }}
                        />
                    </Col>
                    <Col xs={6} className="p-0">
                        <MokaInputLabel
                            label="종료일"
                            as="dateTimePicker"
                            className="mb-0"
                            name="viewEDate"
                            value={temp.viewEDate}
                            onChange={handleEDate}
                            inputProps={{ timeFormat: null }}
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
                            <Button
                                className="mt-1"
                                size="sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    imgFileRef.current.deleteFile();
                                }}
                            >
                                삭제
                            </Button>
                        </React.Fragment>
                    }
                    ref={imgFileRef}
                    inputProps={{ width: 195, img: temp.imgUrl, setFileValue }}
                    labelClassName="justify-content-end mr-3"
                />

                {/* 사용여부 */}
                <MokaInputLabel
                    as="switch"
                    name="usedYn"
                    id="usedYn"
                    className="mb-2"
                    label="사용여부"
                    inputProps={{ checked: temp.usedYn === 'Y' }}
                    onChange={handleChangeValue}
                />

                {/* 노출고정 */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel label="노출고정" as="select" className="mb-0" name="fixYn" value={temp.fixYn} onChange={handleChangeValue}>
                            <option value="Y">항상노출</option>
                            <option value="N">검색시만 노출</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>

                {/* 링크타입 */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel label="LINK 타입" as="select" className="mb-0" name="linkType" value={temp.linkType} onChange={handleChangeValue}>
                            <option value="N">새창</option>
                            <option value="S">본창</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
            </Form>

            <div className="d-flex justify-content-center" style={{ marginTop: 30 }}>
                <Button onClick={handleClickSave}>저장</Button>
            </div>
        </MokaCard>
    );
};

export default DirectLinkEdit;
