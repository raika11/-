import React, { useRef, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'react-bootstrap/Dropdown';
import BSImage from 'react-bootstrap/Image';

import { MokaIcon } from '@components';
import bg from '@assets/images/bg.jpeg';

const propTypes = {
    /**
     * width
     */
    width: PropTypes.number,
    /**
     * height
     */
    height: PropTypes.number,
    /**
     * templateName
     */
    templateName: PropTypes.string,
    /**
     * img
     */
    img: PropTypes.string,
    /**
     * alt
     */
    alt: PropTypes.string,
    /**
     * alt
     */
    templateGroup: PropTypes.string,
    /**
     * alt
     */
    templateWidth: PropTypes.number,
};

const defaultProps = {};

const MokaTemplateThumbCard = forwardRef((props, ref) => {
    const { width, height, templateName, img, alt, templateGroup, templateWidth } = props;
    const imgRef = useRef(null);

    useEffect(() => {
        if (imgRef.current !== null) {
            let image = new Image();
            image.src = imgRef.current.src;
            image.onload = (imgProps) => {
                let w = imgProps.path[0].width;
                let h = imgProps.path[0].height;
                let rate = width / height;
                if (w / h > rate) {
                    imgRef.current.className = 'landscape';
                } else {
                    imgRef.current.className = 'portrait';
                }
                imgRef.current.style.visibility = 'visible';
            };
        }
    }, [height, width]);

    const IconToggle = forwardRef(({ children, onClick }, ref) => (
        <a
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
            <MokaIcon iconName="fal-ellipsis-v" />
        </a>
    ));

    const IconMenu = forwardRef(({ children, style, className }, ref) => {
        return (
            <div ref={ref} style={style} className={className}>
                <ul className="list-unstyled">{children}</ul>
            </div>
        );
    });

    const IconDropButton = () => (
        <Dropdown>
            <Dropdown.Toggle as={IconToggle} />
            <Dropdown.Menu as={IconMenu}>
                <Dropdown.Item eventKey="1">복사본 생성</Dropdown.Item>
                <Dropdown.Item eventKey="2">삭제</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );

    return (
        <div ref={ref} className="p-03" style={{ width: width }}>
            <div className="border rounded">
                <div className="d-flex justify-content-between p-03">
                    <p className="pt-05 pl-05 mb-0">{templateName}</p>
                    <IconDropButton />
                </div>
                <div style={{ height: height }}>
                    {img && <BSImage src={bg} alt={alt || '썸네일이미지'} ref={imgRef} className="hidden" />}
                    {!img && <div style={{ backgroundColor: '#e5e5e5' }} />}
                </div>
                <div className="d-flex justify-content-between p-03">
                    <p className="pt-0 pl-05 mb-0">{templateGroup}</p>
                    <p className="pt-0 pr-05 mb-0">{templateWidth}</p>
                </div>
            </div>
        </div>
    );
});

MokaTemplateThumbCard.propTypes = propTypes;
MokaTemplateThumbCard.defaultProps = defaultProps;

export default MokaTemplateThumbCard;
