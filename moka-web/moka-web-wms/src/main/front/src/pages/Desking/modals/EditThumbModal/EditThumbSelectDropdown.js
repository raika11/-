import React, { useState, forwardRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import produce, { castDraft } from 'immer';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { MokaIcon, MokaInput, MokaInputGroup } from '@components';
import { getPhotoTypes } from '@store/photoArchive';

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
     * width
     */
    width: PropTypes.number,
    /**
     * imgList (필수)
     */
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.oneOf([null])]),
    /**
     * checked 변경 시 실행되는 함수 (필수)
     */
    onChange: PropTypes.func.isRequired,
};

const defaultProps = {
    width: 120,
};

const EditThumbSelectDropdown = (props) => {
    const { className, isInvalid, width, value, onChange } = props;
    const dispatch = useDispatch();
    const [selectedList, setSelectedList] = useState([]);
    const [toggleText, setToggleText] = useState('전체');
    const [dataObj, setDataObj] = useState({}); // 순서를 유지하기 위해 리스트를 obj로 변환함. key는 list의 idx, value는 list값

    const imageTypeList = useSelector((store) => store.photoArchive.imageTypeList);

    /**
     * 리스트에서 매체 데이터의 index를 찾음
     */
    const findIndex = useCallback((id) => imageTypeList.findIndex((img) => img.cd === id), [imageTypeList]);

    /**
     * change 이벤트
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { checked, id } = e.target;
        let resultList = [];

        const targetIdx = findIndex(id);
        if (checked) {
            resultList = [...selectedList, dataObj[targetIdx]].sort(function (a, b) {
                return a.index - b.index;
            });
        } else {
            const isSelected = selectedList.findIndex((img) => img.cd === id);
            if (isSelected > -1) {
                resultList = produce(selectedList, (draft) => {
                    draft.splice(isSelected, 1);
                });
            }
        }

        if (typeof onChange === 'function') {
            onChange(resultList.map((r) => r.cd).join(','));
        }
    };

    /**
     * 렌더링 시 checked true인지 false인지 판단
     * @param {string} cd img코드
     */
    const chkTrue = (cd) => {
        if (!value || value === '') return false;
        else return value.indexOf(cd) > -1;
    };

    useEffect(() => {
        if (!imageTypeList) {
            dispatch(getPhotoTypes());
        } else {
            setDataObj(imageTypeList.reduce((all, sc, index) => ({ ...all, [index]: { ...sc, index } }), {}));
        }
    }, [dispatch, imageTypeList]);

    useEffect(() => {
        if (selectedList.length > 0) {
            const targetIdx = findIndex(selectedList[0].cd);
            const target = dataObj[targetIdx];

            if (selectedList.length === Object.keys(dataObj).length) {
                setToggleText('전체');
            } else if (selectedList.length === 1) {
                setToggleText(target.label);
            } else {
                setToggleText(`${target.label} 외 ${selectedList.length - 1}개`);
            }
        } else {
            setToggleText('');
        }
    }, [dataObj, selectedList, findIndex]);

    useEffect(() => {
        if (Object.keys(dataObj).length < 1) return;
        if (value) {
            const valueArr = value.split(',');
            setSelectedList(
                valueArr.map((v) => {
                    const targetIndex = findIndex(v);
                    return dataObj[targetIndex];
                }),
            );
        } else {
            // 값이 없을 때는 모든 매체 선택
            if (typeof onChange === 'function') {
                onChange(
                    Object.values(dataObj)
                        .map((sc) => sc.cd)
                        .join(','),
                );
            }
        }
    }, [findIndex, onChange, dataObj, value]);

    return (
        <Dropdown className={clsx('flex-fill', className)} style={{ width: width }}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-custom-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                {imageTypeList &&
                    imageTypeList.map((img) => (
                        <MokaInput
                            key={img.cd}
                            id={img.cd}
                            name="imageTypeList"
                            onChange={handleChangeValue}
                            className="mb-2 ft-12"
                            as="checkbox"
                            inputProps={{ label: img.label, custom: true, checked: chkTrue(img.cd) }}
                        />
                    ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

EditThumbSelectDropdown.propTypes = propTypes;
EditThumbSelectDropdown.defaultProps = defaultProps;

export default EditThumbSelectDropdown;
