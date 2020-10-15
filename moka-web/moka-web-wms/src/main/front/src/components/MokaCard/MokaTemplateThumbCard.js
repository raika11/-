import React, { useRef, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'react-bootstrap/Dropdown';
import BSImage from 'react-bootstrap/Image';

import { MokaIcon } from '@components';
import bg from '@assets/images/bg.jpeg';

const propTypes = {
    /**
     * showModal 썸네일 카드 onClick 이벤트
     */
    showModal: PropTypes.func,
    /**
     * width 컴포넌트의 가로 사이즈
     */
    width: PropTypes.number,
    /**
     * height 이미지의 세로 사이즈
     */
    height: PropTypes.number,
    /**
     * templateName 템플릿 이름
     */
    templateName: PropTypes.string,
    /**
     * img 이미지 경로
     */
    img: PropTypes.string,
    /**
     * alt 이미지 alt
     */
    alt: PropTypes.string,
    /**
     * templateGroup 템플릿 그룹
     */
    templateGroup: PropTypes.string,
    /**
     * templateWidth 템플릿 가로 사이즈
     */
    templateWidth: PropTypes.number,
};

const defaultProps = {};

const MokaTemplateThumbCard = forwardRef((props, ref) => {
    const { showModal, menus, width, height, templateName, img, alt, templateGroup, templateWidth } = props;
    const imgRef = useRef(null);

    // 이미지 landscape, portrait 설정
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

    // 커스텀 토글 버튼 아이콘
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

    // 토글 아이콘 스타일
    const IconMenu = forwardRef(({ children, style, className }, ref) => {
        return (
            <div ref={ref} style={style} className={className}>
                <ul className="list-unstyled">{children}</ul>
            </div>
        );
    });

    // 아이콘 드롭 버튼
    const IconDropButton = () => (
        <Dropdown>
            <Dropdown.Toggle as={IconToggle} />
            <Dropdown.Menu as={IconMenu}>
                {menus.map((menu, idx) => (
                    <Dropdown.Item
                        key={idx}
                        eventKey={idx}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (typeof menu.onClick === 'function') {
                                menu.onClick(menu, e);
                            }
                        }}
                    >
                        {menu.title}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );

    return (
        <div ref={ref} className="p-03" style={{ width: width }} onClick={showModal}>
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
