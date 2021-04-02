import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputGroup, MokaIcon } from '@components';
import { getBulkSite } from '@/store/codeMgt';

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
                placeholder="사이트를 선택하세요"
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
     * 벌크 사이트 value 리스트 (필수)
     */
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.oneOf([null])]),
    /**
     * 사이트 checked 변경 시 실행되는 함수 (필수)
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
 * 벌크 사이트 선택
 * (value, onChange 필수로 받음)
 */
const BulkSiteSelector = (props) => {
    const { className, isInvalid, value, onChange, width, dropdownHeight, onReset } = props;
    const dispatch = useDispatch();
    const [selectedList, setSelectedList] = useState([]); // 체크 목록
    const [siteList, setSiteList] = useState([]); // 기타코드에서 받은 벌크 사이트 목록
    const [toggleText, setToggleText] = useState('사이트 전체');
    const bulkSiteRows = useSelector((store) => store.codeMgt.bulkSiteRows); // 기타코드 벌크 사이트 목록

    /**
     * 벌크 사이트 목록에서 사이트의 index를 찾음
     * @param {string} site id
     */
    const findSiteIndex = useCallback((id) => siteList.findIndex((site) => site.id === id), [siteList]);

    /**
     * 사이트 목록에서 site id로 해당 요소 찾음
     * @param {string} site id
     */
    const findSite = useCallback((id) => siteList.find((site) => site.id === id), [siteList]);

    /**
     * 매체check change
     * @param {object} e 이벤트
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { checked, id } = e.target;
            let resultList = [];
            const target = findSite(id);
            if (checked) {
                resultList = [...selectedList, target].sort(function (a, b) {
                    return a.index - b.index;
                });
            } else {
                const isSelected = selectedList.findIndex((site) => site.id === id);
                if (isSelected > -1) {
                    resultList = produce(selectedList, (draft) => {
                        draft.splice(isSelected, 1);
                    });
                }
            }

            if (typeof onChange === 'function') {
                onChange(resultList.map((r) => r.id).join(','));
            }
        },
        [findSite, onChange, selectedList],
    );

    /**
     * 렌더링 시 checked true인지 false인지 판단
     * @param {string} site id
     */
    const chkTrue = useCallback(
        (site) => {
            if (!value) return false;
            else return value.split(',').indexOf(site) > -1;
        },
        [value],
    );

    useEffect(() => {
        // 검색 초기화 시 셀렉트 해제
        if (onReset) {
            setSelectedList([]);
        }
    }, [onReset]);

    useEffect(() => {
        if (!bulkSiteRows) {
            dispatch(getBulkSite());
        } else {
            setSiteList(bulkSiteRows.map((site, idx) => ({ ...site, index: idx })));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bulkSiteRows]);

    useEffect(() => {
        if (selectedList.length > 0) {
            const target = findSite(selectedList[0].id);
            if (!target) return;

            if (selectedList.length === siteList.length) {
                setToggleText('사이트 전체');
            } else if (selectedList.length === 1) {
                setToggleText(target.name);
            } else {
                setToggleText(`${target.name} 외 ${selectedList.length - 1}개`);
            }
        } else {
            setToggleText('');
        }
    }, [findSite, selectedList, siteList.length]);

    useEffect(() => {
        if (siteList.length < 1) return;
        if (value || value === '') {
            const valueArr = value
                .split(',')
                .filter((v) => v !== '')
                .filter((v) => findSiteIndex(v) > -1);

            // 필터링된 valueArr과 selectedList와 비교하여 다를 경우 value, selectedList 변경
            const selectedListStr = selectedList.map((r) => r.id).join(',');
            if (selectedListStr !== valueArr.join(',')) {
                setSelectedList(valueArr.map((v) => findSite(v)));
                onChange(valueArr.join(','));
            }
        } else {
            // 값이 없을 때는(value === null) 모든 매체 선택
            if (typeof onChange === 'function') {
                /*onChange(siteList.map((site) => site.id).join(','));*/
            }
        }
    }, [findSite, findSiteIndex, onChange, selectedList, siteList, value]);

    return (
        <Dropdown style={{ width }} className={clsx('flex-fill', className)}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-bulk-site-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu} height={dropdownHeight} className="custom-scroll w-100">
                {siteList &&
                    siteList.map((s, idx) => (
                        <MokaInput
                            key={s.id}
                            name="bulkSiteList"
                            onChange={handleChangeValue}
                            className={clsx({
                                'mb-2': idx !== bulkSiteRows.length - 1,
                            })}
                            as="checkbox"
                            inputProps={{
                                label: s.name,
                                custom: true,
                                checked: chkTrue(s.id),
                            }}
                            id={s.id}
                        />
                    ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

BulkSiteSelector.propTypes = propTypes;
BulkSiteSelector.defaultProps = defaultProps;

export default BulkSiteSelector;
