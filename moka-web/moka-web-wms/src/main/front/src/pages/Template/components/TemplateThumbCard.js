import React, { useRef, forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import BSImage from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { MokaIcon } from '@components';

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
     * @default
     */
    alt: PropTypes.string,
    /**
     * 템플릿 데이터
     * @default
     */
    data: PropTypes.shape({
        templateName: PropTypes.string,
        templateGroup: PropTypes.string,
        templateWidth: PropTypes.number,
    }),
    /**
     * 오른쪽 드롭다운 메뉴에 리스트 객체
     * @default
     */
    menus: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            onClick: PropTypes.func,
        }),
    ),
    /**
     * 선택 여부
     * @default
     */
    selected: PropTypes.bool,
};

const defaultProps = {
    alt: '썸네일이미지',
    data: {
        templateName: '',
        templateGroup: '',
        templateWidth: '',
    },
    menus: [],
    selected: false,
};

/**
 * 템플릿 썸네일 카드 컴포넌트
 */
const TemplateThumbCard = forwardRef((props, ref) => {
    const { onClick, menus, width, height, data, img, alt, selected } = props;
    const imgRef = useRef(null);
    const wrapperRef = useRef(null);

    /**
     * 커스텀 토글 버튼 아이콘 생성
     */
    const IconToggle = forwardRef(({ children, onClick }, ref) => (
        <Button
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof onClick === 'function') {
                    onClick(e);
                }
            }}
            variant="white"
            className="border-0 p-0 moka-table-button bg-transparent shadow-none"
        >
            {children}
            <MokaIcon iconName="fal-ellipsis-v" />
        </Button>
    ));

    /**
     * 아이콘 드롭 버튼 생성
     */
    const IconDropButton = () => (
        <Dropdown>
            <Dropdown.Toggle as={IconToggle} />
            <Dropdown.Menu>
                {menus.map((menu, idx) => (
                    <Dropdown.Item
                        key={idx}
                        eventKey={idx}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (typeof menu.onClick === 'function') {
                                menu.onClick(data, e);
                            }
                        }}
                    >
                        {menu.title}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );

    /**
     * 썸네일 카드 클릭 시
     */
    const handleThumbClick = (e) => {
        if (onClick) {
            onClick(data, e);
        }
    };

    return (
        <div ref={ref} className="p-1" style={{ width, height }}>
            <div className={clsx('border rounded d-flex flex-direction-column h-100 w-100', { 'thumb-card-selected': selected })}>
                <div className="position-relative overflow-hidden flex-fill cursor-pointer">
                    <div className="w-100 h-100 absolute-top">
                        <div ref={wrapperRef} className="w-100 h-100 d-flex align-item-centers rounded-top justify-content-center overflow-hidden" onClick={handleThumbClick}>
                            {img && <BSImage src={img} alt={alt} ref={imgRef} className="center-image" />}
                            {!img && (
                                <div className="w-100 d-flex align-items-center justify-content-center bg-light">
                                    <MokaIcon iconName="fad-image" size="2x" className="color-gray-200" />
                                </div>
                            )}
                        </div>
                    </div>
                    {data.templateWidth !== 0 && <p className="template-group-label">w{data.templateWidth}</p>}
                </div>
                <div className="p-03 border-top" style={{ minHeight: 55 }}>
                    <div className="d-flex justify-content-between" style={{ height: 27 }}>
                        <p className="pt-05 pl-05 mb-0 flex-fill h5 text-truncate" title={data.templateName}>
                            {data.templateName}
                        </p>
                        {menus.length > 0 && <IconDropButton />}
                    </div>
                    <p className="pt-0 pl-05 mb-0 text-truncate">{data.templateGroupName}</p>
                </div>
            </div>
        </div>
    );
});

TemplateThumbCard.propTypes = propTypes;
TemplateThumbCard.defaultProps = defaultProps;

export default TemplateThumbCard;
