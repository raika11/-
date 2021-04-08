import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import gifshot from 'gifshot';
import { MokaModal, MokaInputLabel, MokaInput, MokaLoader, MokaImage } from '@components';
import commonUtil from '@utils/commonUtil';
import toast from '@utils/toastUtil';

const propTypes = {
    /**
     * 저장 함수
     * @default
     */
    onSave: PropTypes.func,
    /**
     * gif로 만들어질 이미지 리스트
     * @default
     */
    imgList: PropTypes.array,
    /**
     * gif의 Width
     */
    gifWidth: PropTypes.number,
    /**
     * gif의 Height
     */
    gifHeight: PropTypes.number,
};
const defaultProps = {
    onSave: () => {},
    imgList: [],
};
const defaultOptions = {
    interval: 0.5,
    sizeType: 'self',
    edWidth: 300, // 수정가능한 너비
    edHeight: 300, //  수정가능한 높이
    gifWidth: 300,
    gifHeight: 300,
};

/**
 * GIF 생성 모달
 */
const MakeGifModal = (props) => {
    const { show, onHide, onSave, imgList, gifWidth, gifHeight } = props;
    const [gifImage, setGifImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gifOptions, setGifOptions] = useState(defaultOptions);

    /**
     * gif 생성
     */
    const makeGif = useCallback(() => {
        if (imgList.length > 0 && gifOptions.gifWidth && gifOptions.gifHeight) {
            setLoading(true);

            gifshot.createGIF(
                {
                    images: imgList,
                    crossOrigin: 'Anonymous',
                    ...gifOptions,
                },
                function (obj) {
                    if (!obj.error) {
                        const blob = commonUtil.base64ToBlob(obj.image);
                        const gifImage = URL.createObjectURL(blob);
                        setGifImage(gifImage);
                    } else {
                        toast.error('GIF 이미지를 생성하지 못했습니다.');
                    }
                    setLoading(false);
                },
            );
        }
    }, [gifOptions, imgList]);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'sizeType') {
            if (value === 'self') {
                setGifOptions({ ...gifOptions, [name]: value, gifWidth: gifOptions.edWidth, gifHeight: gifOptions.edHeight });
            } else {
                const { width, height } = e.target.dataset;
                setGifOptions({ ...gifOptions, [name]: value, gifWidth: Number(width), gifHeight: Number(height) });
            }
        } else {
            setGifOptions({ ...gifOptions, [name]: value });
        }
    };

    /**
     * 저장
     */
    const handleSave = () => {
        onSave(gifImage);
        onHide();
    };

    useEffect(() => {
        setGifOptions({
            ...gifOptions,
            gifWidth: gifWidth > 0 ? gifWidth : gifOptions.gifWidth,
            gifHeight: gifHeight > 0 ? gifWidth : gifOptions.gifHeight,
            edWidth: gifWidth > 0 ? gifWidth : gifOptions.edWidth,
            edHeight: gifHeight > 0 ? gifHeight : gifOptions.edHeight,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gifWidth, gifHeight]);

    useEffect(() => {
        if (show) makeGif();
    }, [show, makeGif]);

    useEffect(() => {
        return () => {
            setLoading(false);
            setGifImage(null);
            setGifOptions(defaultOptions);
        };
    }, []);

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            title="GIF 만들기"
            size="md"
            width={600}
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleSave },
                { text: '취소', variant: 'negative', onClick: onHide },
            ]}
            centered
        >
            <div className="d-flex">
                <Col md={8} className="p-0 position-relative pr-3">
                    {loading && <MokaLoader />}
                    <MokaImage img={gifImage} className="w-100 h-100" alt="미리보기" />
                </Col>
                <Col md={4} className="p-0 pl-1">
                    {/* 간격 설정 */}
                    <div className="mb-3 d-flex">
                        <MokaInputLabel name="interval" label="간격" value={gifOptions.interval} onChange={handleChangeValue} />
                        <p className="mb-0 ml-1 flex-shrink-0 d-flex align-items-center">sec</p>
                    </div>

                    {/* 이미지 사이즈 설정 */}
                    <p className="h4 mb-14">GIF 이미지 사이즈</p>
                    <div className="mb-2 d-flex">
                        <MokaInput
                            as="radio"
                            value="self"
                            inputProps={{ checked: gifOptions.sizeType === 'self', custom: true, label: ' ', style: { marginTop: '-18px' } }}
                            id="size_self"
                            onChange={handleChangeValue}
                            name="sizeType"
                        />
                        <MokaInput name="edWidth" value={gifOptions.edWidth} onChange={handleChangeValue} className="mr-1" />
                        <span>*</span>
                        <MokaInput name="edHeight" value={gifOptions.edHeight} onChange={handleChangeValue} className="ml-1" />
                    </div>
                    <MokaInput
                        as="radio"
                        value="lg"
                        id="size_lg"
                        inputProps={{ checked: gifOptions.sizeType === 'lg', label: '대(600*450)', 'data-width': 600, 'data-height': 450, custom: true }}
                        onChange={handleChangeValue}
                        name="sizeType"
                        className="mb-2"
                    />
                    <MokaInput
                        as="radio"
                        value="md"
                        id="size_md"
                        inputProps={{ checked: gifOptions.sizeType === 'md', label: '중(500*300)', 'data-width': 500, 'data-height': 300, custom: true }}
                        onChange={handleChangeValue}
                        name="sizeType"
                        className="mb-2"
                    />
                    <MokaInput
                        as="radio"
                        value="sm"
                        id="size_sm"
                        inputProps={{ checked: gifOptions.sizeType === 'sm', label: '소(130*90)', 'data-width': 130, 'data-height': 90, custom: true }}
                        onChange={handleChangeValue}
                        name="sizeType"
                    />
                </Col>
            </div>
        </MokaModal>
    );
};

MakeGifModal.propTypes = propTypes;
MakeGifModal.defaultProps = defaultProps;

export default MakeGifModal;
