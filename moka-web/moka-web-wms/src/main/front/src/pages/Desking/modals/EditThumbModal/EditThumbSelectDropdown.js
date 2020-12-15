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
                inputClassName="bg-white ft-12 cursor-pointer border-right-0"
                isInvalid={isInvalid}
                append={
                    <div
                        className="cursor-pointer bg-white d-flex align-items-center justify-content-center border-left-0"
                        style={{ width: 30, border: '1px solid #CED1DB', borderRadius: '0.2rem' }}
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
     * width
     */
    width: PropTypes.number,
    /**
     * list (필수)
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
    const [dataSelectedList, setDataSelectedList] = useState([]);
    const [imageSelectedList, setImageSelectedList] = useState([]);
    const [toggleText, setToggleText] = useState('전체');
    const [dataObj, setDataObj] = useState({});
    const [imageObj, setImageObj] = useState({});

    const dataTypeList = useSelector((store) => store.photoArchive.dataTypeList);
    const imageTypeList = useSelector((store) => store.photoArchive.imageTypeList);

    /**
     * id로 리스트의 index 조회
     */
    const dataTypeIndex = useCallback((id) => dataTypeList.findIndex((type) => type.cd === id), [dataTypeList]);
    const imageTypeIndex = useCallback((id) => imageTypeList.findIndex((type) => type.cd === id), [imageTypeList]);

    /**
     * change 이벤트
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, checked, id } = e.target;
        let resultList = [];

        if (name === 'dataTypeList') {
            const targetIdx = dataTypeIndex(id);

            if (checked) {
                resultList = [...dataSelectedList, dataObj[targetIdx]].sort((a, b) => {
                    return a.index - b.index;
                });
            } else {
                const isSelected = dataSelectedList.findIndex((type) => type.cd === id);
                if (isSelected > -1) {
                    resultList = produce(dataSelectedList, (draft) => {
                        draft.splice(isSelected, 1);
                    });
                }
            }
        } else if (name === 'imageTypeList') {
            const targetIdx = imageTypeIndex(id);

            if (checked) {
                resultList = [...imageSelectedList, dataObj[targetIdx]].sort((a, b) => {
                    return a.index - b.index;
                });
            } else {
                const isSelected = imageSelectedList.findIndex((type) => type.cd === id);
                if (isSelected > -1) {
                    resultList = produce(imageSelectedList, (draft) => {
                        draft.splice(isSelected, 1);
                    });
                }
            }
        }

        if (typeof onChange === 'function') {
            onChange(resultList.map((r) => r.cd).join(','));
        }
    };

    /**
     * 렌더링 시 checked true인지 false인지 판단
     * @param {string} cd 이미지 타입 코드
     */
    const chkTrue = (cd) => {
        if (!value || value === '') return false;
        else return value.indexOf(cd) > -1;
    };

    // useEffect(() => {
    //     if (imageTypeList) {
    //         imageTypeList.slice().sort((a, b) = b.stats.speed-a.stats.speed);
    //     }
    // }, [imageTypeList]);

    // useEffect(() => {
    //     if (!imageTypeList) {
    //         dispatch(getPhotoTypes());
    //     } else {
    //         setDataObj(imageTypeList.reduce((all, type, index) => ({ ...all, [index]: { ...type, index } }), {}));
    //     }
    // }, [dispatch, imageTypeList]);

    // useEffect(() => {
    //     if (dataSelectedList.length > 0) {
    //         const targetIdx = dataTypeIndex(dataSelectedList[0].cd);
    //         const target = dataObj[targetIdx];

    //         if (dataSelectedList.length === Object.keys(dataObj).length) {
    //             setToggleText('전체');
    //         } else if (dataSelectedList.length === 1) {
    //             setToggleText(target.label);
    //         } else {
    //             setToggleText(`${target.label} 외 ${dataSelectedList.length - 1}개`);
    //         }
    //     } else if (imageSelectedList.length > 0) {
    //         const targetIdx = dataTypeIndex(imageSelectedList[0].cd);
    //         const target = dataObj[targetIdx];

    //         if (dataSelectedList.length === Object.keys(dataObj).length) {
    //             setToggleText('전체');
    //         } else if (dataSelectedList.length === 1) {
    //             setToggleText(target.label);
    //         } else {
    //             setToggleText(`${target.label} 외 ${dataSelectedList.length - 1}개`);
    //         }
    //     }
    //     else {
    //         setToggleText('');
    //     }
    // }, [dataObj, dataSelectedList, dataTypeIndex]);

    // useEffect(() => {
    //     if (Object.keys(dataObj).length < 1) return;
    //     if (value) {
    //         const valueArr = value.split(',');
    //         setSelectedList(
    //             valueArr.map((v) => {
    //                 const targetIndex = findTypeIndex(v);
    //                 return dataObj[targetIndex];
    //             }),
    //         );
    //     } else {
    //         // 값이 없을 때는 모든 매체 선택
    //         if (typeof onChange === 'function') {
    //             onChange(
    //                 Object.values(dataObj)
    //                     .map((type) => type.cd)
    //                     .join(','),
    //             );
    //         }
    //     }
    // }, [findTypeIndex, onChange, dataObj, value]);

    return (
        <Dropdown className={clsx('flex-fill', className)} style={{ width: width }}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-custom-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu} style={{ width: '100px' }}>
                {/* {dataTypeList &&
                    dataTypeList.map((data) => (
                        <MokaInput
                            key={data.id}
                            id={data.id}
                            name="dataTypeList"
                            onChange={handleChangeValue}
                            className="mb-2 ft-12"
                            as="checkbox"
                            inputProps={{ label: data.name, custom: true, checked: chkTrue(data.id) }}
                        />
                    ))} */}

                {imageTypeList &&
                    imageTypeList.map((type) => (
                        <MokaInput
                            key={type.cd}
                            id={type.cd}
                            name="imageTypeList"
                            onChange={handleChangeValue}
                            className="mb-2 ft-12"
                            as="checkbox"
                            inputProps={{ label: type.label, custom: true, checked: chkTrue(type.cd) }}
                        />
                    ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

EditThumbSelectDropdown.propTypes = propTypes;
EditThumbSelectDropdown.defaultProps = defaultProps;

export default EditThumbSelectDropdown;
