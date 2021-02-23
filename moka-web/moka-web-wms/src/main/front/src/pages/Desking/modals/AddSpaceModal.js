import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getBulkChar, GET_BULK_CHAR } from '@store/codeMgt';
import { MokaImage, MokaInput, MokaInputLabel, MokaModal } from '@components';
import { postDeskingWork } from '@store/desking';
import { messageBox } from '@utils/toastUtil';
import TitleForm from './EditDeskingWorkModal/TitleForm';
import TextForm from './EditDeskingWorkModal/TextForm';
import mapping, { fontSizeObj } from '@pages/Desking/deskingPartMapping';

/**
 * 공백기사 추가
 */
const AddSpaceModal = (props) => {
    const { show, onHide, areaSeq, component, deskingPart } = props;
    const dispatch = useDispatch();
    const { IR_URL } = useSelector(({ app }) => app);
    const loading = useSelector(({ loading }) => loading[GET_BULK_CHAR]);
    const bulkCharRows = useSelector(({ codeMgt }) => codeMgt.bulkCharRows);
    const [temp, setTemp] = useState({}); // 공백기사 데이터
    const [irImg, setIrImg] = useState('');
    const [specialChar, setSpecialChar] = useState(''); // 약물
    const [fontListType, setFontListType] = useState(); // 제목의 폰트 타입

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setTemp({ ...temp, [name]: value });
    };

    /**
     * 저장
     */
    const handleSaveDeskingWork = () => {
        dispatch(
            postDeskingWork({
                areaSeq,
                componentWorkSeq: component.seq,
                datasetSeq: component.datasetSeq,
                deskingWork: {
                    ...temp,
                    contentOrd: 1,
                    contentType: 'D',
                },
                callback: ({ header }) => {
                    if (header.success) {
                        handleHide();
                    } else {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 닫기
     */
    const handleHide = () => {
        setTemp({});
        onHide();
    };

    useEffect(() => {
        if (IR_URL) {
            let irImg = temp.thumbFileName;
            // `${IR_URL}?t=k&w=216&h=150u=//${temp.thumbFileName}`
            setIrImg(irImg);
        }
    }, [IR_URL, temp.thumbFileName]);

    useEffect(() => {
        // 약물 데이터 로드
        if (show) {
            !bulkCharRows ? dispatch(getBulkChar()) : setSpecialChar(bulkCharRows.find((char) => char.dtlCd === 'bulkChar')?.cdNm);
        }
    }, [bulkCharRows, dispatch, show]);

    useEffect(() => {
        // deskingPart에 타이틀이 있을 때 => 폰트사이즈 찾아서 셋팅
        if (deskingPart.indexOf('TITLE') > -1) {
            const list = (deskingPart || '').split(',');
            const filtered = list.filter((part) => !fontSizeObj[part]);
            if (list.length !== filtered.length) {
                const fontPart = list.find((part) => fontSizeObj[part]);
                setFontListType(fontPart);
            } else {
                setFontListType(null);
            }
        } else {
            setFontListType(null);
        }
    }, [deskingPart]);

    useEffect(() => {
        return () => {
            setTemp({});
        };
    }, []);

    return (
        <MokaModal
            title="공백 기사"
            width={650}
            size="xl"
            show={show}
            onHide={handleHide}
            buttons={[
                { variant: 'positive', text: '저장', onClick: handleSaveDeskingWork },
                { variant: 'negative', text: '취소', onClick: handleHide },
            ]}
            footerClassName="d-flex justify-content-center"
            draggable
            loading={loading}
        >
            {/* 이미지 */}
            <Form.Row className="mb-2">
                <div className="d-flex">
                    <MokaInputLabel as="none" label="대표\n이미지" labelClassName="pr-3" className="mb-0" />
                    <MokaImage img={irImg} width={216} />
                </div>
                <div className="d-flex flex-column justify-content-end ml-2">
                    <Button variant="gray-700" size="sm" className="mb-2">
                        신규등록
                    </Button>
                    <Button variant="outline-gray-700" size="sm">
                        편집
                    </Button>
                </div>
            </Form.Row>

            {/* 약물 */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="약물" labelClassName="pr-3" className="mb-0 w-100" value={specialChar} inputProps={{ plaintext: true, readOnly: true }} />
            </Form.Row>

            {/* 제목 => 폰트사이즈 (편집영역에서 설정한 폰트타입 조회) */}
            <TitleForm show={show} fontListType={fontListType} onChange={handleChangeValue} temp={temp} mappingData={mapping['TITLE']} />

            {/* 리드문 */}
            <TextForm unescape mappingData={mapping['BODY_HEAD']} temp={temp} onChange={handleChangeValue} />

            {/* URL */}
            <TextForm mappingData={mapping['LINK_URL']} temp={temp} onChange={handleChangeValue} />
        </MokaModal>
    );
};

export default AddSpaceModal;
