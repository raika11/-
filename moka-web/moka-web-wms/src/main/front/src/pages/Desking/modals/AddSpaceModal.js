import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaImageInput, MokaInput, MokaInputLabel, MokaModal } from '@components';
import util from '@utils/commonUtil';

import { postDeskingWork } from '@store/desking';
import toast from '@utils/toastUtil';

const linkTargetList = [
    { id: 'S', name: '본창' },
    { id: 'N', name: '새창' },
];

/**
 * 공백기사 컴포넌트
 */
const AddSpaceModal = (props) => {
    const { show, onHide, areaSeq, component } = props;
    const dispatch = useDispatch();

    // 데스킹 정보
    const [thumbFileName, setThumbFileName] = useState('');
    const [title, setTitle] = useState('');
    const [bodyHead, setBodyHead] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkTarget, setLinkTarget] = useState('');

    /**
     * modal의 항목 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        if (name === 'thumbFileName') {
            setThumbFileName(value);
        } else if (name === 'title') {
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
        >
            <div className="d-flex justify-content-between">
                <div style={{ width: '150px' }}>
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
                <Form style={{ width: '453px' }}>
                    <Form.Row>
                        <div className="w-100 p-0">
                            <MokaInputLabel
                                label="제목"
                                labelWidth={80}
                                inputClassName="ft-12"
                                name="title"
                                value={title}
                                as="textarea"
                                inputProps={{ rows: 3 }}
                                onChange={handleChangeValue}
                            />
                        </div>
                        <Col xs={1} className="w-100 p-0 d-flex align-items-end">
                            <div className="mb-3 pl-1 ft-12">{util.euckrBytes(title)}byte</div>
                        </Col>
                    </Form.Row>
                    <MokaInputLabel
                        label="리드문"
                        labelWidth={80}
                        inputClassName="ft-12"
                        name="bodyHead"
                        as="textarea"
                        inputProps={{ rows: 3 }}
                        value={bodyHead}
                        onChange={handleChangeValue}
                    />
                    <Form.Row className="d-flex align-items-center">
                        <Col xs={9} className="p-0">
                            <MokaInputLabel label="url" labelWidth={80} placeholder="url 입력해주세요" name="linkUrl" value={linkUrl} onChange={handleChangeValue} />
                        </Col>
                        <MokaInput className="mb-3 ml-2" as="select" name="linkTarget" value={linkTarget} onChange={handleChangeValue}>
                            {linkTargetList.map((target) => (
                                <option key={target.id} value={target.id} className="ft-12">
                                    {target.name}
                                </option>
                            ))}
                        </MokaInput>
                    </Form.Row>
                </Form>
            </div>
        </MokaModal>
    );
};

export default AddSpaceModal;
