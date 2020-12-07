import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import toast from '@utils/toastUtil';
import { getBulkChar } from '@store/codeMgt';
import { PUT_DESKING_WORK } from '@store/desking';
import { MokaInputLabel, MokaModal } from '@components';
import IconForm from './IconForm';
import TitleForm from './TitleForm';
import TextForm from './TextForm';
import TitleLocForm from './TitleLocForm';
import TitlePrefixForm from './TitlePrefixForm';
import VodUrlForm from './VodUrlForm';
import EditThumbModal from '@pages/Desking/modals/EditThumbModal';
import mapping, { fontSizeObj } from '@pages/Desking/deskingPartMapping';

const urlRegex = /[Uu]rl$/;

/**
 * 데스킹 기사정보 편집 모달 컴포넌트
 */
const EditDeskingWorkModal = (props) => {
    const { show, onHide, deskingWorkData, component, onSave, deskingPart: deskingPartStr } = props;
    const dispatch = useDispatch();
    const { bulkCharRows, IR_URL, loading } = useSelector((store) => ({
        bulkCharRows: store.codeMgt.bulkCharRows,
        loading: store.loading[PUT_DESKING_WORK],
        IR_URL: store.app.IR_URL,
    }));
    const imgFileRef = useRef(null);

    // state
    const [deskingPart, setDeskingPart] = useState([]); // area의 deskingPart 리스트
    const [fileValue, setFileValue] = useState(null); // 파일
    const [titleListType, setTitleListType] = useState(''); // 제목의 폰트 타입
    const [error, setError] = useState({});
    const [showModal, setShowModal] = useState(false); // 새이미지 등록 팝업 모달
    const [specialChar, setSpecialChar] = useState(''); // 약물
    const [temp, setTemp] = useState({}); // 폼 데이터

    /**
     * validate
     */
    const validate = () => {
        const regex = /[^\s\t\n]+/;
        let invalid = false,
            obj = {};

        if (!regex.test(temp.title)) {
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
        setTemp({ ...temp, [name]: value });
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        if (validate()) {
            onSave(
                {
                    ...temp,
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
        setTemp({});
        if (imgFileRef.current) {
            imgFileRef.current.deleteFile();
        }
        onHide();
    };

    useEffect(() => {
        // deskingPart 안에서 폰트사이즈 분리
        if (!deskingPartStr || deskingPartStr === '') return;

        const list = deskingPartStr.split(',');
        const filtered = list.filter((part) => !fontSizeObj[part]);
        setDeskingPart(filtered);

        if (list.length !== filtered.length) {
            const fontPart = list.find((part) => fontSizeObj[part]);
            setTitleListType(fontPart);
        }
    }, [deskingPartStr]);

    useEffect(() => {
        // 기사 deskingWorkData 셋팅
        if (show && deskingWorkData) {
            // 이미지경로
            let irImg = deskingWorkData.thumbFileName ? `${IR_URL}?t=k&w=216&h=150u=//${deskingWorkData.thumbFileName}` : undefined;
            setTemp({
                ...deskingWorkData,
                irImg,
            });
        }
    }, [IR_URL, deskingWorkData, show]);

    useEffect(() => {
        // 기타코드 로드
        if (show) {
            !bulkCharRows ? dispatch(getBulkChar()) : setSpecialChar(bulkCharRows.find((char) => char.dtlCd === 'bulkChar').cdNm);
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

                        // 제목(기타코드), 대표이미지, 약물(기타코드), 아이콘(기타코드), 말머리(기타코드), 제목/부제위치(기타코드), 영상은 예외처리
                        if (partKey === 'TITLE') {
                            return (
                                <TitleForm
                                    key={partKey}
                                    show={show}
                                    mappingData={mappingData}
                                    onChange={handleChangeValue}
                                    temp={temp}
                                    titleListType={titleListType}
                                    error={error}
                                />
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
                                        inputProps={{ width: 216, height: 150, img: temp.irImg, setFileValue }}
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
                        } else if (partKey === 'ICON_FILE_NAME') {
                            return <IconForm show={show} key={partKey} temp={temp} setTemp={setTemp} onChange={handleChangeValue} />;
                        } else if (partKey === 'TITLE_PREFIX') {
                            return <TitlePrefixForm show={show} key={partKey} temp={temp} onChange={handleChangeValue} />;
                        } else if (partKey === 'TITLE_LOC') {
                            return <TitleLocForm show={show} key={partKey} temp={temp} onChange={handleChangeValue} />;
                        } else if (partKey === 'VOD_URL') {
                            return <VodUrlForm show={show} key={partKey} temp={temp} onChange={handleChangeValue} />;
                        } else if (mappingData) {
                            return <TextForm key={partKey} mappingData={mappingData} temp={temp} urlRegex={urlRegex} onChange={handleChangeValue} error={error} />;
                        } else {
                            return null;
                        }
                    })}
                </Form>
            </MokaModal>
            <EditThumbModal show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

export default EditDeskingWorkModal;