import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputGroup, MokaIcon } from '@components';
import { getSourceList } from '@store/article';

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
        <div ref={ref} className="cursor-pointer">
            <MokaInputGroup
                value={children}
                inputProps={{ readOnly: true }}
                placeholder="매체를 선택하세요"
                inputClassName="bg-white ft-12"
                isInvalid={isInvalid}
                append={
                    <Button
                        variant="searching"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClick(e);
                        }}
                    >
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
};

const defaultProps = {};

/**
 * 매체 선택자
 * (value, onChange 필수로 받음)
 */
const SourceSelector = (props) => {
    const { className, isInvalid, value, onChange } = props;
    const dispatch = useDispatch();
    const [selectedList, setSelectedList] = useState([]);
    const [toggleText, setToggleText] = useState('매체 전체');
    const [sourceObj, setSourceObj] = useState({}); // 순서를 유지하기 위해 매체 리스트를 obj로 변환함. key는 list의 idx, value는 list값

    const { sourceList } = useSelector((store) => ({
        sourceList: store.article.sourceList,
    }));

    /**
     * 매체 리스트에서 sourceCode로 매체 데이터의 index를 찾음
     */
    const findSourceIndex = useCallback((id) => sourceList.findIndex((sc) => sc.sourceCode === id), [sourceList]);

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
        if (!value || value === '') return false;
        else return value.indexOf(sourceCode) > -1;
    };

    useEffect(() => {
        if (!sourceList) {
            dispatch(getSourceList());
        } else {
            setSourceObj(sourceList.reduce((all, sc, index) => ({ ...all, [index]: { ...sc, index } }), {}));
        }
    }, [dispatch, sourceList]);

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
        if (value) {
            const valueArr = value.split(',');
            setSelectedList(
                valueArr.map((v) => {
                    const targetIndex = findSourceIndex(v);
                    return sourceObj[targetIndex];
                }),
            );
        } else {
            // 값이 없을 때는 모든 매체 선택
            if (typeof onChange === 'function') {
                onChange(
                    Object.values(sourceObj)
                        .map((sc) => sc.sourceCode)
                        .join(','),
                );
            }
        }
    }, [findSourceIndex, onChange, sourceObj, value]);

    return (
        <Dropdown style={{ width: 195 }} className={clsx('flex-fill', className)}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-custom-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                {sourceList &&
                    sourceList.map(
                        (cd) =>
                            cd.usedYn === 'Y' && (
                                <MokaInput
                                    key={cd.sourceCode}
                                    name="sourceList"
                                    onChange={handleChangeValue}
                                    className="mb-2 ft-12"
                                    as="checkbox"
                                    inputProps={{ label: cd.sourceName, custom: true, checked: chkTrue(cd.sourceCode) }}
                                    id={cd.sourceCode}
                                />
                            ),
                    )}
            </Dropdown.Menu>
        </Dropdown>
    );
};

SourceSelector.propTypes = propTypes;
SourceSelector.defaultProps = defaultProps;

export default SourceSelector;
