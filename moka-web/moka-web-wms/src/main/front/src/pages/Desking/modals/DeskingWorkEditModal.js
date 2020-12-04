import React, { useState, useEffect } from 'react';
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
import mapping from '../deskingPartMapping';

// const titlePrefixList = [{ name: '속보' }, { name: '단독' }];
// const prefixLocationList = [{ name: '제목 앞' }, { name: '제목 뒤' }, { name: '부제 앞' }, { name: '부제 뒤' }, { name: '리드문 앞' }, { name: '리드문 뒤' }];
// const titleLocationList = [{ name: '상단' }, { name: '하단' }];
// const fontSizeList = [{ name: '36px' }, { name: '41px' }, { name: '45px' }, { name: '48px' }];
const linkTargetList = [
    { id: 'S', name: '본창' },
    { id: 'N', name: '새창' },
];
const urlRegex = /[Uu]rl$/;

/**
 * 데스킹 기사정보 편집 모달 컴포넌트
 */
const DeskingWorkEditModal = (props) => {
    const { show, onHide, deskingWorkData, component, onSave, deskingPart: deskingPartStr } = props;
    const dispatch = useDispatch();
    const bulkCharRows = useSelector((store) => store.codeMgt.bulkCharRows);

    // state
    const [deskingPart, setDeskingPart] = useState([]); // area의 deskingPart 리스트
    const [error, setError] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [specialChar, setSpecialChar] = useState(''); // 약물
    const [deskingData, setDeskingData] = useState({}); // 데스킹워크 데이터

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
     * modal의 항목 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        setDeskingData({ ...deskingData, [name]: value });
        // if (name === 'thumbFileName') {
        //     setDeskingData({ ...deskingData, thumbFileName: value });
        // } else if (name === 'title') {
        //     setDeskingData({ ...deskingData, title: value });
        // } else if (name === 'nameplate') {
        //     setDeskingData({ ...deskingData, nameplate: value });
        // } else if (name === 'titlePrefix') {
        //     setDeskingData({ ...deskingData, titlePrefix: value });
        // } else if (name === 'prefixLocation') {
        //     setDeskingData({ ...deskingData, prefixLocation: value });
        // } else if (name === 'titleLocation') {
        //     setDeskingData({ ...deskingData, titleLocation: value });
        // } else if (name === 'fontSize') {
        //     setDeskingData({ ...deskingData, fontSize: value });
        // } else if (name === 'subTitle') {
        //     setDeskingData({ ...deskingData, subTitle: value });
        // } else if (name === 'bodyHead') {
        //     setDeskingData({ ...deskingData, bodyHead: value });
        // } else if (name === 'linkUrl') {
        //     setDeskingData({ ...deskingData, linkUrl: value });
        // } else if (name === 'linkTarget') {
        //     setDeskingData({ ...deskingData, linkTarget: value });
        // } else if (name === 'moreUrl') {
        //     setDeskingData({ ...deskingData, moreUrl: value });
        // }
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        if (validate()) {
            const deskingWork = {
                ...deskingWorkData,
                thumbFileName: deskingData.thumbFileName,
                nameplate: deskingData.nameplate,
                title: deskingData.title.length > 0 ? deskingData.title : null,
                titlePrefix: deskingData.titlePrefix,
                subTitle: deskingData.subTitle,
                bodyHead: deskingData.bodyHead,
            };
            const callback = (response) => {
                if (response.header) {
                    toast.success(response.header.message);
                    handleHide();
                } else {
                    toast.fail(response.header.message);
                }
            };
            onSave(deskingWork, callback);
        }
    };

    /**
     * 닫기
     */
    const handleHide = () => {
        setDeskingData({});
        onHide();
    };

    useEffect(() => {
        deskingPartStr?.length > 0 && setDeskingPart(deskingPartStr.split(','));
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
                    { variant: 'negative', text: '리로드' },
                ]}
                footerClassName="d-flex justify-content-center"
                draggable
            >
                <div className="d-flex justify-content-between">
                    <Form className="flex-fill">
                        {deskingPart.map((partKey) => {
                            const mappingData = mapping[partKey];
                            const isUrl = urlRegex.test(partKey);

                            // 대표이미지, 아이콘, 말머리, 제목/부제위치, 영상, 라이브제목, 약물은 예외처리
                            if (partKey === 'thumbFileName') {
                                return (
                                    <Form.Row key={partKey} className="mb-2 flex-column">
                                        <MokaInputLabel
                                            name="thumbFileName"
                                            as="imageFile"
                                            label="대표\n이미지"
                                            labelClassName="ft-12 pr-3"
                                            className="mb-0"
                                            inputProps={{ width: 150, height: 150 }}
                                        />
                                        <div className="mt-2 d-flex justify-content-between" style={{ width: 150, marginLeft: 70 }}>
                                            <Button variant="outline-neutral" size="sm" onClick={() => setShowModal(true)}>
                                                신규등록
                                            </Button>
                                            <Button variant="outline-neutral" size="sm">
                                                편집
                                            </Button>
                                        </div>
                                    </Form.Row>
                                );
                            } else if (partKey === 'specialChar') {
                                return (
                                    <Form.Row key={partKey} className="mb-2">
                                        <MokaInputLabel
                                            label="약물"
                                            labelClassName="ft-12 pr-3"
                                            className="mb-0 w-100"
                                            value={specialChar}
                                            inputProps={{ plaintext: true, readOnly: true }}
                                        />
                                    </Form.Row>
                                );
                            } else if (mappingData) {
                                const { as, field, label, errorCheck, ...mappingProps } = mappingData;

                                return (
                                    <Form.Row key={partKey} className="mb-2">
                                        <Col xs={isUrl ? 10 : 12} className={clsx('p-0', { 'pr-2': isUrl })}>
                                            <MokaInputLabel
                                                as={as}
                                                label={label}
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
                                                <MokaInput
                                                    as="select"
                                                    name={`${partKey}Target`}
                                                    value={deskingData[`${partKey}Target`]}
                                                    className="ft-12"
                                                    onChange={handleChangeValue}
                                                >
                                                    {linkTargetList.map((target) => (
                                                        <option key={target.id} value={target.id} className="ft-12">
                                                            {target.name}
                                                        </option>
                                                    ))}
                                                </MokaInput>
                                            </Col>
                                        )}
                                    </Form.Row>
                                );
                            } else {
                                return null;
                            }
                        })}
                        {/* <MokaInputLabel label="어깨제목" labelWidth={80} inputClassName="ft-12" name="nameplate" value={deskingData.nameplate} onChange={handleChangeValue} />
                        <MokaInputLabel
                                label="약물"
                                labelWidth={50}
                                labelClassName="d-flex justify-content-start"
                                value={specialChar}
                                inputProps={{ plaintext: true, readOnly: true }}
                            />
                            <div>
                                <MokaImageInput width={150} height={150} img={deskingData.thumbFileName} alt="기사 사진" name="thumbFileName" />
                                <div className="mt-2 px-1 d-flex justify-content-between">
                                    <Button variant="outline-neutral" size="sm" onClick={() => setShowModal(true)}>
                                        대표사진변경
                                    </Button>
                                    <Button variant="outline-neutral" size="sm">
                                        편집
                                    </Button>
                                </div>
                            </div>
                        <Form.Row>
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
                        <Form.Row>
                            <div className="w-100 p-0">
                                <MokaInputLabel
                                    label={
                                        <React.Fragment>
                                            Web제목 <br />
                                            <MokaInput as="select" size="sm" name="fontSize" value={deskingData.fontSize} onChange={handleChangeValue}>
                                                {fontSizeList.map((font, idx) => (
                                                    <option key={idx} value={font.size}>
                                                        {font.name}
                                                    </option>
                                                ))}
                                            </MokaInput>
                                        </React.Fragment>
                                    }
                                    labelWidth={80}
                                    inputClassName="ft-12 resize-none"
                                    name="title"
                                    value={deskingData.title}
                                    as="textarea"
                                    inputProps={{ rows: 3 }}
                                    onChange={handleChangeValue}
                                    isInvalid={error.title}
                                />
                            </div>
                            <Col xs={1} className="w-100 p-0 d-flex align-items-end">
                                <div className="mb-3 pl-1 ft-12">{deskingData.title && util.euckrBytes(deskingData.title)}byte</div>
                            </Col>
                        </Form.Row>
                        <MokaInputLabel label="부제" labelWidth={80} inputClassName="ft-12" name="subTitle" value={deskingData.subTitle} onChange={handleChangeValue} />
                        <MokaInputLabel
                            label="리드문"
                            labelWidth={80}
                            inputClassName="ft-12 resize-none"
                            name="bodyHead"
                            as="textarea"
                            inputProps={{ rows: 5 }}
                            value={deskingData.bodyHead}
                            onChange={handleChangeValue}
                        />
                        <Form.Row className="d-flex align-items-center">
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="url"
                                    labelWidth={80}
                                    placeholder="url 입력해주세요"
                                    name="linkUrl"
                                    value={deskingData.linkUrl}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <MokaInput className="mb-3 ml-2" as="select" name="linkTarget" value={deskingData.linkTarget} onChange={handleChangeValue}>
                                {linkTargetList.map((target) => (
                                    <option key={target.id} value={target.id} className="ft-12">
                                        {target.name}
                                    </option>
                                ))}
                            </MokaInput>
                        </Form.Row>
                        <Form.Row className="d-flex align-items-center">
                            <MokaInputLabel label="영상" labelWidth={80} className="m-0" onChange={handleChangeValue} as="none" />
                            <div className="w-100">
                                <MokaSearchInput placeholder="url 입력해주세요" name="moreUrl" value={deskingData.moreUrl} onChange={handleChangeValue} />
                            </div>
                        </Form.Row> */}
                    </Form>
                </div>
            </MokaModal>
            <EditThumbModal show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

export default DeskingWorkEditModal;
