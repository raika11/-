import React from 'react';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

/**
 * 자동완성 컴포넌트
 * https://react-select.com/home
 *
 * @param {arrayOf} props.options { value*, label*, ...rest } 옵션(value, label 필수)
 * @param {boolean} props.isMulti 멀티선택
 * @param {boolean} props.closeMenuOnSelect select시 옵션메뉴 닫기
 * @param {string} props.placeholder placeholder
 * @param {string} props.value value
 * @param {func} props.onChange onChange (value, event) => {}
 *
 * customize 옵션
 * @param {boolean} props.searchIcon 검색아이콘 추가(clearIndicator 없어짐)
 * @param {func} props.onClickSearchIcon 검색아이콘 클릭콜백
 */
const MokaAutocomplete = (props) => {
    const {
        options,
        isMulti,
        closeMenuOnSelect,
        searchIcon,
        onClickSearchIcon,
        placeholder,
        value,
        onChange,
        ...rest
    } = props;

    // 검색 아이콘
    const IndicatorsContainer = (props) => {
        const { children, ...rest } = props;
        const onClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof onClickSearchIcon === 'function') onClickSearchIcon();
        };

        return (
            <components.IndicatorsContainer {...rest}>
                <div
                    className="react-select__indicator react-select__search-indicator"
                    style={rest.getStyles('dropdownIndicator', props)}
                    onMouseDown={onClick}
                    onTouchEnd={onClick}
                >
                    <FontAwesomeIcon icon={faSearch} />
                </div>
                {children}
            </components.IndicatorsContainer>
        );
    };

    return (
        <Select
            className="react-select-container"
            classNamePrefix="react-select"
            closeMenuOnSelect={closeMenuOnSelect}
            isSearchable
            isClearable={!searchIcon}
            isMulti={isMulti}
            hideSelectedOptions={false}
            placeholder={placeholder}
            options={options}
            value={value}
            onChange={onChange}
            components={searchIcon ? { IndicatorsContainer } : undefined}
            {...rest}
        />
    );
};

MokaAutocomplete.defaultProps = {
    isMulti: false,
    closeMenuOnSelect: true,
    placeholder: '선택된 값이 없습니다.',
    value: undefined,
    onChange: undefined,
    searchIcon: false,
    onClickSearchIcon: undefined
};

MokaAutocomplete.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
        })
    ).isRequired,
    isMulti: PropTypes.bool,
    closeMenuOnSelect: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Array)]),
    onChange: PropTypes.func,
    searchIcon: PropTypes.bool,
    onClickSearchIcon: PropTypes.func
};

export default MokaAutocomplete;
