import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import produce from 'immer';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputGroup, MokaIcon } from '@components';

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
const CustomToggle = forwardRef(({ children, onClick, isInvalid }, ref) => {
    return (
        <div
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(e);
            }}
        >
            <MokaInputGroup
                value={children}
                inputProps={{ readOnly: true }}
                placeholder="매체를 선택하세요"
                inputClassName="bg-white cursor-pointer"
                isInvalid={isInvalid}
                append={
                    <Button variant="searching">
                        <MokaIcon iconName="fas-caret-down" />
                    </Button>
                }
            />
        </div>
    );
});

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * invalid 여부
     */
    isInvalid: PropTypes.bool,
    /**
     * 매체 sourceCode의 리스트 (필수)
     */
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.oneOf([null])]),
    /**
     * 매체 checked 변경 시 실행되는 함수 (필수)
     */
    onChange: PropTypes.func.isRequired,
    /**
     * 매체의 타입 (참고용임. 사용X)
     */
    sourceType: PropTypes.oneOf(['DESKING', 'JOONGANG', 'CONSALES', 'JSTORE', 'SOCIAL', 'BULK', 'RCV']),
    /**
     * 드롭다운 메뉴의 height
     * @default
     */
    dropdownHeight: PropTypes.number,
    /**
     * width
     */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 전체 매체 리스트
     * @default
     */
    sourceList: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
    dropdownHeight: 200,
    width: 210,
    sourceList: [],
};

/**
 * 매체 선택자
 * @desc value, onChange 필수로 받음
 */
const SourceSelector = forwardRef(({ className, isInvalid, value, onChange, width, dropdownHeight, sourceList }, ref) => {
    const [checkedList, setCheckedList] = useState([]); // 체크한 리스트
    const [renderList, setRenderList] = useState([]);
    const [toggleText, setToggleText] = useState('매체 전체');
    const [isAllChecked, setAllChecked] = useState(true);

    /**
     * 매체 체크 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { checked, id } = e.target;
        let resultList = [];

        if (id === 'all') {
            // 매체 전체 예외처리
            resultList = checked ? renderList : [];
        } else {
            const target = renderList.find((s) => s.sourceCode === id);
            if (checked) {
                resultList = [...checkedList, target].sort(function (a, b) {
                    return a.index - b.index;
                });
            } else {
                const isSelected = checkedList.findIndex((sl) => sl.sourceCode === id);
                if (isSelected > -1) {
                    resultList = produce(checkedList, (draft) => {
                        draft.splice(isSelected, 1);
                    });
                }
            }
        }

        if (typeof onChange === 'function') {
            onChange(resultList.map((r) => r.sourceCode).join(','));
        }
    };

    /**
     * 체크박스 렌더러
     */
    const renderSc = ({ id, label, checked }) => (
        <div key={id} className="mb-2">
            <MokaInput as="checkbox" name="service" id={id} inputProps={{ custom: true, label, checked }} onChange={handleChangeValue} />
        </div>
    );

    useEffect(() => {
        setRenderList((sourceList || []).map((s, idx) => ({ ...s, index: idx })));
    }, [sourceList]);

    useEffect(() => {
        // value => checkedList
        if (renderList.length > 0) {
            const scs = (value || '')
                .split(',')
                .filter((v) => v !== '')
                .map((val) => renderList.find((s) => s.sourceCode === val))
                .filter(Boolean);
            setCheckedList(scs);

            if (scs.length === renderList.length) {
                setToggleText('매체 전체');
                setAllChecked(true);
            } else if (scs.length === 1) {
                setToggleText(scs[0].sourceName);
                setAllChecked(false);
            } else if (scs.length > 1) {
                setToggleText(`${scs[0].sourceName} 외 ${scs.length - 1}건`);
                setAllChecked(false);
            } else {
                setToggleText('');
                setAllChecked(false);
            }
        }
    }, [renderList, value]);

    return (
        <div style={{ width }} className={clsx('flex-fill', className)} ref={ref}>
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-custom-components">
                    {toggleText}
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu} height={dropdownHeight} className="custom-scroll w-100 pb-0">
                    {/* 매체 전체 옵션 */}
                    {renderSc({
                        label: '카테고리 전체',
                        id: 'all',
                        checked: isAllChecked,
                    })}
                    {renderList.map((cd) =>
                        renderSc({
                            label: cd.sourceName,
                            id: cd.sourceCode,
                            checked: checkedList.findIndex((c) => c.sourceCode === cd.sourceCode) > -1,
                        }),
                    )}
                    {/* <MokaInput
                        name="sourceList"
                        onChange={handleChangeValue}
                        className="mb-2"
                        as="checkbox"
                        inputProps={{ label: '매체 전체', custom: true, checked: isAllChecked }}
                        id="all"
                    />
                    {renderList.map((cd, idx) => (
                        <MokaInput
                            key={cd.sourceCode}
                            name="sourceList"
                            onChange={handleChangeValue}
                            className="mb-2"
                            as="checkbox"
                            inputProps={{ label: cd.sourceName, custom: true, checked: chkTrue(cd.sourceCode) }}
                            id={cd.sourceCode}
                        />
                    ))} */}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
});

SourceSelector.propTypes = propTypes;
SourceSelector.defaultProps = defaultProps;

export default SourceSelector;
