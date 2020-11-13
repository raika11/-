import React, { useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { MokaInputLabel } from '@components';
import { initialState, getCodeKornameList, changeKornameSearchOption } from '@store/code';

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
    value: PropTypes.any,
    /**
     * value 변경 시
     */
    onChange: PropTypes.func,
};
const defaultProps = {};

/**
 * 기사 분류 데이터를 가져오는 자동완성
 */
const CodeAutocomplete = forwardRef((props, ref) => {
    const { label, labelWidth, className, value, onChange } = props;
    const dispatch = useDispatch();

    const { storeSearch, list } = useSelector((store) => ({
        storeSearch: store.code.korname.search,
        list: store.code.korname.list,
    }));

    const [search, setSearch] = useState(initialState.korname.search);
    const [options, setOptions] = useState([]);

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

    return <MokaInputLabel ref={ref} label={label} as="autocomplete" labelWidth={labelWidth} className={className} value={value} onChange={onChange} inputProps={{ options }} />;
});

CodeAutocomplete.propTypes = propTypes;
CodeAutocomplete.defaultProps = defaultProps;

export default CodeAutocomplete;
