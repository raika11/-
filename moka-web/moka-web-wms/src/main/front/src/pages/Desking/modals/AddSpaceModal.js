import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaImageInput, MokaInput, MokaInputLabel, MokaModal, MokaSearchInput } from '@components';
import { postDeskingWorkList } from '@store/desking';
import toast from '@utils/toastUtil';

const titlePrefixList = [{ type: '속보' }, { type: '단독' }];
const prefixLocationList = [{ type: '제목 앞' }, { type: '제목 뒤' }, { type: '부제 앞' }, { type: '부제 뒤' }, { type: '리드문 앞' }, { type: '리드문 뒤' }];
const titleLocationList = [{ type: '상단' }, { type: '하단' }];
const fontSizeList = [{ size: '36px' }, { size: '41px' }, { size: '45px' }, { size: '48px' }];

/**
 * 데스킹 기사정보 편집 모달 컴포넌트
 */
const AddSpaceModal = (props) => {
    const { show, onHide, data, componentAgGridInstances } = props;
    const dispatch = useDispatch();

    // 데스킹 정보
    const [thumbFileName, setThumbFileName] = useState('');
    const [title, setTitle] = useState('');
    const [bodyHead, setBodyHead] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [moreUrl, setMoreUrl] = useState('');

    /**
     * 타이틀 byte 계산
     * @param {String} text 타이틀
     */
    const euckrBytes = (text) => {
        const euckrLength = ((s, b = 0, i = 0, c = 0) => {
            // eslint-disable-next-line no-cond-assign
            for (i = 0; (c = s.charCodeAt(i++)); b += c >= 128 ? 2 : 1);
            return b;
        })(text);
        return euckrLength;
    };

    /**
     * modal의 항목 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        if (name === 'thumbFileName') {
            setThumbFileName(value);
        } else if (name === 'title') {
            setTitle(value);
            if (value !== title && name === 'titleLength') {
                euckrBytes(value);
            }
        } else if (name === 'bodyHead') {
            setBodyHead(value);
        } else if (name === 'linkUrl') {
            setLinkUrl(value);
        } else if (name === 'moreUrl') {
            setMoreUrl(value);
        }
    };

    /**
     * 저장
     */
    const handleSaveDeskingWork = () => {
        const option = {
            componentWorkSeq: data.seq,
            datasetSeq: data.datasetSeq,
            list: [
                {
                    contentOrd: componentAgGridInstances.length + 1,
                    thumbFileName,
                    title,
                    bodyHead,
                    linkUrl,
                    moreUrl,
                },
            ],
            callback: ({ header }) => {
                if (header.success) {
                    toast.success(header.message);
                } else {
                    toast.error(header.message);
                }
            },
        };
        dispatch(postDeskingWorkList(option));
        onHide();
    };

    return (
        <MokaModal
            titleAs={
                <div className="w-100 d-flex flex-column">
                    <div className="p-0 d-flex">
                        <p className="m-0">공백 추가</p>
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
            size="xl"
            show={show}
            onHide={onHide}
            buttons={[
                { variant: 'positive', text: '저장', onClick: handleSaveDeskingWork },
                { variant: 'negative', text: '취소', onClick: onHide },
                { variant: 'outline-neutral', text: '리로드' },
            ]}
            footerClassName="d-flex justify-content-center"
            draggable
        >
            <div className="d-flex justify-content-between">
                <div style={{ width: '150px' }}>
                    <MokaInputLabel
                        label="약물"
                        labelWidth={50}
                        labelClassName="d-flex justify-content-start"
                        name="subTitle"
                        value={`「」·“”※↑↓★●`}
                        inputProps={{ plaintext: true, readOnly: true }}
                    />
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
                    <MokaInputLabel label="어깨제목" labelWidth={80} inputClassName="ft-12" name="nameplate" inputProps={{ readOnly: true }} disabled />
                    <Form.Row>
                        <MokaInputLabel label="말머리" labelWidth={80} as="none" />
                        <Col xs={5} className="p-0 d-flex align-items-center justify-content-between">
                            <MokaInput className="mb-3 mr-2 ft-12" as="select" name="titlePrefix" inputProps={{ readOnly: true }} disabled>
                                {titlePrefixList.map((prefix, idx) => (
                                    <option key={idx} value={idx} className="ft-12">
                                        {prefix.type}
                                    </option>
                                ))}
                            </MokaInput>
                            <MokaInput className="mb-3 mr-2 ft-12" as="select" name="prefixLocation" inputProps={{ readOnly: true }} disabled>
                                {prefixLocationList.map((prefixLocation, idx) => (
                                    <option key={idx} value={idx} className="ft-12">
                                        {prefixLocation.type}
                                    </option>
                                ))}
                            </MokaInput>
                        </Col>
                        <div className="w-100">
                            <MokaInputLabel inputClassName="ft-12" label="제목/부제위치" labelWidth={90} as="select" name="titleLocation" inputProps={{ readOnly: true }} disabled>
                                {titleLocationList.map((titleLocation, idx) => (
                                    <option key={idx} value={idx} className="ft-12">
                                        {titleLocation.type}
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
                                        <MokaInput as="select" size="sm" name="fontSize" inputProps={{ readOnly: true }} disabled>
                                            {fontSizeList.map((font, idx) => (
                                                <option key={idx} value={font.size}>
                                                    {font.size}
                                                </option>
                                            ))}
                                        </MokaInput>
                                    </React.Fragment>
                                }
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
                            <div className="mb-3 pl-1 ft-12" name="titleLength" onChange={handleChangeValue}>
                                {euckrBytes(title)}byte
                            </div>
                        </Col>
                    </Form.Row>
                    <MokaInputLabel label="부제" labelWidth={80} inputClassName="ft-12" name="subTitle" inputProps={{ readOnly: true }} disabled />
                    <MokaInputLabel
                        label="리드문"
                        labelWidth={80}
                        inputClassName="ft-12"
                        name="bodyHead"
                        as="textarea"
                        inputProps={{ rows: 5 }}
                        value={bodyHead}
                        onChange={handleChangeValue}
                    />
                    <Form.Row className="d-flex align-items-center">
                        <Col xs={9} className="p-0">
                            <MokaInputLabel label="url" labelWidth={80} placeholder="url 입력해주세요" name="linkUrl" value={linkUrl} onChange={handleChangeValue} />
                        </Col>
                        <MokaInput className="mb-3 ml-2" as="select" />
                    </Form.Row>
                    <Form.Row className="d-flex align-items-center">
                        <MokaInputLabel label="영상" labelWidth={80} className="m-0" onChange={handleChangeValue} as="none" />
                        <div className="w-100">
                            <MokaSearchInput placeholder="url 입력해주세요" name="moreUrl" value={moreUrl} onChange={handleChangeValue} />
                        </div>
                    </Form.Row>
                </Form>
            </div>
        </MokaModal>
    );
};

export default AddSpaceModal;
