import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getBulkChar, GET_BULK_CHAR } from '@store/codeMgt';
import { MokaImage, MokaInput, MokaInputLabel, MokaModal } from '@components';
import { postDeskingWork } from '@store/desking';
import util from '@utils/commonUtil';
import { messageBox } from '@utils/toastUtil';

/**
 * 공백기사 컴포넌트
 */
const AddSpaceModal = (props) => {
    const { show, onHide, areaSeq, component } = props;
    const dispatch = useDispatch();
    const { IR_URL } = useSelector(({ app }) => app);
    const loading = useSelector(({ loading }) => loading[GET_BULK_CHAR]);
    const bulkCharRows = useSelector(({ codeMgt }) => codeMgt.bulkCharRows);
    const [temp, setTemp] = useState({}); // 공백기사 데이터
    const [irImg, setIrImg] = useState('');
    const [specialChar, setSpecialChar] = useState(''); // 약물

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
            setIrImg(`${IR_URL}?t=k&w=216&h=150u=//${temp.thumbFileName}`);
        }
    }, [IR_URL, temp.thumbFileName]);

    useEffect(() => {
        // 기타코드 로드
        if (show) {
            !bulkCharRows ? dispatch(getBulkChar()) : setSpecialChar(bulkCharRows.find((char) => char.dtlCd === 'bulkChar').cdNm);
        }
    }, [bulkCharRows, dispatch, show]);

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
            centered
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

            {/* 제목 */}
            <Form.Row className="mb-2">
                <Col xs={10} className="p-0">
                    <MokaInputLabel
                        label="제목"
                        inputClassName="resize-none custom-scroll"
                        name="title"
                        value={temp.title}
                        as="textarea"
                        inputProps={{ rows: 3 }}
                        onChange={handleChangeValue}
                    />
                </Col>
                <Col xs={2} className="p-0 pl-1 ft-12 d-flex align-items-end flex-nowrap text-break">
                    {util.euckrBytes(temp.title)}byte
                </Col>
            </Form.Row>

            {/* 리드문 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    label="리드문"
                    className="flex-fill"
                    inputClassName="resize-none custom-scroll"
                    name="bodyHead"
                    as="textarea"
                    inputProps={{ rows: 3 }}
                    value={temp.bodyHead}
                    onChange={handleChangeValue}
                />
            </Form.Row>

            {/* URL */}
            <Form.Row>
                <Col xs={10} className="p-0 pr-2">
                    <MokaInputLabel label="URL" placeholder="URL을 입력하세요" name="linkUrl" value={temp.linkUrl} onChange={handleChangeValue} />
                </Col>
                <Col xs={2} className="p-0">
                    <MokaInput as="select" name="linkTarget" value={temp.linkTarget || '_self'} onChange={handleChangeValue}>
                        <option value="_self">본창</option>
                        <option value="_blank">새창</option>
                    </MokaInput>
                </Col>
            </Form.Row>
        </MokaModal>
    );
};

export default AddSpaceModal;
