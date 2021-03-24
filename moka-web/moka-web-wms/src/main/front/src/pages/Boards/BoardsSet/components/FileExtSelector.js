import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputGroup, MokaIcon } from '@components';

const fileExt = [
    { ext: 'zip', index: 0 },
    { ext: 'xls', index: 1 },
    { ext: 'xlsx', index: 2 },
    { ext: 'ppt', index: 3 },
    { ext: 'doc', index: 4 },
    { ext: 'hwp', index: 5 },
    { ext: 'jpg', index: 6 },
    { ext: 'png', index: 7 },
    { ext: 'gif', index: 8 },
];

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
                placeholder="확장자를 선택하세요"
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

/**
 * 게시글 파일 확장자 선택 컴포넌트
 */
const FileExtSelector = (props) => {
    const { isInvalid, value, onChange, dropdownHeight, disabled } = props;
    const [toggleText, setToggleText] = useState('전체');
    const [itemsObj, setItemsObj] = useState({});
    const [selectItems, setSelectItems] = useState([]);

    /**
     * id로 리스트의 index 조회
     */
    const extIndex = useCallback((id) => fileExt.findIndex((i) => i.ext === id), []);

    /**
     * 체크 해제 되었을 경우 state 업데이트
     */
    const handleChangeValue = (e) => {
        const { id, checked } = e.target;
        let itemList = [];

        if (typeof onChange === 'function') {
            if (id === 'file-all') {
                if (checked) {
                    onChange('all');
                    setToggleText('전체');
                } else {
                    onChange('');
                    setToggleText('');
                }
            } else {
                const targetIdx = extIndex(id);

                if (checked) {
                    itemList = [...selectItems, itemsObj[targetIdx]].sort((a, b) => {
                        return a.index - b.index;
                    });
                } else {
                    const isSelected = selectItems.findIndex((i) => i.ext === id);
                    if (isSelected > -1) {
                        itemList = produce(selectItems, (draft) => {
                            draft.splice(isSelected, 1);
                        });
                    }
                }
                onChange(itemList.map((i) => i.ext).join(','));
            }
        }
    };

    const chkTrue = (id) => {
        if (!value || value === '') return false;
        else if (value === 'zip,xls,xlsx,ppt,doc,hwp,jpg,png,gif') return true;
        else return value.split(',').indexOf(id) > -1;
    };

    useEffect(() => {
        setItemsObj(fileExt);
    }, []);

    useEffect(() => {
        if (selectItems.length > 0) {
            const targetIdx = extIndex(selectItems[0].ext);
            const target = itemsObj[targetIdx];

            if (selectItems.length === Object.keys(itemsObj).length) {
                setToggleText('전체');
            } else if (selectItems.length === 1) {
                setToggleText(target.ext);
            } else {
                setToggleText(`${target.ext} 외 ${selectItems.length - 1}개`);
            }
        } else {
            setToggleText('');
        }
    }, [extIndex, itemsObj, selectItems]);

    useEffect(() => {
        if (Object.keys(itemsObj).length < 1) return;
        if (value || value === '') {
            if (value === 'zip,xls,xlsx,ppt,doc,hwp,jpg,png,gif') {
                setSelectItems(
                    Object.values(itemsObj).map((i) => {
                        const targetIndex = extIndex(i.ext);
                        return itemsObj[targetIndex];
                    }),
                );
            } else {
                const valueArr = value
                    .replaceAll(' ', '')
                    .split(',')
                    .filter((i) => i !== '');

                setSelectItems(
                    valueArr.map((i) => {
                        const targetIndex = extIndex(i);
                        return itemsObj[targetIndex];
                    }),
                );
            }
        } else {
            // 값이 없을 때는 모든 매체 선택
            if (typeof onChange === 'function') {
                onChange('all');
            }
        }
    }, [itemsObj, onChange, extIndex, value]);

    return (
        <Dropdown className={clsx('flex-fill')}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-custom-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu} height={dropdownHeight} className="custom-scroll w-100">
                <MokaInput
                    id="file-all"
                    name="itemList"
                    onChange={handleChangeValue}
                    as="checkbox"
                    inputProps={{ label: '전체', custom: true, checked: value.split(',').length === fileExt.length || toggleText === '전체' }}
                />

                {fileExt.map((i) => {
                    return (
                        <MokaInput
                            as="checkbox"
                            key={i.index}
                            id={i.ext}
                            name="itemList"
                            onChange={handleChangeValue}
                            disabled={disabled}
                            inputProps={{ label: i.ext, custom: true, checked: chkTrue(i.ext) }}
                        />
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
};
export default FileExtSelector;
