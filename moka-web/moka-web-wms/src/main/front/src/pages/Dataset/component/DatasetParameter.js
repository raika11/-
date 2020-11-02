import React, { useCallback, useEffect, useState } from 'react';
import { MokaAutocomplete, MokaInputLabel } from '@components';
import Form from 'react-bootstrap/Form';
import produce from 'immer';
import { Col } from 'react-bootstrap';
import clsx from 'clsx';
import * as datasetAPI from '@store/dataset/datasetApi';
import { API_PARAM_HINT_DATASET_SEQ, API_PARAM_HINT_BUSE_ID, API_PARAM_HINT_GIJA_ID, API_PARAM_HINT_SERIES_ID, API_PARAM_HINT_CODE_ID } from '@/constants';
import { getDatasetListModal, initialState } from '@store/dataset';
import { useDispatch } from 'react-redux';

const DatasetParameter = (props) => {
    const { dataApiParamShapes, onChange, dataApiParam, options } = props;
    const [fieldInfos, setFieldInfos] = useState(dataApiParamShapes);
    const dispatch = useDispatch();

    const handleChangeValue = (event, name, defaultValue) => {
        const { value } = event.target;
        const { type } = fieldInfos[name];
        let regex = /./;
        if (type === 'number') {
            regex = /^[0-9\b]+$/;
        }

        let tmp = dataApiParam;

        if (value === '' || regex.test(value)) {
            tmp = {
                ...tmp,
                [name]: value,
            };
        }

        if (tmp[name] === '') {
            if (defaultValue) {
                tmp = {
                    ...tmp,
                    [name]: defaultValue,
                };
            } else {
                delete tmp[name];
            }
        }

        onChange(tmp);
    };

    const handleChangeAutoCompleteValue = (event, name, value) => {
        if (value) {
            const values = [];
            value.map((data) => values.push(data.value));
            onChange({ ...dataApiParam, [name]: values.join(',') });
        } else {
            onChange(value);
        }
    };

    // 파라미터의 힌트가 자동완성될 수 있는지 체크
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

    // 파라미터의 힌트가 복수인지 체크
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

    // 파라미터의 힌트가 복수인지 체크
    const getDataType = useCallback((hints) => {
        if (hints === API_PARAM_HINT_DATASET_SEQ || hints === `${API_PARAM_HINT_DATASET_SEQ}s`) return API_PARAM_HINT_DATASET_SEQ;
        if (hints === API_PARAM_HINT_BUSE_ID || hints === `${API_PARAM_HINT_BUSE_ID}s`) return API_PARAM_HINT_BUSE_ID;
        if (hints === API_PARAM_HINT_GIJA_ID || hints === `${API_PARAM_HINT_GIJA_ID}s`) return API_PARAM_HINT_GIJA_ID;
        if (hints === API_PARAM_HINT_SERIES_ID || hints === `${API_PARAM_HINT_SERIES_ID}s`) return API_PARAM_HINT_SERIES_ID;
        if (hints === API_PARAM_HINT_CODE_ID || hints === `${API_PARAM_HINT_CODE_ID}s`) return API_PARAM_HINT_CODE_ID;
        return '';
    }, []);

    useEffect(() => {
        setFieldInfos(dataApiParamShapes);
    }, [dataApiParamShapes]);

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
                            dataApiParam[name].split(',').map((d) => {
                                param.push(options[type].filter((data) => data.value === d)[0]);
                            });
                        } else {
                            param = [{ seq: dataApiParam[name] }];
                        }
                        value = param;
                    }
                }

                renderer = (
                    <>
                        <Form.Label className={clsx('px-0', 'mb-0', 'position-relative', 'text-right', 'mr-3')} style={{ width: 80 }} key={`${name}_label`}>
                            {required && <span className="required-text">*</span>}
                            {desc}
                        </Form.Label>
                        <Col xs={10}>
                            <MokaAutocomplete
                                key={`${name}_select`}
                                options={options[type]}
                                closeMenuOnSelect={true}
                                isMulti={isMultiple}
                                searchIcon={true}
                                value={value}
                                onChange={(value, event) => handleChangeAutoCompleteValue(event, name, value)}
                                required={required}
                            />
                        </Col>
                    </>
                );
            } else {
                if (dataApiParam && dataApiParam[name]) {
                    value = dataApiParam[name];
                }

                renderer = (
                    <MokaInputLabel
                        label={desc}
                        labelWidth={80}
                        className="flex-fill mb-0 mr-2"
                        value={value}
                        onChange={(event) => handleChangeValue(event, name, apiDefaultValue)}
                        required={required}
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
