import React, { useRef, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'react-bootstrap/Dropdown';
import BSImage from 'react-bootstrap/Image';

import { MokaIcon } from '@components';
import bg from '@assets/images/bg.jpeg';

const propTypes = {
    /**
     * onClick 썸네일 카드 onClick 이벤트
     */
    onClick: PropTypes.func,
    /**
     * width 컴포넌트의 가로 사이즈
     */
    width: PropTypes.number,
    /**
     * height 이미지의 세로 사이즈
     */
    height: PropTypes.number,
    /**
     * img 이미지 경로
     */
    img: PropTypes.string,
    /**
     * alt 이미지 alt
     */
    alt: PropTypes.string,
    data: PropTypes.shape({
        /**
         * templateName 템플릿 이름
         */
        templateName: PropTypes.string,
        /**
         * templateGroup 템플릿 그룹
         */
        templateGroup: PropTypes.string,
        /**
         * templateWidth 템플릿 가로 사이즈
         */
        templateWidth: PropTypes.string,
    }),
};

const defaultProps = {
    img: bg,
    alt: '썸네일이미지',
    data: {
        templateName: '',
        templateGroup: '',
        templateWidth: '',
    },
};

const MokaTemplateThumbCard = forwardRef((props, ref) => {
    const { onClick, menus, width, height, data, img, alt } = props;
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
        <div
            ref={ref}
            className="p-03"
            style={{ width: width }}
            onClick={(e) => {
                onClick(data, e);
            }}
        >
            <div className="border rounded">
                <div className="d-flex justify-content-between p-03">
                    <p className="pt-05 pl-05 mb-0">{data.templateName}</p>
                    <IconDropButton />
                </div>
                <div style={{ height: height }}>
                    {img && <BSImage src={bg} alt={alt} ref={imgRef} className="hidden" />}
                    {!img && <div style={{ backgroundColor: '#e5e5e5' }} />}
                </div>
                <div className="d-flex justify-content-between p-03">
                    <p className="pt-0 pl-05 mb-0">{data.templateGroup}</p>
                    <p className="pt-0 pr-05 mb-0">{data.templateWidth}</p>
                </div>
            </div>
        </div>
    );
});

MokaTemplateThumbCard.propTypes = propTypes;
MokaTemplateThumbCard.defaultProps = defaultProps;

export default MokaTemplateThumbCard;
