import React, { forwardRef } from 'react';
import clsx from 'clsx';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import { MokaIcon } from '@components';

const propTypes = {
    /**
     * { value*, label*, ...rest }
     * 셀렉트의 옵션(value, label 필수)
     */
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string,
        }),
    ).isRequired,
    /**
     * 멀티선택
     */
    isMulti: PropTypes.bool,
    /**
     * select시 옵션메뉴 닫기
     */
    closeMenuOnSelect: PropTypes.bool,
    /**
     * placeholder
     */
    placeholder: PropTypes.string,
    /**
     * value
     */
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    /**
     * defaultValue
     */
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    /**
     * onChange (value, event) => {}
     */
    onChange: PropTypes.func,
    /**
     * customize 옵션
     * 검색 아이콘 추가 여부
     */
    searchIcon: PropTypes.bool,
    /**
     * 검색 아이콘 클릭 콜백
     */
    onClickSearchIcon: PropTypes.func,
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * invalid 여부
     */
    isInvalid: PropTypes.bool,
    /**
     * 옵션이 노출되는 메뉴의 maxHeight 설정
     */
    maxMenuHeight: PropTypes.number,
};

const defaultProps = {
    isMulti: false,
    closeMenuOnSelect: true,
    placeholder: '선택한 값이 없습니다',
    onChange: undefined,
    searchIcon: false,
    onClickSearchIcon: undefined,
    isInvalid: false,
};

const customStyles = {
    option: (provided, state) => ({
        ...provided,
    }),
    control: (provided, state) => ({
        ...provided,
    }),
    singleValue: (provided, state) => ({
        ...provided,
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        padding: state.isMulti ? '2px 8px 0px 8px' : '0px 8px',
    }),
    multiValueLabel: (provided, state) => ({
        ...provided,
        fontSize: '12px',
        fontWeight: 500,
    }),
};

/**
 * 자동완성 컴포넌트
 * @see https://react-select.com/home
 */
const MokaAutocomplete = forwardRef((props, ref) => {
    const { options, isMulti, closeMenuOnSelect, searchIcon, onClickSearchIcon, placeholder, defaultValue, value, onChange, className, isInvalid, maxMenuHeight, ...rest } = props;

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
                    <MokaIcon iconName="fas-search" />
                </div>
                {children}
            </components.IndicatorsContainer>
        );
    };

    return (
        <Select
            ref={ref}
            className={clsx('react-select-container', 'flex-fill', className, {
                'is-invalid': isInvalid,
            })}
            classNamePrefix="react-select"
            closeMenuOnSelect={closeMenuOnSelect}
            isSearchable
            isClearable={true}
            isMulti={isMulti}
            hideSelectedOptions={false}
            placeholder={placeholder}
            options={options}
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            components={searchIcon ? { IndicatorsContainer } : undefined}
            styles={customStyles}
            maxMenuHeight={maxMenuHeight}
            {...rest}
        />
    );
});

MokaAutocomplete.defaultProps = defaultProps;
MokaAutocomplete.propTypes = propTypes;

export default MokaAutocomplete;
