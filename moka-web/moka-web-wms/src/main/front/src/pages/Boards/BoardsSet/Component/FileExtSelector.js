import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputGroup, MokaIcon } from '@components';
import { selectItem } from '@pages/Boards/BoardConst';

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

/**
 * 게시글 등록시 선택할수 있은 파일 확장자 선택 컨퍼넌트
 * 일반 적인 select box 가 아니고 해당 컨퍼넌트가 공통으로 쓰는곳이 없어서 대시보드에 있는 Select 컨퍼넌트(매체 선택)를 가지오 옴.
 */
const FileExtSelect = (props) => {
    const { isInvalid, value, selectChange, dropdownHeight } = props;
    const [toggleText, setToggleText] = useState('전체');
    const [selectItems, setSelectItems] = useState([]);

    // 선택 체크 해제 되었을 경우 스테이트 업데이트
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChangeValue = useCallback((e) => {
        const { name, checked } = e.target;
        let tempItems = [];

        if (checked === true) {
            if (name === 'all') {
                tempItems = selectItem.FileExt;
            } else {
                tempItems = [...selectItems, name];

                // 선택한 아이템이 전체 일경우.
                if (selectItem.FileExt.length - 1 === tempItems.length) {
                    // tempItems.unshift('all');
                }
            }
        } else if (checked === false) {
            if (name === 'all') {
                tempItems = [];
            } else {
                tempItems = selectItems;
            }
        }
        setSelectItems(tempItems);
    });

    // 설정된 리스트중 체크 및 해제 되었을떄 내용 업데이트 및 상위에 전달.
    useEffect(() => {
        let selectItemsValue = selectItems
            .filter((e) => e !== 'all')
            .map((e) => {
                return e === 'all' ? '전체' : e;
            })
            .join(',');
        setToggleText(selectItem.FileExt.length === selectItems.length ? '전체' : selectItemsValue);
        selectChange({
            target: {
                name: 'allowFileExt',
                value: selectItemsValue,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectItems]);

    // 상위에서 내려온 리스트를 설정. ( 기존 수정시 데이터를 설정)
    useEffect(() => {
        if (value.length > 0) {
            let tempItems = value
                .split(',')
                .map((e) => e.replace(' ', ''))
                .filter((e) => e !== '');
            if (selectItem.FileExt.length - 1 === tempItems.length) {
                tempItems.unshift('all');
            }
            setSelectItems(tempItems);
        }
    }, [value]);

    // 최초 로딩시 설정 해 놓은 리스트를 설정...
    useEffect(() => {
        setSelectItems(selectItem.FileExt);
    }, []);

    return (
        <Dropdown className={clsx('flex-fill')}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-custom-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu} height={dropdownHeight} className="custom-scroll w-100">
                {selectItem.FileExt.map((e, idex) => {
                    return (
                        <MokaInput
                            key={idex}
                            id={e}
                            name={e}
                            onChange={handleChangeValue}
                            className={clsx({ 'mb-2': false })}
                            as="checkbox"
                            inputProps={{ label: e === 'all' ? '전체' : e, custom: true, checked: selectItems.includes(e) }}
                        />
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
};
export default FileExtSelect;
