import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';
import { MokaModal } from '@components';

const propTypes = {
    /**
     * alt 이미지 alt
     */
    alt: PropTypes.string,
    /**
     * 썸네일 데이터
     */
    data: PropTypes.object,
};

const defaultProps = {
    alt: '이미지',
    data: {},
};

const ThumbViewModal = (props) => {
    const { show, onHide, data, alt } = props;
    const [display, setDisplay] = useState(true);

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            id="viewThumb"
            titleAs={
                <h4 className="m-0" style={{ color: 'white' }}>
                    {data.text}
                </h4>
            }
            size="lg"
            width={800}
            height={640}
            footer={
                <div
                    className="m-0 d-flex flex-column justify-content-between"
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        width: '800px',
                        height: '110px',
                        backgroundColor: 'rgba(55, 61, 83, 0.9)',
                        opacity: '0.8',
                        visibility: display ? 'visible' : 'hidden',
                    }}
                >
                    <p className="pt-3 ft-12 d-flex justify-content-center" style={{ color: 'white' }}>
                        {data.text}
                    </p>
                    <div className="pb-2 ft-12 d-flex align-items-center justify-content-around" style={{ color: 'white' }}>
                        <p className="m-0">NID : {data.nid}</p>
                        <p className="m-0">촬영자 : {data.regNm} 사진전문기자</p>
                        <p className="m-0">등록자 : {data.regNm} 사진전문기자</p>
                    </div>
                </div>
            }
            headerClassName="color-white"
            bodyClassName="p-0"
            footerClassName="m-0 border-top-0"
            bodyStyle={{ backgroundColor: '#272C3F' }}
            headerStyle={{ backgroundColor: '#373D53', height: '60px' }}
            footerStyle={{ backgroundColor: '#373D53', height: '40px' }}
            draggable
        >
            <div className="w-100 h-100" onClick={() => (display ? setDisplay(false) : setDisplay(true))}>
                {data.imageOnlnPath && <Image className="center-image" src={data.imageOnlnPath} alt={alt} />}
            </div>
        </MokaModal>
    );
};

ThumbViewModal.propTypes = propTypes;
ThumbViewModal.defaultProps = defaultProps;

export default ThumbViewModal;
