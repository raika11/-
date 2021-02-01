import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import produce from 'immer';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import { MokaIcon, MokaInput, MokaInputGroup } from '@components';
import { getPhotoOrigins } from '@store/photoArchive';

/**
 * 커스텀 메뉴
 */
const CustomMenu = forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    return (
        <div ref={ref} style={{ ...style, width: 160, minWidth: 160 }} className={clsx('px-2', className)} aria-labelledby={labeledBy}>
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
                inputClassName="bg-white ft-12 cursor-pointer border-right-0"
                isInvalid={isInvalid}
                append={
                    <div
                        className="cursor-pointer bg-white d-flex align-items-center justify-content-center border-left-0 rounded-right"
                        style={{ width: 30, border: '1px solid #CED1DB' }}
                    >
                        <MokaIcon iconName="fas-sort" />
                    </div>
                }
            />
        </div>
    );
});

export const propTypes = {
    /**
     * 드롭다운 className
     */
    className: PropTypes.string,
    /**
     * invalid 여부
     */
    isInvalid: PropTypes.bool,
    /**
     * 출처 타입 리스트 (필수)
     */
    originValue: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.oneOf([null])]),
    /**
     * checked 변경 시 실행되는 함수 (필수)
     */
    onChange: PropTypes.func.isRequired,
};

const defaultProps = {};

const EditThumbOriginDropdown = (props) => {
    const { className, isInvalid, originValue, onChange } = props;
    const dispatch = useDispatch();
    const [originSelectedList, setOriginSelectedList] = useState([]);
    const [originObj, setOriginObj] = useState({});
    const [toggleText, setToggleText] = useState('전체');

    const originList = useSelector((store) => store.photoArchive.originList);

    /**
     * id로 리스트의 index 조회
     */
    const originIndex = useCallback((id) => originList.findIndex((origin) => origin.code === id.code), [originList]);

    /**
     * change 이벤트
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { checked, id } = e.target;
        let resultList = [];
        if (typeof onChange === 'function') {
            if (id === 'all') {
                if (checked) {
                    onChange('all');
                } else {
                    onChange('');
                }
            } else {
                const targetIdx = originIndex({ code: id });

                if (checked) {
                    resultList = [...originSelectedList, originObj[targetIdx]].sort((a, b) => {
                        return a.index - b.index;
                    });
                } else {
                    const isSelected = originSelectedList.findIndex((origin) => origin.code === id);
                    if (isSelected > -1) {
                        resultList = produce(originSelectedList, (draft) => {
                            draft.splice(isSelected, 1);
                        });
                    }
                }
                onChange(resultList.map((r) => r.code).join(','));
            }
        }
    };

    useEffect(() => {
        // 출처 목록 조회
        dispatch(getPhotoOrigins());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // 출처 목록 객체로 변환
        if (originList) {
            setOriginObj(Object.assign({}, originList));
        }
    }, [originList]);

    /**
     * 렌더링 시 checked true인지 false인지 판단
     * @param {string} name 이미지 타입 이름
     */
    const chkTrue = (name) => {
        if (!originValue || originValue === '') return false;
        else if (originValue === 'all') return true;
        else return originValue.split(',').indexOf(name) > -1;
    };

    useEffect(() => {
        if (originSelectedList.length > 0) {
            const targetIdx = originIndex(originSelectedList[0]);
            const target = originObj[targetIdx];

            if (originSelectedList.length + 1 === Object.keys(originObj).length) {
                setToggleText('전체');
            } else if (originSelectedList.length === 1) {
                setToggleText(target.name);
            } else {
                setToggleText(`${target.name} 외 ${originSelectedList.length - 1}개`);
            }
        } else {
            setToggleText('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originIndex, originObj, originSelectedList]);

    useEffect(() => {
        if (Object.keys(originObj).length < 1) return;
        if (originValue || originValue === '') {
            if (originValue === 'all') {
                setOriginSelectedList(
                    Object.values(originObj)
                        .filter((origin) => origin.code !== 'all')
                        .map((v) => {
                            const targetIndex = originIndex(v);
                            return originObj[targetIndex];
                        }),
                );
            } else {
                const valueArr = originValue.split(',').filter((v) => v !== '');

                setOriginSelectedList(
                    valueArr.map((v) => {
                        const targetIndex = originIndex({ code: v });
                        return originObj[targetIndex];
                    }),
                );
            }
        } else {
            // 값이 없을 때는 모든 매체 선택
            if (typeof onChange === 'function') {
                onChange('all');
            }
        }
    }, [onChange, originIndex, originObj, originValue]);

    return (
        <Dropdown className={clsx('flex-fill', className)}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-custom-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                <MokaInput
                    id={'all'}
                    onChange={handleChangeValue}
                    className="mb-2 ft-12"
                    as="checkbox"
                    inputProps={{ label: '전체', custom: true, checked: originValue === 'all' || toggleText === '전체' }}
                />

                {originList &&
                    originList
                        .filter((origin) => origin.code !== 'all')
                        .map((origin) => (
                            <MokaInput
                                key={origin.code}
                                id={origin.code}
                                name="originList"
                                onChange={handleChangeValue}
                                className="mb-2 ft-12"
                                as="checkbox"
                                inputProps={{ label: origin.name, custom: true, checked: chkTrue(origin.code) }}
                            />
                        ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

EditThumbOriginDropdown.propTypes = propTypes;
EditThumbOriginDropdown.defaultProps = defaultProps;

export default EditThumbOriginDropdown;
