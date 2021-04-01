import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import produce from 'immer';
import { useSelector } from 'react-redux';
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
     * 매체의 타입
     */
    sourceType: PropTypes.oneOf(['DESKING', 'JOONGANG', 'CONSALES', 'JSTORE', 'SOCIAL', 'BULK', 'RCV']).isRequired,
    /**
     * 드롭다운 메뉴의 height
     * @default
     */
    dropdownHeight: PropTypes.number,
    /**
     * width
     */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const defaultProps = {
    bulk: false,
    sourceType: 'JOONGANG',
    dropdownHeight: 200,
    width: 210,
};

/**
 * 공통 > 매체 선택자
 * 이 컴포넌트는 dispatch하지 않는다
 * (sourceType, value, onChange 필수로 받음)
 */
const SourceSelector = (props) => {
    const { className, isInvalid, value, onChange, width, sourceType, dropdownHeight } = props;
    const [selectedList, setSelectedList] = useState([]); // 체크된 매체 리스트
    const [renderList, setRenderList] = useState([]); // 렌더링되는 매체 리스트
    const [toggleText, setToggleText] = useState('매체 전체');
    const [isAllChecked, setAllChecked] = useState(true);
    const deskingSourceList = useSelector(({ articleSource }) => articleSource.deskingSourceList); // 데스킹 매체
    const typeSourceList = useSelector(({ articleSource }) => articleSource.typeSourceList); // 타입별 매체

    /**
     * 매체 리스트에서 sourceCode로 매체 데이터의 index를 찾음
     * @param {string} 매체ID
     */
    const findSourceIndex = useCallback((id) => renderList.findIndex((sc) => sc.sourceCode === id), [renderList]);

    /**
     * 매체 리스트에서 sourceCode로 매체 데이터 찾음
     * @param {string} 매체ID
     */
    const findSource = useCallback((id) => renderList.find((sc) => sc.sourceCode === id), [renderList]);

    /**
     * 매체check change
     * @param {object} e 이벤트
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { checked, id } = e.target;
            let resultList = [];

            if (id === 'all') {
                // 매체 전체 예외처리
                resultList = checked ? renderList : [];
            } else {
                const target = findSource(id);
                if (checked) {
                    resultList = [...selectedList, target].sort(function (a, b) {
                        return a.index - b.index;
                    });
                } else {
                    const isSelected = selectedList.findIndex((sl) => sl.sourceCode === id);
                    if (isSelected > -1) {
                        resultList = produce(selectedList, (draft) => {
                            draft.splice(isSelected, 1);
                        });
                    }
                }
            }

            if (typeof onChange === 'function') {
                onChange(resultList.map((r) => r.sourceCode).join(','));
            }
        },
        [findSource, onChange, renderList, selectedList],
    );

    /**
     * 렌더링 시 checked true인지 false인지 판단
     * @param {string} sourceCode 매체코드
     */
    const chkTrue = useCallback(
        (sourceCode) => {
            if (!value) return false;
            else return value.split(',').indexOf(sourceCode) > -1;
        },
        [value],
    );

    useEffect(() => {
        if (sourceType === 'DESKING' && deskingSourceList) {
            // 데스킹 매체
            setRenderList(deskingSourceList.map((li, idx) => ({ ...li, index: idx })));
        } else if (typeSourceList[sourceType]) {
            // 타입별 매체
            setRenderList(typeSourceList[sourceType].map((li, idx) => ({ ...li, index: idx })));
        }
    }, [deskingSourceList, sourceType, typeSourceList]);

    useEffect(() => {
        if (selectedList.length > 0) {
            const target = findSource(selectedList[0].sourceCode);
            if (!target) return;

            if (selectedList.length === renderList.length) {
                setToggleText('매체 전체');
                setAllChecked(true);
            } else if (selectedList.length === 1) {
                setToggleText(target.sourceName);
                setAllChecked(false);
            } else {
                setToggleText(`${target.sourceName} 외 ${selectedList.length - 1}건`);
                setAllChecked(false);
            }
        } else {
            setToggleText('');
            setAllChecked(false);
        }
    }, [findSource, renderList, selectedList]);

    useEffect(() => {
        const valueArr = (value || '')
            .split(',')
            .filter((v) => v !== '')
            .filter((v) => findSourceIndex(v) > -1);

        setSelectedList(valueArr.map((v) => findSource(v)));
    }, [findSource, findSourceIndex, value]);

    return (
        <Dropdown style={{ width }} className={clsx('flex-fill', className)}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-custom-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu} height={dropdownHeight} className="custom-scroll w-100">
                {/* 매체 전체 옵션 */}
                <MokaInput
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
                        className={clsx({
                            'mb-2': idx !== renderList.length - 1,
                        })}
                        as="checkbox"
                        inputProps={{ label: cd.sourceName, custom: true, checked: chkTrue(cd.sourceCode) }}
                        id={cd.sourceCode}
                    />
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

SourceSelector.propTypes = propTypes;
SourceSelector.defaultProps = defaultProps;

export default SourceSelector;
