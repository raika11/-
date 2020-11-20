import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaImageInput, MokaInput, MokaInputLabel, MokaModal, MokaSearchInput } from '@components';
import toast from '@utils/toastUtil';

/**
 * 데스킹 기사정보 편집 모달 컴포넌트
 */
const DeskingWorkEditModal = (props) => {
    const { show, onHide, data, onSave } = props;

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

    const handleSaveDeskingWork = () => {
        const deskingWork = {
            ...data,
            thumbFileName,
            title,
            nameplate,
            titlePrefix,
            subtitle,
            bodyHead,
        };
        const callback = (response) => {
            if (response.header) {
                toast.success(response.header.message);
            } else {
                toast.warn(response.header.message);
            }
        };
        onSave(deskingWork, callback);
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
                { variant: 'positive', text: '저장', onClick: handleSaveDeskingWork },
                { variant: 'negative', text: '취소', onClick: onHide },
                { variant: 'outline-neutral', text: '리로드' },
            ]}
            footerClassName="d-flex justify-content-center"
        >
            <div className="d-flex justify-content-between">
                <div style={{ width: '150px' }}>
                    <div className="mb-5">약물 「」·“”※↑↓★●</div>
                    <div>
                        <MokaImageInput width={150} height={150} img={thumbFileName} alt="기사 사진" name="thumbFileName" />
                        <div className="mt-2 px-1 d-flex justify-content-between">
                            <Button variant="outline-neutral" size="sm">
                                편집
                            </Button>
                            <Button variant="outline-neutral" size="sm">
                                대표사진변경
                            </Button>
                        </div>
                    </div>
                </div>
                <Form style={{ width: '453px' }}>
                    <MokaInputLabel label="어깨제목" inputClassName="ft-12" name="nameplate" value={nameplate} onChange={handleChangeValue} />
                    <Form.Row>
                        <MokaInputLabel label="말머리" as="none" />
                        <Col xs={4} className="p-0 d-flex align-items-center justify-content-between">
                            <MokaInput className="mb-3 mr-2" as="select" name="titlePrefix" value={titlePrefix} onChange={handleChangeValue} />
                            <MokaInput className="mb-3" as="select" />
                        </Col>
                        <div className="w-100">
                            <MokaInputLabel
                                label="제목/부제위치"
                                labelWidth={100}
                                as="select"
                                // name=""
                                // value={}
                                // onChange={handleChangeValue}
                            />
                        </div>
                    </Form.Row>
                    <Form.Row>
                        <Col xs={11} className="p-0">
                            <MokaInputLabel
                                label={
                                    <React.Fragment>
                                        Web제목 <br />
                                        <MokaInput as="select" size="sm" />
                                    </React.Fragment>
                                }
                                inputClassName="ft-12"
                                name="title"
                                value={title}
                                as="textarea"
                                inputProps={{ rows: 3 }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <Col xs={1} className="p-0 d-flex align-items-end">
                            <div className="mb-3 ft-12">42byte</div>
                        </Col>
                    </Form.Row>
                    <MokaInputLabel label="부제" inputClassName="ft-12" name="subtitle" value={subtitle} onChange={handleChangeValue} />
                    <MokaInputLabel label="리드문" inputClassName="ft-12" name="bodyHead" as="textarea" inputProps={{ rows: 5 }} value={bodyHead} onChange={handleChangeValue} />
                    <Form.Row className="d-flex align-items-center">
                        <MokaInputLabel label="영상" className="m-0" onChange={handleChangeValue} as="none" />
                        <div className="w-100">
                            <MokaSearchInput placeholder="url 입력해주세요" />
                        </div>
                    </Form.Row>
                </Form>
            </div>
        </MokaModal>
    );
};

export default DeskingWorkEditModal;
