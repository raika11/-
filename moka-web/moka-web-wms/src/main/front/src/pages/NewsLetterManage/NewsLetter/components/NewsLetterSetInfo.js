import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';
import { EditThumbModal } from '@/pages/Desking/modals';
import NewsLetterLayoutModal from '../modals/NewsLetterLayoutModal';
import NewsLetterEditFormModal from '../modals/NewsLetterEditFormModal';

/**
 * 뉴스레터 편집 > 뉴스레터 설정
 */
const NewsLetterSetInfo = ({ temp, setTemp, onChangeValue }) => {
    const [layoutModal, setLayoutModal] = useState(false);
    const [editFormModal, setEditFormModal] = useState(false);
    const [imgModal, setImgModal] = useState(false);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        onChangeValue({ [name]: value });
    };

    /**
     * 파일 변경
     * @param {any} data 파일데이터
     */
    const handleFileValue = (data) => {
        if (data) {
            setTemp({ ...temp, thumbnailFile: data });
        } else {
            setTemp({ ...temp, headerImg: null, thumbnailFile: data });
        }
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        setTemp({ ...temp, headerImg: imageSrc, thumbnailFile: file });
    };

    return (
        <>
            {/* 뉴스레터 설정 */}
            <p className="mb-2">※ 뉴스레터 설정</p>
            <Form.Row className="mb-2 align-items-center">
                {temp.sendType === 'A' && (
                    <div className="flex-fill">
                        <MokaInputLabel
                            as="imageFile"
                            inputClassName="w-100"
                            label={
                                <React.Fragment>
                                    상단 이미지 선택
                                    <br />
                                    <Button variant="gray-700" size="sm" className="mt-2" onClick={() => setImgModal(true)}>
                                        신규등록
                                    </Button>
                                </React.Fragment>
                            }
                            inputProps={{ img: temp.headerImg, setFileValue: handleFileValue, height: 80, deleteButton: true, accept: 'image/jpeg, image/png' }}
                        />
                        <div className="d-flex align-items-center">
                            <MokaInputLabel as="none" label=" " />
                            <p className="mb-0 color-primary">※ 변경하지 않을 경우 기본 이미지가 적용됩니다.</p>
                        </div>
                    </div>
                )}
                {temp.sendType === 'E' && (
                    <>
                        <MokaInputLabel as="none" label="형식 구분" />
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput
                                as="radio"
                                name="editLetterType"
                                value="L"
                                id="letter-editLetterType-l"
                                inputProps={{ label: '레이아웃 선택', custom: true, checked: temp.editLetterType === 'L' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput
                                as="radio"
                                name="editLetterType"
                                value="F"
                                id="letter-editLetterType-f"
                                inputProps={{ label: '직접 등록', custom: true, checked: temp.editLetterType === 'F' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                    </>
                )}
            </Form.Row>
            <Form.Row className="mb-2 align-items-center">
                {temp.editLetterType !== 'D' && (
                    <>
                        <MokaInputLabel as="none" label="레이아웃 선택" />
                        <div className="flex-fill">
                            <div className="d-flex align-items-center">
                                <MokaSearchInput
                                    placeholder="레이아웃을 검색해 주세요"
                                    className="flex-fill"
                                    onSearch={() => setLayoutModal(true)}
                                    inputProps={{ readOnly: true }}
                                />
                                <NewsLetterLayoutModal show={layoutModal} onHide={() => setLayoutModal(false)} />
                            </div>
                            <p className="mb-0 color-primary">※ 레이아웃이 미정인 경우 상품은 자동 임시저장 상태 값으로 지정됩니다.</p>
                        </div>
                    </>
                )}
                {temp.sendType === 'E' && temp.editLetterType === 'D' && (
                    <>
                        <MokaInputLabel
                            as="imageFile"
                            className="mr-2"
                            label={
                                <React.Fragment>
                                    상단 이미지 선택
                                    <br />
                                    <Button variant="gray-700" size="sm" className="mt-2" onClick={() => setImgModal(true)}>
                                        신규등록
                                    </Button>
                                </React.Fragment>
                            }
                            inputProps={{ img: temp.headerImg, setFileValue: handleFileValue, width: 190, deleteButton: true, accept: 'image/jpeg, image/png' }}
                        />

                        <p className="mb-0 color-primary">※ 변경하지 않을 경우 기본 이미지가 적용됩니다.</p>
                    </>
                )}
            </Form.Row>
            {temp.sendType === 'E' && temp.editLetterType === 'L' && (
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label="편집 폼 선택" />
                    <MokaSearchInput placeholder="편집 폼을 검색해 주세요" className="flex-fill" onSearch={() => setEditFormModal(true)} inputProps={{ readOnly: true }} />
                    <NewsLetterEditFormModal show={editFormModal} onHide={() => setEditFormModal(false)} />
                </Form.Row>
            )}
            <Form.Row className="align-items-center">
                <MokaInputLabel as="none" label="제목" />
                {temp.sendType === 'A' && (
                    <>
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput name="letterTitle" value={temp.letterTitle} onChange={handleChangeValue} disabled={temp.titleType !== 'E'} />
                        </Col>
                        <MokaInput
                            as="radio"
                            className="mr-2"
                            name="titleType"
                            value="A"
                            id="letter-titleType-a"
                            inputProps={{ label: '광고', custom: true, checked: temp.titleType === 'A' }}
                            onChange={handleChangeValue}
                        />
                        <MokaInput
                            as="radio"
                            className="mr-2"
                            name="titleType"
                            value="N"
                            id="letter-titleType-n"
                            inputProps={{ label: '뉴스레터 명', custom: true, checked: temp.titleType === 'N' }}
                            onChange={handleChangeValue}
                        />
                        <MokaInput
                            as="radio"
                            className="mr-2"
                            name="titleType"
                            value="E"
                            id="letter-titleType-e"
                            inputProps={{ label: '직접 입력', custom: true, checked: temp.titleType === 'E' }}
                            onChange={handleChangeValue}
                        />
                        <MokaInput
                            as="checkbox"
                            name="titleType"
                            value="T"
                            id="letter-titleType-t"
                            inputProps={{ label: '기사 제목', custom: true, checked: temp.titleType === 'E' ? true : false }}
                            onChange={handleChangeValue}
                            disabled
                        />
                    </>
                )}
                {temp.sendType === 'E' && <MokaInput className="flex-fill" value={temp.letterTitle} onChange={handleChangeValue} />}
            </Form.Row>

            {/* 포토 아카이브 모달 */}
            <EditThumbModal show={imgModal} cropWidth={290} cropHeight={180} onHide={() => setImgModal(false)} thumbFileName={temp.headerImg} apply={handleThumbFileApply} />
        </>
    );
};

export default NewsLetterSetInfo;
