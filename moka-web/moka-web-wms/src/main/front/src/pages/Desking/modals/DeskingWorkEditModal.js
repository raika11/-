import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaImageInput, MokaInput, MokaInputLabel, MokaModal, MokaSearchInput } from '@components';

/**
 * 데스킹 기사정보 편집 모달 컴포넌트
 */
const DeskingWorkEditModal = (props) => {
    const { show, onHide, data } = props;

    // 데스킹 정보
    const [thumbFileName, setThumbFileName] = useState('');
    const [title, setTitle] = useState('');
    const [nameplate, setNameplate] = useState('');
    const [titlePrefix, setTitlePrefix] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [bodyHead, setBodyHead] = useState('');

    React.useEffect(() => {
        // 기사 data 셋팅
        if (data) {
            setThumbFileName(data.thumbFileName || '');
            setTitle(data.title || '');
            setNameplate(data.nameplate || '');
            setTitlePrefix(data.titlePrefix || '');
            setSubtitle(data.subtitle || '');
            setBodyHead(data.bodyHead || '');
        }
    }, [data]);

    /**
     * modal의 항목 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        if (name === 'thumbFileName') {
            setThumbFileName(value);
        } else if (name === 'title') {
            setTitle(value);
        } else if (name === 'nameplate') {
            setNameplate(value);
        } else if (name === 'titlePrefix') {
            setTitlePrefix(value);
        } else if (name === 'subTitle') {
            setSubtitle(value);
        } else if (name === 'bodyHead') {
            setBodyHead(value);
        }
    };

    return (
        <MokaModal
            titleAs={
                <div className="w-100 d-flex flex-column">
                    <div className="p-0 d-flex">
                        <p className="m-0">{data.contentOrd}</p>
                        <p className="m-0">{title}</p>
                    </div>
                    <div className="p-0 d-flex ft-12">
                        <p className="m-0 mr-3">ID: {data.totalId}</p>
                        <p className="m-0">
                            (cp{data.componentSeq} {data.componentName})
                        </p>
                    </div>
                </div>
            }
            width={650}
            size="lg"
            show={show}
            onHide={onHide}
            buttons={[
                { variant: 'positive', text: '저장' },
                { variant: 'negative', text: '취소' },
                { variant: 'outline-neutral', text: '리로드' },
            ]}
        >
            <Container fluid>
                <Row>
                    <Col xs={4}>
                        <div className="mb-5">약물 「」·“”※↑↓★●</div>
                        <div>
                            <MokaImageInput width={175} img={thumbFileName} alt="기사 사진" name="thumbFileName" />
                            <div className="mt-2 px-1 d-flex justify-content-between">
                                <Button variant="outline-neutral">편집</Button>
                                <Button variant="outline-neutral">대표사진변경</Button>
                            </div>
                        </div>
                    </Col>
                    <Col xs={8}>
                        <Form>
                            <MokaInputLabel label="어깨제목" inputClassName="ft-12" name="nameplate" value={nameplate} onChange={handleChangeValue} />
                            <Form.Row>
                                <Col>
                                    <MokaInputLabel label="말머리" inputClassName="ft-12" name="titlePrefix" value={titlePrefix} onChange={handleChangeValue} />
                                    <MokaInput />
                                </Col>
                                <Col>
                                    <MokaInputLabel
                                        label="제목/부제위치"
                                        inputClassName="ft-12"
                                        // name=""
                                        // value={}
                                        // onChange={handleChangeValue}
                                    />
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col>
                                    <MokaInputLabel
                                        label={
                                            <React.Fragment>
                                                Web제목 <br />
                                                <MokaInput />
                                            </React.Fragment>
                                        }
                                        inputClassName="ft-12"
                                        name="title"
                                        value={title}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                                <Col>
                                    <div>42byte</div>
                                </Col>
                            </Form.Row>
                            <MokaInputLabel label="부제" inputClassName="ft-12" name="subtitle" value={subtitle} onChange={handleChangeValue} />
                            <MokaInputLabel label="리드문" inputClassName="ft-12" name="bodyHead" value={bodyHead} onChange={handleChangeValue} />
                            <Form.Row>
                                <MokaInputLabel label="영상" onChange={handleChangeValue} as="none" />
                                <MokaSearchInput placeholder="url 입력해주세요" />
                            </Form.Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </MokaModal>
    );
};

export default DeskingWorkEditModal;
