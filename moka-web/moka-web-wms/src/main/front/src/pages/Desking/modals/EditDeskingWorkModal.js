import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel, MokaModal } from '@components';
import util from '@utils/commonUtil';
import toast from '@utils/toastUtil';
import EditThumbModal from './EditThumbModal';
import { getBulkChar } from '@store/codeMgt';
import { PUT_DESKING_WORK } from '@store/desking';
import mapping, { fontSizeObj } from '../deskingPartMapping';

// const titlePrefixList = [{ name: '속보' }, { name: '단독' }];
// const prefixLocationList = [{ name: '제목 앞' }, { name: '제목 뒤' }, { name: '부제 앞' }, { name: '부제 뒤' }, { name: '리드문 앞' }, { name: '리드문 뒤' }];
// const titleLocationList = [{ name: '상단' }, { name: '하단' }];
const urlRegex = /[Uu]rl$/;

/**
 * 데스킹 기사정보 편집 모달 컴포넌트
 */
const EditDeskingWorkModal = (props) => {
    const { show, onHide, deskingWorkData, component, onSave, deskingPart: deskingPartStr } = props;
    const dispatch = useDispatch();
    const { bulkCharRows, loading } = useSelector((store) => ({
        bulkCharRows: store.codeMgt.bulkCharRows,
        loading: store.loading[PUT_DESKING_WORK],
    }));
    const imgFileRef = useRef(null);

    // state
    const [deskingPart, setDeskingPart] = useState([]); // area의 deskingPart 리스트
    const [fileValue, setFileValue] = useState(null); // 파일
    const [fontListType, setFontListType] = useState(''); // 제목의 폰트 타입
    const [error, setError] = useState({});
    const [showModal, setShowModal] = useState(false); // 새이미지 등록 팝업 모달
    const [specialChar, setSpecialChar] = useState(''); // 약물
    const [deskingData, setDeskingData] = useState({}); // 데스킹워크 데이터

    /**
     * validate
     */
    const validate = () => {
        const regex = /[^\s\t\n]+/;
        let invalid = false,
            obj = {};

        if (!regex.test(deskingData.title)) {
            obj.title = true;
            invalid = invalid || true;
        } else {
            obj.title = false;
        }

        setError({ ...obj });
        return !invalid;
    };

    /**
     * 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;
        setDeskingData({ ...deskingData, [name]: value });
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        if (validate()) {
            onSave(
                {
                    ...deskingWorkData,
                    thumbnailFile: fileValue || null,
                },
                ({ header }) => {
                    if (!header.success) {
                        toast.fail(header.message);
                    } else {
                        handleHide();
                    }
                },
            );
        }
    };

    /**
     * 닫기
     */
    const handleHide = () => {
        setDeskingData({});
        if (imgFileRef.current) {
            imgFileRef.current.deleteFile();
        }
        onHide();
    };

    useEffect(() => {
        if (deskingPartStr === '') return;

        const list = deskingPartStr.split(',');
        const filtered = list.filter((part) => !fontSizeObj[part]);
        setDeskingPart(filtered);

        if (list.length !== filtered.length) {
            const fontPart = list.find((part) => fontSizeObj[part]);
            setFontListType(fontPart);
        }
    }, [deskingPartStr]);

    useEffect(() => {
        // 기사 deskingWorkData 셋팅
        if (show && deskingWorkData) {
            setDeskingData(deskingWorkData);
        }
    }, [deskingWorkData, show]);

    useEffect(() => {
        // 기타코드 로드
        if (show) {
            if (bulkCharRows.length < 1) {
                dispatch(getBulkChar());
            } else {
                setSpecialChar(bulkCharRows.find((char) => char.dtlCd === 'bulkChar').cdNm);
            }
        }
    }, [bulkCharRows, dispatch, show]);

    return (
        <>
            <MokaModal
                titleAs={
                    <div className="w-100 d-flex flex-column">
                        <div className="p-0 d-flex h4 mb-0">
                            <p className="m-0 mr-2">{deskingWorkData.rel ? `0${deskingWorkData.relOrd}`.substr(-2) : `0${deskingWorkData.contentOrd}`.substr(-2)}</p>
                            <p className="m-0">{deskingWorkData.title}</p>
                        </div>
                        <div className="p-0 d-flex ft-12">
                            <p className="m-0 mr-3">ID: {deskingWorkData.contentId}</p>
                            <p className="m-0">
                                (cp{component.componentSeq} {component.componentName})
                            </p>
                        </div>
                    </div>
                }
                width={650}
                size="lg"
                show={show}
                onHide={onHide}
                buttons={[
                    { variant: 'positive', text: '저장', onClick: handleClickSave },
                    { variant: 'negative', text: '취소', onClick: handleHide },
                ]}
                footerClassName="d-flex justify-content-center"
                bodyClassName="custom-scroll"
                loading={loading}
                draggable
            >
                <Form>
                    {deskingPart.map((partKey) => {
                        const mappingData = mapping[partKey];

                        // 약물(기타코드), 대표이미지, 아이콘(기타코드), 말머리(기타코드), 제목/부제위치(기타코드), 제목(기타코드), 영상은 예외처리
                        if (partKey === 'TITLE') {
                            const { as, field, label, errorCheck, ...mappingProps } = mappingData;

                            return (
                                <Form.Row key={partKey} className="mb-2">
                                    <Col xs={11} className="p-0">
                                        <MokaInputLabel
                                            as={as}
                                            label={
                                                <React.Fragment>
                                                    {label}
                                                    {fontListType && (
                                                        <MokaInput as="select" size="sm" name="fontSize" value={deskingData.fontSize} onChange={handleChangeValue}>
                                                            <option hidden>테스트</option>
                                                            {/* {fontSizeList.map((font, idx) => (
                                                            <option key={idx} value={font.size}>
                                                                {font.name}
                                                            </option>
                                                        ))} */}
                                                        </MokaInput>
                                                    )}
                                                </React.Fragment>
                                            }
                                            labelWidth={80}
                                            labelClassName="ft-12 pr-3"
                                            name={field}
                                            className="mb-0 w-100"
                                            value={deskingData[field]}
                                            onChange={handleChangeValue}
                                            isInvalid={errorCheck && error[field]}
                                            {...mappingProps}
                                        />
                                    </Col>
                                    <Col xs={1} className="p-0 pl-1 ft-12 d-flex align-items-end">
                                        {deskingData[field] && util.euckrBytes(deskingData[field])}byte
                                    </Col>
                                </Form.Row>
                            );
                        } else if (partKey === 'THUMB_FILE_NAME') {
                            return (
                                <Form.Row key={partKey} className="mb-2 flex-column">
                                    <MokaInputLabel
                                        ref={imgFileRef}
                                        label="대표\n이미지"
                                        labelWidth={80}
                                        labelClassName="ft-12 pr-3"
                                        name="thumbnailFile"
                                        as="imageFile"
                                        className="mb-0"
                                        inputProps={{ width: 216, height: 150, img: deskingData.thumbFileName, setFileValue }}
                                    />
                                    <div className="mt-2 d-flex justify-content-between" style={{ width: 216, marginLeft: 80 }}>
                                        <Button variant="positive" size="sm" onClick={() => setShowModal(true)}>
                                            신규등록
                                        </Button>
                                        <Button variant="outline-neutral" size="sm">
                                            편집
                                        </Button>
                                    </div>
                                </Form.Row>
                            );
                        } else if (partKey === 'SPECIAL_CHAR') {
                            return (
                                <Form.Row key={partKey} className="mb-2">
                                    <MokaInputLabel
                                        label="약물"
                                        labelWidth={80}
                                        labelClassName="ft-12 pr-3"
                                        className="mb-0 w-100"
                                        value={specialChar}
                                        inputProps={{ plaintext: true, readOnly: true }}
                                    />
                                </Form.Row>
                            );
                        } else if (mappingData) {
                            const { as, field, label, errorCheck, ...mappingProps } = mappingData;
                            const isUrl = urlRegex.test(field);

                            return (
                                <Form.Row key={partKey} className="mb-2">
                                    <Col xs={isUrl ? 10 : 12} className={clsx('p-0', { 'pr-2': isUrl })}>
                                        <MokaInputLabel
                                            as={as}
                                            label={label}
                                            labelWidth={80}
                                            labelClassName="ft-12 pr-3"
                                            name={field}
                                            className="mb-0 w-100"
                                            value={deskingData[field]}
                                            onChange={handleChangeValue}
                                            isInvalid={errorCheck && error[field]}
                                            {...mappingProps}
                                        />
                                    </Col>
                                    {isUrl && (
                                        <Col xs={2} className="p-0">
                                            <MokaInput as="select" name={`${field}Target`} value={deskingData[`${field}Target`]} className="ft-12" onChange={handleChangeValue}>
                                                <option value="_self" className="ft-12">
                                                    본창
                                                </option>
                                                <option value="_blank" className="ft-12">
                                                    새창
                                                </option>
                                            </MokaInput>
                                        </Col>
                                    )}
                                </Form.Row>
                            );
                        } else {
                            return null;
                        }
                    })}
                    {/* 
                            <MokaInputLabel label="말머리" labelWidth={80} as="none" />
                            <Col xs={5} className="p-0 d-flex align-items-center justify-content-between">
                                <MokaInput className="mb-3 mr-2 ft-12" as="select" name="titlePrefix" value={deskingData.titlePrefix} onChange={handleChangeValue}>
                                    {titlePrefixList.map((prefix, idx) => (
                                        <option key={idx} value={idx} className="ft-12">
                                            {prefix.name}
                                        </option>
                                    ))}
                                </MokaInput>
                                <MokaInput className="mb-3 mr-2 ft-12" as="select" name="prefixLocation" value={deskingData.prefixLocation} onChange={handleChangeValue}>
                                    {prefixLocationList.map((prefixLocation, idx) => (
                                        <option key={idx} value={idx} className="ft-12">
                                            {prefixLocation.name}
                                        </option>
                                    ))}
                                </MokaInput>
                            </Col>
                            <div className="w-100">
                                <MokaInputLabel
                                    inputClassName="ft-12"
                                    label="제목/부제위치"
                                    labelWidth={90}
                                    as="select"
                                    name="titleLocation"
                                    value={deskingData.titleLocation}
                                    onChange={handleChangeValue}
                                >
                                    {titleLocationList.map((titleLocation, idx) => (
                                        <option key={idx} value={idx} className="ft-12">
                                            {titleLocation.name}
                                        </option>
                                    ))}
                                </MokaInputLabel>
                            </div>
                        </Form.Row>
                        <Form.Row className="d-flex align-items-center">
                            <MokaInputLabel label="영상" labelWidth={80} className="m-0" onChange={handleChangeValue} as="none" />
                            <div className="w-100">
                                <MokaSearchInput placeholder="url 입력해주세요" name="moreUrl" value={deskingData.moreUrl} onChange={handleChangeValue} />
                            </div>
                        </Form.Row> */}
                </Form>
            </MokaModal>
            <EditThumbModal show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

export default EditDeskingWorkModal;
