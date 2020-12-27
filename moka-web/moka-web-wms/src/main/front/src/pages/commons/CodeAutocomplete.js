import React, { useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { MokaInputLabel } from '@components';
import { initialState, getCodeKornameList, changeKornameSearchOption, GET_CODE_KORNAME_LIST } from '@store/code';
import CodeListModal from './CodeListModal';

const propTypes = {
    /**
     * label
     */
    label: PropTypes.string,
    /**
     * labelWidth
     */
    labelWidth: PropTypes.number,
    /**
     * labelClassName
     */
    labelClassName: PropTypes.string,
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * 기사코드 값!!! 오직 스트링만 받는다
     * "1000000" 이거나 "1000000,1100000"
     */
    value: PropTypes.string,
    /**
     * value 변경 시
     */
    onChange: PropTypes.func,
    /**
     * isMulti 체크
     */
    isMulti: PropTypes.bool,
    /**
     * placeholder
     */
    placeholder: PropTypes.string,
    /**
     * autocomplete의 maxMenuHeight
     */
    maxMenuHeight: PropTypes.number,
    /**
     * 자동완성 아이템 선택 시 노출할 라벨명
     * masterCode => 1000000,
     * korname => 대분류 > 중분류 > 소분류
     */
    labelType: PropTypes.oneOf(['masterCode', 'korname']),
};
const defaultProps = {
    isMulti: false,
    searchIcon: true,
    selection: 'single',
    labelType: 'korname',
};

/**
 * 기사 분류(masterCode) 데이터를 가져오는 자동완성
 */
const CodeAutocomplete = forwardRef((props, ref) => {
    const { label, labelWidth, labelClassName, className, value, onChange, isMulti, placeholder, searchIcon, maxMenuHeight, labelType } = props;
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_CODE_KORNAME_LIST]);
    const { storeSearch, codeList } = useSelector((store) => ({
        storeSearch: store.code.korname.search,
        codeList: store.code.korname.list,
    }));

    // state
    const [search, setSearch] = useState(initialState.korname.search);
    const [defaultValue, setDefaultValue] = useState(null);
    const [options, setOptions] = useState([]);
    const [modalShow, setModalShow] = useState(false);

    /**
     * 자동완성 값 변경시
     * @param {any} value 단일일 때 object, 여러개일 때 array
     */
    const handleChangeValue = (value) => {
        if (!isMulti) {
            // typeof value === 'object'
            if (onChange) {
                if (value === null) {
                    onChange(null);
                } else {
                    onChange(value.masterCode);
                }
            }
        } else {
            // typeof value === array
            if (onChange) {
                onChange(value);
            }
        }
    };

    const handleClickSearchIcon = () => {
        setModalShow(!modalShow);
    };

    /**
     * 코드목록 모달에서 저장 버튼 클릭
     * @param {any} result 단일일 때 object, 여러개일 때 array
     */
    const handleClickSave = (result) => {
        if (!isMulti) {
            const findOp = options.find((op) => String(op.value) === String(result.masterCode));
            if (findOp) {
                handleChangeValue(findOp);
            } else {
                handleChangeValue(null);
            }
        } else {
            // 멀티일 경우 (list 채로 보냄)
            handleChangeValue(result);
        }
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getCodeKornameList(changeKornameSearchOption(search)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setOptions(
            codeList.map((code) => {
                const { masterCode, serviceKorname, sectionKorname, contentKorname } = code;
                let label = '';

                if (labelType === 'korname') {
                    label = serviceKorname;
                    if (sectionKorname && sectionKorname !== '') {
                        label += ` > ${sectionKorname}`;
                    }
                    if (contentKorname && contentKorname !== '') {
                        label += ` > ${contentKorname}`;
                    }
                } else if (labelType === 'masterCode') {
                    label = masterCode;
                }

                return {
                    ...code,
                    value: masterCode,
                    label,
                };
            }),
        );
    }, [labelType, codeList]);

    useEffect(() => {
        if (!isMulti) {
            // 멀티가 아닌 경우 value로 object를 찾아서 셋팅
            const findOp = options.find((op) => String(op.value) === String(value));
            if (findOp) {
                setDefaultValue(findOp);
            } else {
                setDefaultValue(null);
            }
        } else {
            // 멀티인 경우 value -> ,로 분리하여 object 리스트 찾아서 셋팅
            let findOps = [];
            let values = value.split(',').filter((val) => val !== '');
            values.forEach((val) => {
                const findOp = options.find((op) => op.value === val);
                if (findOp) findOps.push(findOp);
            });
            setDefaultValue(findOps);
        }
    }, [isMulti, options, value]);

    return (
        <React.Fragment>
            <MokaInputLabel
                ref={ref}
                label={label}
                as="autocomplete"
                id="code-auto-complete"
                labelWidth={labelWidth}
                labelClassName={labelClassName}
                className={className}
                value={defaultValue}
                placeholder={placeholder}
                onChange={handleChangeValue}
                inputProps={{ options, isMulti, isLoading: loading, searchIcon: searchIcon, onClickSearchIcon: handleClickSearchIcon, maxMenuHeight: maxMenuHeight }}
            />

            {searchIcon && <CodeListModal value={value} show={modalShow} onHide={() => setModalShow(false)} onSave={handleClickSave} selection={isMulti ? 'multiple' : 'single'} />}
        </React.Fragment>
    );
});

CodeAutocomplete.propTypes = propTypes;
CodeAutocomplete.defaultProps = defaultProps;

export default CodeAutocomplete;
