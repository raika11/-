import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputGroup, MokaIcon } from '@components';
import { getSourceList, getBulkSourceList } from '@store/articleSource';

/**
 * 커스텀 메뉴
 */
const CustomMenu = forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    return (
        <div ref={ref} style={style} className={clsx('px-2', className)} aria-labelledby={labeledBy}>
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
                inputClassName="bg-white ft-12 cursor-pointer"
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
     * 벌크 매체 리스트를 조회해야하는지
     */
    bulk: PropTypes.bool,
};

const defaultProps = {
    bulk: false,
};

/**
 * 매체 선택자
 * (value, onChange 필수로 받음)
 */
const SourceSelector = (props) => {
    const { className, isInvalid, value, onChange, bulk } = props;
    const dispatch = useDispatch();
    const [selectedList, setSelectedList] = useState([]); // 체크된 매체 리스트
    const [renderList, setRenderList] = useState([]); // 렌더링되는 매체 리스트
    const [sourceObj, setSourceObj] = useState({}); // 파싱을 편하게 하기 위해서 매체 리스트를 obj로 변환함. key는 list의 idx, value는 list값
    const [toggleText, setToggleText] = useState('매체 전체');

    const sourceList = useSelector((store) => store.articleSource.sourceList); // 전체 매체
    const bulkSourceList = useSelector((store) => store.articleSource.bulkSourceList); // 벌크전송 되는 매체

    /**
     * 매체 리스트에서 sourceCode로 매체 데이터의 index를 찾음
     * @param {string} 매체ID
     */
    const findSourceIndex = useCallback((id) => renderList.findIndex((sc) => sc.sourceCode === id), [renderList]);

    /**
     * 매체check change
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { checked, id } = e.target;
        let resultList = [];

        const targetIdx = findSourceIndex(id);
        if (checked) {
            resultList = [...selectedList, sourceObj[targetIdx]].sort(function (a, b) {
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

        if (typeof onChange === 'function') {
            onChange(resultList.map((r) => r.sourceCode).join(','));
        }
    };

    /**
     * 렌더링 시 checked true인지 false인지 판단
     * @param {string} sourceCode 매체코드
     */
    const chkTrue = (sourceCode) => {
        if (!value) return false;
        else return value.split(',').indexOf(sourceCode) > -1;
    };

    useEffect(() => {
        if (!bulk) {
            // 원래 매체 조회
            if (!sourceList) {
                dispatch(getSourceList());
            } else {
                setRenderList(sourceList);
                setSourceObj(sourceList.reduce((all, sc, index) => ({ ...all, [index]: { ...sc, index } }), {}));
            }
        } else {
            // 벌크 매체 조회
            if (!bulkSourceList) {
                dispatch(getBulkSourceList());
            } else {
                setRenderList(bulkSourceList);
                setSourceObj(bulkSourceList.reduce((all, sc, index) => ({ ...all, [index]: { ...sc, index } }), {}));
            }
        }
    }, [dispatch, sourceList, bulk, bulkSourceList]);

    useEffect(() => {
        if (selectedList.length > 0) {
            const targetIdx = findSourceIndex(selectedList[0].sourceCode);
            const target = sourceObj[targetIdx];

            if (selectedList.length === Object.keys(sourceObj).length) {
                setToggleText('매체 전체');
            } else if (selectedList.length === 1) {
                setToggleText(target.sourceName);
            } else {
                setToggleText(`${target.sourceName} 외 ${selectedList.length - 1}개`);
            }
        } else {
            setToggleText('');
        }
    }, [sourceObj, selectedList, findSourceIndex]);

    useEffect(() => {
        if (Object.keys(sourceObj).length < 1) return;
        if (value || value === '') {
            // 1,3,60,61 => [1, 3, 60, 61]로 파싱하고, renderList에 포함되어 있는 데이터만 남기도록 필터링한다
            const valueArr = value
                .split(',')
                .filter((v) => v !== '')
                .filter((v) => findSourceIndex(v) > -1);

            // 필터링된 valueArr과 selectedList와 비교하여 다를 경우 value, selectedList 변경
            const selectedListStr = selectedList.map((r) => r.sourceCode).join(',');
            if (selectedListStr !== valueArr.join(',')) {
                setSelectedList(
                    valueArr.map((v) => {
                        const targetIndex = findSourceIndex(v);
                        return sourceObj[targetIndex];
                    }),
                );
                onChange(valueArr.join(','));
            }
        } else {
            // 값이 없을 때는(value === null) 모든 매체 선택
            if (typeof onChange === 'function') {
                onChange(
                    Object.values(sourceObj)
                        .map((sc) => sc.sourceCode)
                        .join(','),
                );
            }
        }
    }, [findSourceIndex, onChange, selectedList, sourceObj, value]);

    return (
        <Dropdown style={{ width: 195 }} className={clsx('flex-fill', className)}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-custom-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                {renderList.map((cd, idx) => (
                    <MokaInput
                        key={cd.sourceCode}
                        name="sourceList"
                        onChange={handleChangeValue}
                        className={clsx('ft-12', {
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
