import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaImage, MokaInput, MokaInputLabel, MokaModal } from '@components';
import { postDeskingWork } from '@store/desking';
import util from '@utils/commonUtil';
import toast from '@utils/toastUtil';

/**
 * 공백기사 컴포넌트
 */
const AddSpaceModal = (props) => {
    const { show, onHide, areaSeq, component } = props;
    const dispatch = useDispatch();

    const { IR_URL } = useSelector((store) => ({
        IR_URL: store.app.IR_URL,
    }));

    // 데스킹 정보
    const [thumbFileName, setThumbFileName] = useState('');
    const [irImg, setIrImg] = useState('');
    const [title, setTitle] = useState('');
    const [bodyHead, setBodyHead] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkTarget, setLinkTarget] = useState('');

    /**
     * modal의 항목 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        if (name === 'title') {
            setTitle(value);
        } else if (name === 'bodyHead') {
            setBodyHead(value);
        } else if (name === 'linkUrl') {
            setLinkUrl(value);
        } else if (name === 'linkTarget') {
            setLinkTarget(value);
        }
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
                    contentOrd: 1,
                    contentType: 'D',
                    thumbFileName,
                    title,
                    bodyHead,
                    linkUrl,
                    linkTarget,
                },
                callback: ({ header }) => {
                    if (header.success) {
                        handleHide();
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 닫기
     */
    const handleHide = () => {
        setThumbFileName('');
        setTitle('');
        setBodyHead('');
        setLinkUrl('');
        setLinkTarget('');
        onHide();
    };

    useEffect(() => {
        if (IR_URL) {
            setIrImg(`${IR_URL}?t=k&w=216&h=150u=//${thumbFileName}`);
        }
    }, [IR_URL, thumbFileName]);

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
            centered
        >
            <Container fluid>
                <Row>
                    <Col md={4} className="p-0 mb-2 pr-2">
                        <MokaImage img={irImg} className="w-100" height={150} />
                        <div className="d-flex mt-2 justify-content-between">
                            <Button variant="positive" size="sm">
                                대표사진변경
                            </Button>
                            <Button variant="outline-neutral" size="sm">
                                편집
                            </Button>
                        </div>
                    </Col>
                    <Col md={8} className="p-0">
                        <Form>
                            <Form.Row className="mb-2">
                                <Col xs={10} className="p-0">
                                    <MokaInputLabel
                                        label="제목"
                                        labelWidth={56}
                                        labelClassName="mr-3"
                                        inputClassName="resize-none custom-scroll"
                                        className="mb-0"
                                        name="title"
                                        value={title}
                                        as="textarea"
                                        inputProps={{ rows: 3 }}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                                <Col xs={2} className="p-0 pl-1 ft-12 d-flex align-items-end flex-nowrap text-break">
                                    {util.euckrBytes(title)}byte
                                </Col>
                            </Form.Row>
                            <Form.Row className="mb-2">
                                <Col xs={12} className="p-0">
                                    <MokaInputLabel
                                        label="리드문"
                                        labelWidth={60}
                                        labelClassName="pr-3"
                                        inputClassName="resize-none custom-scroll"
                                        className="mb-0"
                                        name="bodyHead"
                                        as="textarea"
                                        inputProps={{ rows: 3 }}
                                        value={bodyHead}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col xs={10} className="p-0 pr-2">
                                    <MokaInputLabel
                                        label="URL"
                                        labelWidth={60}
                                        labelClassName="pr-3"
                                        className="mb-0"
                                        placeholder="URL을 입력하세요"
                                        name="linkUrl"
                                        value={linkUrl}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                                <Col xs={2} className="p-0">
                                    <MokaInput as="select" name="linkTarget" value={linkTarget || '_self'} onChange={handleChangeValue} className="ft-12">
                                        <option value="_self">본창</option>
                                        <option value="_blank">새창</option>
                                    </MokaInput>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </MokaModal>
    );
};

export default AddSpaceModal;
