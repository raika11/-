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
    // const [itemsObj, setItemsObj] = useState({});
    const [selectItems, setSelectItems] = useState([]);

    // const originIndex = useCallback((id) => itemsObj.findIndex((origin) => origin.code === id.code), [originList]);

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
                const targetIdx = fileExt.indexOf(id);

                if (checked) {
                    itemList = [...selectItems, fileExt[targetIdx]].sort((a, b) => {
                        return a.index - b.index;
                    });
                } else {
                    const isSelected = fileExt.indexOf(id);
                    if (isSelected > -1) {
                        itemList = produce(selectItems, (draft) => {
                            draft.splice(isSelected, 1);
                        });
                    }
                }
                onChange(itemList.join(','));
            }
        }
    };

    const chkTrue = (id) => {
        if (!value || value === '') return false;
        else if (toggleText === '전체') return true;
        else return value.split(',').indexOf(id) > -1;
    };

    // useEffect(() => {
    //     setItemsObj(fileExt);
    // }, []);

    // useEffect(() => {
    //     if (selectItems.length > 0) {
    //         const targetIdx = itemIndex(originSelectedList[0]);
    //         const target = originObj[targetIdx];

    //         if (originSelectedList.length + 1 === Object.keys(originObj).length) {
    //             setToggleText('전체');
    //         } else if (originSelectedList.length === 1) {
    //             setToggleText(target.name);
    //         } else {
    //             setToggleText(`${target.name} 외 ${originSelectedList.length - 1}개`);
    //         }
    //     } else {
    //         setToggleText('');
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [originIndex, originObj, originSelectedList]);

    useEffect(() => {
        if (selectItems.length === fileExt.length) {
            setToggleText('전체');
        } else {
            setToggleText('');
        }
    }, [selectItems.length]);

    // useEffect(() => {
    //     if (value || value === '') {
    //         if (value.length === fileExt.length) {
    //             setSelectItems(
    //                 Object.values(itemsObj).map((i) => {
    //                     const targetIndex = fileExt.indexOf(i);
    //                     return itemsObj[targetIndex];
    //                 }),
    //             );
    //             setToggleText('전체');
    //         } else {
    //             const valueArr = value
    //                 .split(',')
    //                 .map((e) => e.replace(' ', ''))
    //                 .filter((i) => i !== '');

    //             setSelectItems(
    //                 valueArr.map((i) => {
    //                     const targetIndex = fileExt.indexOf(i);
    //                     return itemsObj[targetIndex];
    //                 }),
    //             );
    //         }
    //     }
    // }, [itemsObj, value]);

    return (
        <Dropdown className={clsx('flex-fill')}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-custom-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu} height={dropdownHeight} className="custom-scroll w-100">
                <MokaInput id="file-all" onChange={handleChangeValue} as="checkbox" inputProps={{ label: '전체', custom: true, checked: toggleText === '전체' }} />
                {fileExt.map((i) => {
                    return (
                        <MokaInput
                            as="checkbox"
                            key={i}
                            id={i}
                            name="itemList"
                            onChange={handleChangeValue}
                            disabled={disabled}
                            inputProps={{ label: i, custom: true, checked: chkTrue(i) }}
                        />
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
};
export default FileExtSelector;
