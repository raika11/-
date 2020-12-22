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
    /**
     * autocomplete의 maxMenuHeight
     */
    maxMenuHeight: PropTypes.number,
};
const defaultProps = {
    isMulti: false,
    searchIcon: true,
    selection: 'single',
};

/**
 * 기사 분류(masterCode) 데이터를 가져오는 자동완성
 */
const CodeAutocomplete = forwardRef((props, ref) => {
    const { label, labelWidth, className, value, onChange, isMulti, placeholder, searchIcon, maxMenuHeight } = props;
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_CODE_KORNAME_LIST]);
    const { storeSearch, list } = useSelector((store) => ({
        storeSearch: store.code.korname.search,
        list: store.code.korname.list,
    }));

    // state
    const [search, setSearch] = useState(initialState.korname.search);
    const [defaultValue, setDefaultValue] = useState(null);
    const [options, setOptions] = useState([]);
    const [modalShow, setModalShow] = useState(false);

    const handleChangeValue = (value) => {
        if (onChange) {
            if (value === null) {
                onChange(null);
            } else {
                onChange(value.masterCode);
            }
        }
    };

    const handleClickSearchIcon = () => {
        setModalShow(!modalShow);
    };

    /**
     * 코드목록 모달에서 등록 버튼 클릭
     */
    const handleClickSave = (code) => {
        if (!isMulti) {
            const findOp = options.find((op) => String(op.value) === String(code.masterCode));
            if (findOp) {
                handleChangeValue(findOp);
            } else {
                handleChangeValue(null);
            }
        } else {
            // 멀티일 경우 => 추후 처리
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
        <React.Fragment>
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
                inputProps={{ options, isMulti, isLoading: loading, searchIcon: searchIcon, onClickSearchIcon: handleClickSearchIcon, maxMenuHeight: maxMenuHeight }}
            />
            <CodeListModal value={value} show={modalShow} onHide={() => setModalShow(false)} onSave={handleClickSave} selection={isMulti ? 'multiple' : 'single'} />
        </React.Fragment>
    );
});

CodeAutocomplete.propTypes = propTypes;
CodeAutocomplete.defaultProps = defaultProps;

export default CodeAutocomplete;
