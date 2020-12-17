import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import produce from 'immer';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import { MokaIcon, MokaInput, MokaInputGroup } from '@components';
import { getPhotoTypes } from '@store/photoArchive';

/**
 * 커스텀 메뉴
 */
const CustomMenu = forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    return (
        <div ref={ref} style={{ ...style, width: 140, minWidth: 140 }} className={clsx('px-2', className)} aria-labelledby={labeledBy}>
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
     * 이미지 타입 리스트 (필수)
     */
    imageValue: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.oneOf([null])]),
    /**
     * checked 변경 시 실행되는 함수 (필수)
     */
    onChange: PropTypes.func.isRequired,
};

const defaultProps = {};

const EditThumbSelectDropdown = (props) => {
    const { className, isInvalid, imageValue, onChange } = props;
    const dispatch = useDispatch();
    // const [dataSelectedList, setDataSelectedList] = useState([]);
    const [imageSelectedList, setImageSelectedList] = useState([]);
    const [imageObj, setImageObj] = useState({});
    const [toggleText, setToggleText] = useState('전체');

    // const dataTypeList = useSelector((store) => store.photoArchive.dataTypeList);
    const imageTypeList = useSelector((store) => store.photoArchive.imageTypeList);

    /**
     * id로 리스트의 index 조회
     */
    // const dataTypeIndex = useCallback((id) => dataTypeList.findIndex((type) => type.name === id), [dataTypeList]);
    const imageTypeIndex = useCallback((id) => imageTypeList.findIndex((type) => type.name === id.name), [imageTypeList]);

    /**
     * change 이벤트
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { checked, id } = e.target;
        let resultList = [];
        if (typeof onChange === 'function') {
            if (id === 'All') {
                if (checked) {
                    onChange('All');
                } else {
                    onChange('');
                }
            } else {
                const targetIdx = imageTypeIndex({ name: id });

                if (checked) {
                    resultList = [...imageSelectedList, imageObj[targetIdx]].sort((a, b) => {
                        return a.index - b.index;
                    });
                } else {
                    const isSelected = imageSelectedList.findIndex((type) => type.name === id);
                    if (isSelected > -1) {
                        resultList = produce(imageSelectedList, (draft) => {
                            draft.splice(isSelected, 1);
                        });
                    }
                }
                onChange(resultList.map((r) => r.name).join(','));
            }
        }
        // if (name === 'dataTypeList') {
        //     const targetIdx = dataTypeIndex(id);
        //     if (checked) {
        //         resultList = [...dataSelectedList, dataObj[targetIdx]].sort((a, b) => {
        //             return a.index - b.index;
        //         });
        //     } else {
        //         const isSelected = dataSelectedList.findIndex((type) => type.cd === id);
        //         if (isSelected > -1) {
        //             resultList = produce(dataSelectedList, (draft) => {
        //                 draft.splice(isSelected, 1);
        //             });
        //         }
        //     }
        // }
    };

    useEffect(() => {
        // 이미지 타입 조회
        dispatch(getPhotoTypes());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // 이미지 타입 배열 객체로 변환
        if (imageTypeList) {
            setImageObj(Object.assign({}, imageTypeList));
        }
    }, [imageTypeList]);

    /**
     * 렌더링 시 checked true인지 false인지 판단
     * @param {string} name 이미지 타입 이름
     */
    const chkTrue = (name) => {
        if (!imageValue || imageValue === '') return false;
        else if (imageValue === 'All') return true;
        else return imageValue.split(',').indexOf(name) > -1;
    };

    useEffect(() => {
        // if (dataSelectedList.length > 0) {
        //     const targetIdx = dataTypeIndex(dataSelectedList[0].cd);
        //     const target = dataObj[targetIdx];

        //     if (dataSelectedList.length === Object.keys(dataObj).length) {
        //         setToggleText('전체');
        //     } else if (dataSelectedList.length === 1) {
        //         setToggleText(target.label);
        //     } else {
        //         setToggleText(`${target.label} 외 ${dataSelectedList.length - 1}개`);
        //     }
        // }

        if (imageSelectedList.length > 0) {
            const targetIdx = imageTypeIndex(imageSelectedList[0]);
            const target = imageObj[targetIdx];

            if (imageSelectedList.length + 1 === Object.keys(imageObj).length) {
                setToggleText('전체');
            } else if (imageSelectedList.length === 1) {
                setToggleText(target.label);
            } else {
                setToggleText(`${target.label} 외 ${imageSelectedList.length - 1}개`);
            }
        } else {
            setToggleText('');
        }
    }, [imageObj, imageSelectedList, imageTypeIndex]);

    useEffect(() => {
        if (Object.keys(imageObj).length < 1) return;
        if (imageValue || imageValue === '') {
            if (imageValue === 'All') {
                setImageSelectedList(
                    Object.values(imageObj)
                        .filter((type) => type.name !== 'All')
                        .map((v) => {
                            const targetIndex = imageTypeIndex(v);
                            return imageObj[targetIndex];
                        }),
                );
            } else {
                const valueArr = imageValue.split(',').filter((v) => v !== '');

                setImageSelectedList(
                    valueArr.map((v) => {
                        const targetIndex = imageTypeIndex({ name: v });
                        return imageObj[targetIndex];
                    }),
                );
            }
        } else {
            // 값이 없을 때는 모든 매체 선택
            if (typeof onChange === 'function') {
                onChange('All');
            }
        }
    }, [imageObj, imageTypeIndex, imageValue, onChange]);

    return (
        <Dropdown className={clsx('flex-fill', className)}>
            <Dropdown.Toggle as={CustomToggle} isInvalid={isInvalid} id="dropdown-custom-components">
                {toggleText}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                <MokaInput
                    id={'All'}
                    onChange={handleChangeValue}
                    className="mb-2 ft-12"
                    as="checkbox"
                    inputProps={{ label: '전체', custom: true, checked: imageValue === 'All' }}
                />
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

                {/* 필터 */}
                {imageTypeList &&
                    imageTypeList
                        .filter((type) => type.name !== 'All')
                        .map((type) => (
                            <MokaInput
                                key={type.name}
                                id={type.name}
                                name="imageTypeList"
                                onChange={handleChangeValue}
                                className="mb-2 ft-12"
                                as="checkbox"
                                inputProps={{ label: type.label, custom: true, checked: chkTrue(type.name) }}
                            />
                        ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

EditThumbSelectDropdown.propTypes = propTypes;
EditThumbSelectDropdown.defaultProps = defaultProps;

export default EditThumbSelectDropdown;
