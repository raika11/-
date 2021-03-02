import React, { useCallback, useEffect, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';
import { MokaInputLabel } from '@components';
import { API_PARAM_HINT_DATASET_SEQ, API_PARAM_HINT_BUSE_ID, API_PARAM_HINT_GIJA_ID, API_PARAM_HINT_SERIES_ID, API_PARAM_HINT_CODE_ID } from '@/constants';

const DatasetParameter = (props) => {
    const { dataApiParamShapes, onChange, dataApiParam, options, isInvalid, onChangeValid } = props;
    const [fieldInfos, setFieldInfos] = useState([]);

    /**
     * 동적으로 생성된 input의 값을 변경한다.
     * @param {Object} event javascript event
     * @param {String} name 변경 할 input name
     * @param defaultValue 기본 값
     */
    const handleChangeValue = (event, name, defaultValue) => {
        const { value } = event.target;
        // const { type } = fieldInfos[name];
        // let regex = /./;
        // if (type === 'number') {
        //     regex = /^[0-9\b]+$/;
        // }

        let tmp = { ...dataApiParam, [name]: value };

        // if (value === '' || regex.test(value)) {
        //     tmp = {
        //         ...tmp,
        //         [name]: value,
        //     };
        // }
        // if (tmp[name] === '') {
        //     delete tmp[name];
        //     if (defaultValue) {
        //         tmp = {
        //             ...tmp,
        //             [name]: defaultValue,
        //         };
        //     } else {
        //         delete tmp[name];
        //     }
        //}

        onChangeValid({ ...isInvalid, [name]: false });
        onChange(tmp);
    };

    /**
     * 자동완성폼 입력값 변경
     * @param {Object} event javascript event
     * @param {String} name 자동완성 컴포넌트 이름
     * @param value 변경 할 값
     */
    const handleChangeAutoCompleteValue = (event, name, value) => {
        const values = [];
        if (value) {
            value.map((data) => values.push(data.value));
        }
        onChange({ ...dataApiParam, [name]: values.join(',') });
    };

    /**
     * 파라미터의 힌트가 자동완성될 수 있는지 체크
     * @param hints hints
     * @returns {boolean} 자동완성 여부
     */
    const isHintAutocomplete = useCallback((hints) => {
        if (hints === API_PARAM_HINT_DATASET_SEQ) return true;
        if (hints === `${API_PARAM_HINT_DATASET_SEQ}s`) return true;
        if (hints === API_PARAM_HINT_BUSE_ID) return true;
        if (hints === `${API_PARAM_HINT_BUSE_ID}s`) return true;
        if (hints === API_PARAM_HINT_GIJA_ID) return true;
        if (hints === `${API_PARAM_HINT_GIJA_ID}s`) return true;
        if (hints === API_PARAM_HINT_SERIES_ID) return true;
        if (hints === `${API_PARAM_HINT_SERIES_ID}s`) return true;
        if (hints === API_PARAM_HINT_CODE_ID) return true;
        if (hints === `${API_PARAM_HINT_CODE_ID}s`) return true;
        return false;
    }, []);

    /**
     * 파라미터의 힌트가 복수인지 체크
     * @param hints hints
     * @returns {boolean} 복수 여부
     */
    const isHintMultiple = useCallback((hints) => {
        if (hints === API_PARAM_HINT_DATASET_SEQ) return false;
        if (hints === `${API_PARAM_HINT_DATASET_SEQ}s`) return true;
        if (hints === API_PARAM_HINT_BUSE_ID) return false;
        if (hints === `${API_PARAM_HINT_BUSE_ID}s`) return true;
        if (hints === API_PARAM_HINT_GIJA_ID) return false;
        if (hints === `${API_PARAM_HINT_GIJA_ID}s`) return true;
        if (hints === API_PARAM_HINT_SERIES_ID) return false;
        if (hints === `${API_PARAM_HINT_SERIES_ID}s`) return true;
        if (hints === API_PARAM_HINT_CODE_ID) return false;
        if (hints === `${API_PARAM_HINT_CODE_ID}s`) return true;
        return false;
    }, []);

    /**
     * 자동완성 hints 타입을 구분
     * @param hints 복수 hints / 단수 hints
     * @returns {string} hints 타입
     */
    const getDataType = useCallback((hints) => {
        if (hints === API_PARAM_HINT_DATASET_SEQ || hints === `${API_PARAM_HINT_DATASET_SEQ}s`) return API_PARAM_HINT_DATASET_SEQ;
        if (hints === API_PARAM_HINT_BUSE_ID || hints === `${API_PARAM_HINT_BUSE_ID}s`) return API_PARAM_HINT_BUSE_ID;
        if (hints === API_PARAM_HINT_GIJA_ID || hints === `${API_PARAM_HINT_GIJA_ID}s`) return API_PARAM_HINT_GIJA_ID;
        if (hints === API_PARAM_HINT_SERIES_ID || hints === `${API_PARAM_HINT_SERIES_ID}s`) return API_PARAM_HINT_SERIES_ID;
        if (hints === API_PARAM_HINT_CODE_ID || hints === `${API_PARAM_HINT_CODE_ID}s`) return API_PARAM_HINT_CODE_ID;
        return '';
    }, []);

    /**
     * 오버레이 라벨 생성
     */
    const renderLabel = ({ label, key }) => {
        return (
            <OverlayTrigger overlay={<Tooltip id={key}>{key}</Tooltip>} placement="left">
                <span>{label || key}</span>
            </OverlayTrigger>
        );
    };

    /**
     * 동적 입력창 렌더링
     * @param key 입력창을 만들 key 값
     * @returns {JSX.Element} 동적 입력창 생성 값
     */
    const render = (key) => {
        let renderer = null;
        const fieldInfo = fieldInfos[key];

        if (fieldInfo) {
            const { name, desc = '', defaultValue: apiDefaultValue, hints, require: required } = fieldInfo;

            // 자동완성가능여부 체크
            const isAutocomplete = isHintAutocomplete(hints);
            // 자동완성요소이면서, 다중인지여부 체크
            const isMultiple = isHintMultiple(hints);
            // 데이터 타입 체크
            const type = getDataType(hints);

            let value = apiDefaultValue;
            if (isAutocomplete) {
                if (dataApiParam && dataApiParam[name]) {
                    if (isAutocomplete) {
                        let param = [];
                        if (isMultiple) {
                            for (const d of dataApiParam[name].split(',')) {
                                param.push(options[type].filter((data) => data.value === d)[0]);
                            }
                        } else {
                            param = [{ seq: dataApiParam[name] }];
                        }
                        value = param;
                    }
                }

                renderer = (
                    <MokaInputLabel
                        key={`${name}_label`}
                        label={renderLabel({ label: desc, key })}
                        placeholder={`${desc || key}을(를) 입력하세요`}
                        className="flex-fill"
                        as="autocomplete"
                        inputProps={{ options: options[type], closeMenuOnSelect: true, isMulti: isMultiple, searchIcon: false }}
                        required={required}
                        value={value}
                        onChange={(value, event) => handleChangeAutoCompleteValue(event, name, value)}
                    />
                );
            } else {
                if (dataApiParam && dataApiParam[name]) {
                    value = dataApiParam[name];
                } else {
                    value = '';
                }

                renderer = (
                    <MokaInputLabel
                        label={renderLabel({ label: desc, key })}
                        className="flex-fill"
                        placeholder={`${desc || key}을(를) 입력하세요`}
                        value={value}
                        onChange={(event) => handleChangeValue(event, name, apiDefaultValue)}
                        required={required}
                        isInvalid={isInvalid[name]}
                    />
                );
            }
        }
        return (
            <Form.Row className="mb-2" key={key}>
                {renderer}
            </Form.Row>
        );
    };

    useEffect(() => {
        setFieldInfos(dataApiParamShapes || []);
    }, [dataApiParamShapes]);

    return Object.keys(fieldInfos).map((key) => {
        return render(key);
    });
};

export default DatasetParameter;
