import React, { forwardRef, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import produce from 'immer';
import { useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import PerfectScrollbar from 'react-perfect-scrollbar';
import util from '@utils/commonUtil';
import { MokaIcon, MokaInput, MokaLoader } from '@components';

/**
 * 커스텀 메뉴
 */
const CustomMenu = forwardRef(({ children, style, height, className, 'aria-labelledby': labeledBy }, ref) => {
    return (
        <div ref={ref} style={{ ...style, maxHeight: height }} className={clsx('px-2', className)} aria-labelledby={labeledBy}>
            {children}
        </div>
    );
});

/**
 * 커스텀 토글
 */
const CustomToggle = forwardRef(({ children, onClick }, ref) => {
    return (
        <div className="w-100 d-flex input-group" ref={ref}>
            <div className="flex-fill p-0 px-2 form-control">{children}</div>
            <div className="input-group-append">
                <Button variant="searching" onClick={onClick}>
                    <MokaIcon iconName="fas-caret-down" />
                </Button>
            </div>
        </div>
    );
});

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * width
     */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 드롭다운 메뉴의 height
     * @default
     */
    dropdownHeight: PropTypes.number,
    /**
     * 매체 sourceCode의 리스트 (필수)
     */
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.oneOf([null])]),
    /**
     * onChange (필수)
     */
    onChange: PropTypes.func.isRequired,

    /**
     * label에 code를 보여줌
     */
    showCodeLabel: PropTypes.bool,

    /**
     * 전체 선택 checkbox 여부
     */
    showAllSelector: PropTypes.bool,
};
const defaultProps = {
    dropdownHeight: 200,
    value: '',
    showCodeLabel: false,
    showAllSelector: true,
};

/**
 * 홈 섹션편집 > 패키지 목록 > 검색 > 마스터코드 (대분류) 선택자
 *
 * 구조적으로 문제있음.. 차후 방법을 찾아서 수정
 */
const ServiceCodeSelector = (props) => {
    const { className, width, dropdownHeight, value, onChange, loading, showCodeLabel, showAllSelector } = props;
    const serviceCodeList = useSelector(({ code }) => code.service.list);
    const [isAllChecked, setAllChecked] = useState(false);
    const [checkedList, setCheckedList] = useState([]); // 선택된 코드들
    const [renderList, setRenderList] = useState([]);

    /**
     * 체크박스 change
     * @param {object} e 이벤트
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { checked } = e.target;
            const cd = e.target.dataset['cd'];
            let resultList = [];

            if (cd === 'all') {
                // 매체 전체 예외처리
                resultList = checked ? renderList : [];
            } else {
                const target = renderList.find((c) => c.masterCode === cd);
                if (checked) {
                    resultList = [...checkedList, target].sort(function (a, b) {
                        return a.index - b.index;
                    });
                } else {
                    const idx = checkedList.findIndex((c) => c.masterCode === cd);
                    resultList = produce(checkedList, (draft) => {
                        draft.splice(idx, 1);
                    });
                }
            }

            if (typeof onChange === 'function') {
                onChange(resultList.map((r) => r.masterCode).join(','));
            }
        },
        [checkedList, onChange, renderList],
    );

    /**
     * 코드 렌더러
     */
    const renderCode = useCallback(
        ({ className, id, label, checked }) => {
            const key = util.getUniqueKey();
            return (
                <div key={`${key}-${id}`} className={clsx('mb-2 mr-2 float-left', className)}>
                    <MokaInput
                        as="checkbox"
                        name="service"
                        className="flex-grow-0"
                        id={`${key}-${id}`}
                        data-cd={id}
                        inputProps={{ custom: true, label, checked }}
                        onChange={handleChangeValue}
                    />
                </div>
            );
        },
        [handleChangeValue],
    );

    useEffect(() => {
        setRenderList(
            serviceCodeList
                .filter((code) => code.usedYn === 'Y')
                .map((render) => {
                    let label = render.serviceKorname;
                    if (showCodeLabel) {
                        label = `${render.masterCode}:${render.serviceKorname}`;
                    }
                    return { ...render, label };
                }),
        );
    }, [serviceCodeList, showCodeLabel]);

    useEffect(() => {
        if (renderList.length > 0) {
            const codes = (value || '')
                .split(',')
                .filter((v) => v !== '')
                .map((val) => {
                    const code = renderList.find((s) => s.masterCode === val);
                    if (code) {
                        let label = code.serviceKorname;
                        if (showCodeLabel) {
                            label = `${code.masterCode}:${code.serviceKorname}`;
                        }
                        return { ...code, label };
                    } else {
                        return null;
                    }
                })
                .filter(Boolean);
            setCheckedList(codes);

            if (codes.length === renderList.length) {
                setAllChecked(true);
            } else {
                setAllChecked(false);
            }
        } else {
            setCheckedList([]);
        }
    }, [value, renderList, showCodeLabel]);

    return (
        <Dropdown style={{ width }} className={className}>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                {loading && <MokaLoader size={4} />}
                <PerfectScrollbar options={{ suppressScrollY: true, wheelPropagation: true }}>
                    <div className="d-flex flex-nowrap align-items-center h-100" style={{ width: 0 }}>
                        {isAllChecked ? (
                            <Badge variant="searching">카테고리 전체</Badge>
                        ) : (
                            checkedList.map((c) => (
                                <Badge key={c.masterCode} className="mr-1" variant="searching">
                                    {c.label}
                                    {/* <MokaIcon iconName="fas-times" className="ml-1 cursor-pointer" onClick={() => {}} /> */}
                                </Badge>
                            ))
                        )}
                    </div>
                </PerfectScrollbar>
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu} height={dropdownHeight} className="custom-scroll pb-0 w-100">
                {showAllSelector &&
                    renderCode({
                        label: '카테고리 전체',
                        custom: true,
                        id: 'all',
                        checked: isAllChecked,
                    })}
                {renderList.map((cd, idx) =>
                    renderCode({
                        label: cd.label,
                        id: cd.masterCode,
                        checked: checkedList.findIndex((l) => l.masterCode === cd.masterCode) > -1,
                    }),
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
};

ServiceCodeSelector.propTypes = propTypes;
ServiceCodeSelector.defaultProps = defaultProps;

export default ServiceCodeSelector;
