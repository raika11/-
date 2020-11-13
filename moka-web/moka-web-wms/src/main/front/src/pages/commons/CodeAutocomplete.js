import React, { useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { MokaInputLabel } from '@components';
import { initialState, getCodeKornameList, changeKornameSearchOption, GET_CODE_KORNAME_LIST } from '@store/code';

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
     * className
     */
    className: PropTypes.string,
    /**
     * 기사코드 값!!!
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
};
const defaultProps = {
    isMulti: false,
};

/**
 * 기사 분류 데이터를 가져오는 자동완성
 */
const CodeAutocomplete = forwardRef((props, ref) => {
    const { label, labelWidth, className, value, onChange, isMulti, placeholder } = props;
    const dispatch = useDispatch();

    const { storeSearch, list, loading } = useSelector((store) => ({
        storeSearch: store.code.korname.search,
        list: store.code.korname.list,
        loading: store.loading[GET_CODE_KORNAME_LIST],
    }));

    const [search, setSearch] = useState(initialState.korname.search);
    const [defaultValue, setDefaultValue] = useState(null);
    const [options, setOptions] = useState([]);

    const handleChangeValue = (value) => {
        if (onChange) {
            if (value === null) {
                onChange(null);
            } else {
                onChange(value.value);
            }
        }
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getCodeKornameList(changeKornameSearchOption(search)));
    }, [dispatch, search]);

    useEffect(() => {
        setOptions(
            list.map((code) => {
                const { masterCode, serviceKorname, sectionKorname, contentKorname } = code;
                let label = serviceKorname;
                if (sectionKorname && sectionKorname !== '') {
                    label += ` > ${sectionKorname}`;
                }
                if (contentKorname && contentKorname !== '') {
                    label += ` > ${contentKorname}`;
                }

                return {
                    ...code,
                    value: masterCode,
                    label,
                };
            }),
        );
    }, [list]);

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
            let values = value.split(',');
            options.forEach((op) => {
                const findOp = values.find((v) => v === op.value);
                if (findOp) findOps.push(findOp);
            });
            setDefaultValue(findOps);
        }
    }, [isMulti, options, value]);

    return (
        <MokaInputLabel
            ref={ref}
            label={label}
            as="autocomplete"
            id="code-auto-complete"
            labelWidth={labelWidth}
            className={className}
            value={defaultValue}
            placeholder={placeholder}
            onChange={handleChangeValue}
            inputProps={{ options, isMulti, isLoading: loading }}
        />
    );
});

CodeAutocomplete.propTypes = propTypes;
CodeAutocomplete.defaultProps = defaultProps;

export default CodeAutocomplete;
