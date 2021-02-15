import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputGroup, MokaIcon } from '@components';
import { getTypeSourceList } from '@store/articleSource';

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
     * 벌크 매체 value 리스트 (필수)
     */
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.oneOf([null])]),
    /**
     * 매체 checked 변경 시 실행되는 함수 (필수)
     */
    onChange: PropTypes.func.isRequired,
    /**
     * 드롭다운 메뉴의 height
     */
    dropdownHeight: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const defaultProps = {
    bulk: false,
    dropdownHeight: 200,
    width: 210,
};

/**
 * 벌크 매체 선택
 * (value, onChange 필수로 받음)
 */
const BulkSourceCodeSelector = (props) => {
    const { className, isInvalid, value, onChange, width, dropdownHeight } = props;
    const dispatch = useDispatch();
    const [selectedList, setSelectedList] = useState([]); // 체크 목록
    const [bulkSourceList, setBulkSourceList] = useState([]);
    const [toggleText, setToggleText] = useState('전체');
    const typeSourceList = useSelector((store) => store.articleSource.typeSourceList); // 타입별 매체

    /**
     * 벌크 소스 index를 찾음
     * @param {string} sourceCode
     */
    const findSourceIndex = useCallback((id) => bulkSourceList.findIndex((s) => s.sourceCode === id), [bulkSourceList]);

    /**
     * 벌크 소스 목록에서 id로 해당 요소 찾음
     * @param {string} sourceCode
     */
    const findSource = useCallback((id) => bulkSourceList.find((s) => s.sourceCode === id), [bulkSourceList]);

    /**
     * 매체check change
     * @param {object} e 이벤트
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { checked, id } = e.target;
            let resultList = [];
            const target = findSource(id);
            if (checked) {
                resultList = [...selectedList, target].sort(function (a, b) {
                    return a.index - b.index;
                });
            } else {
                const isSelected = selectedList.findIndex((s) => s.sourceCode === id);
                if (isSelected > -1) {
                    resultList = produce(selectedList, (draft) => {
                        draft.splice(isSelected, 1);
                    });
                }
            }

            if (typeof onChange === 'function') {
                onChange(resultList.map((r) => r.sourceCode).join(','));
            }
        },
        [findSource, onChange, selectedList],
    );

    /**
     * 렌더링 시 checked true인지 false인지 판단
     * @param {string} sourceCode
     */
    const chkTrue = useCallback(
        (sourceCode) => {
            if (!value) return false;
            else return value.split(',').indexOf(sourceCode) > -1;
        },
        [value],
    );

    useEffect(() => {
        // BULK 매체 조회
        if (!typeSourceList?.['BULK']) {
            dispatch(getTypeSourceList({ type: 'BULK' }));
        } else {
            setBulkSourceList([...typeSourceList['BULK'].map((li, idx) => ({ ...li, index: idx })), { sourceCode: 'JL', sourceName: '조인스랜드', index: 3 }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeSourceList]);

    useEffect(() => {
        if (selectedList.length > 0) {
            const target = findSource(selectedList[0].sourceCode);
            if (!target) return;

            if (selectedList.length === bulkSourceList.length) {
                setToggleText('전체');
            } else if (selectedList.length === 1) {
                setToggleText(target.sourceName);
            } else {
                setToggleText(`${target.sourceName} 외 ${selectedList.length - 1}개`);
            }
        } else {
            setToggleText('');
        }
    }, [findSource, selectedList, bulkSourceList.length]);

    useEffect(() => {
        if (bulkSourceList.length < 1) return;
        if (value || value === '') {
            const valueArr = value
                .split(',')
                .filter((v) => v !== '')
                .filter((v) => findSourceIndex(v) > -1);

            // 필터링된 valueArr과 selectedList와 비교하여 다를 경우 value, selectedList 변경
            const selectedListStr = selectedList.map((r) => r.sourceCode).join(',');
            if (selectedListStr !== valueArr.join(',')) {
                setSelectedList(valueArr.map((v) => findSource(v)));
                onChange(valueArr.join(','));
            }
        } else {
            // 값이 없을 때는(value === null) 모든 매체 선택
            if (typeof onChange === 'function') {
                onChange(bulkSourceList.map((site) => site.sourceCode).join(','));
            }
        }
    }, [findSource, findSourceIndex, onChange, selectedList, bulkSourceList, value]);

    return (
        <Dropdown style={{ width }} className={clsx('flex-fill', className)}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-bulk-site-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu} height={dropdownHeight} className="custom-scroll w-100">
                {bulkSourceList &&
                    bulkSourceList.map((s, idx) => (
                        <MokaInput
                            key={s.sourceCode}
                            name="bulkSourceList"
                            onChange={handleChangeValue}
                            className={clsx({
                                'mb-2': idx !== bulkSourceList.length - 1,
                            })}
                            as="checkbox"
                            inputProps={{
                                label: s.sourceName,
                                custom: true,
                                checked: chkTrue(s.sourceCode),
                            }}
                            id={s.sourceCode}
                        />
                    ))}
                {/* <MokaInput
                        name="bulkSourceList"
                        onChange={handleChangeValue}
                        className="mt-2"
                        as="checkbox"
                        inputProps={{
                            label: '조인스랜드',
                            custom: true,
                            checked: chkTrue('JL'),
                        }}
                        id='JL'
                    /> */}
            </Dropdown.Menu>
        </Dropdown>
    );
};

BulkSourceCodeSelector.propTypes = propTypes;
BulkSourceCodeSelector.defaultProps = defaultProps;

export default BulkSourceCodeSelector;
