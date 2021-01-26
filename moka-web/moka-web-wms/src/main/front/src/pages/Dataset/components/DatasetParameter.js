import React, { useCallback, useEffect, useState } from 'react';
import { MokaInputLabel } from '@components';
import Form from 'react-bootstrap/Form';
import { API_PARAM_HINT_DATASET_SEQ, API_PARAM_HINT_BUSE_ID, API_PARAM_HINT_GIJA_ID, API_PARAM_HINT_SERIES_ID, API_PARAM_HINT_CODE_ID } from '@/constants';

const DatasetParameter = (props) => {
    const { dataApiParamShapes, onChange, dataApiParam, options, isInvalid, onChangeValid, loading } = props;
    const [fieldInfos, setFieldInfos] = useState(dataApiParamShapes);

    /**
     * 동적으로 생성된 input의 값을 변경한다.
     * @param {Object} event javascript event
     * @param {String} name 변경 할 input name
     * @param defaultValue 기본 값
     */
    const handleChangeValue = (event, name, defaultValue) => {
        const { value } = event.target;
        /*const { type } = fieldInfos[name];*/
        let regex = /./;
        /*if (type === 'number') {
            regex = /^[0-9\b]+$/;
        }*/

        let tmp = dataApiParam;
        onChangeValid({ ...isInvalid, [name]: false });
        if (value === '' || regex.test(value)) {
            tmp = {
                ...tmp,
                [name]: value,
            };
        }

        if (tmp[name] === '') {
            delete tmp[name];
            /*if (defaultValue) {
                tmp = {
                    ...tmp,
                    [name]: defaultValue,
                };
            } else {
                delete tmp[name];
            }*/
        }

        onChange(tmp);
    };

    /**
     *
     * @param {Object} event javascript event
     * @param {String} name 자동완성 컴포넌트 이름
     * @param value 변경 할 값
     */
    const handleChangeAutoCompleteValue = (event, name, value) => {
        if (value) {
            const values = [];
            value.map((data) => values.push(data.value));
            onChange({ ...dataApiParam, [name]: values.join(',') });
        } else {
            onChange(value);
        }
    };

    const isHintAutocomplete = useCallback(
        /**
         * 파라미터의 힌트가 자동완성될 수 있는지 체크
         * @param hints hints
         * @returns {boolean} 자동완성 여부
         */
        (hints) => {
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
        },
        [],
    );

    // 파라미터의 힌트가 복수인지 체크
    const isHintMultiple = useCallback(
        /**
         * 파라미터의 힌트가 복수인지 체크
         * @param hints hints
         * @returns {boolean} 복수 여부
         */
        (hints) => {
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
        },
        [],
    );

    const getDataType = useCallback(
        /**
         * 자동완성 hints 타입을 구분
         * @param hints 복수 hints / 단수 hints
         * @returns {string} hints 타입
         */
        (hints) => {
            if (hints === API_PARAM_HINT_DATASET_SEQ || hints === `${API_PARAM_HINT_DATASET_SEQ}s`) return API_PARAM_HINT_DATASET_SEQ;
            if (hints === API_PARAM_HINT_BUSE_ID || hints === `${API_PARAM_HINT_BUSE_ID}s`) return API_PARAM_HINT_BUSE_ID;
            if (hints === API_PARAM_HINT_GIJA_ID || hints === `${API_PARAM_HINT_GIJA_ID}s`) return API_PARAM_HINT_GIJA_ID;
            if (hints === API_PARAM_HINT_SERIES_ID || hints === `${API_PARAM_HINT_SERIES_ID}s`) return API_PARAM_HINT_SERIES_ID;
            if (hints === API_PARAM_HINT_CODE_ID || hints === `${API_PARAM_HINT_CODE_ID}s`) return API_PARAM_HINT_CODE_ID;
            return '';
        },
        [],
    );

    useEffect(() => {
        if (!loading) {
            setFieldInfos(dataApiParamShapes);
        }
    }, [dataApiParamShapes, loading]);

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
                        label={desc || ' '}
                        className="flex-fill"
                        as="autocomplete"
                        labelWidth={90}
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
                        label={desc || ' '}
                        labelWidth={90}
                        className="flex-fill mb-0"
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

    return (
        <>
            {Object.keys(fieldInfos).map((key) => {
                return render(key);
            })}
        </>
    );
};

export default DatasetParameter;
