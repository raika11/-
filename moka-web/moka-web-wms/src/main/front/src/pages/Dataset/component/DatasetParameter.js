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

const defaultSearch = {
    apiCodeId: null,
    searchType: 'datasetSeqLike',
    keyword: '',
    page: 0,
    size: 999,
    sort: 'datasetSeq,desc',
    listType: 'auto',
};

const DatasetParameter = (props) => {
    const { dataApiParamShapes, onChange, dataApiParam } = props;
    const [fieldInfos, setFieldInfos] = useState(dataApiParamShapes);
    const [options, setOptions] = useState({
        [API_PARAM_HINT_DATASET_SEQ]: [],
        [API_PARAM_HINT_BUSE_ID]: [],
        [API_PARAM_HINT_GIJA_ID]: [],
        [API_PARAM_HINT_SERIES_ID]: [],
        [API_PARAM_HINT_CODE_ID]: [],
    });

    const dispatch = useDispatch();

    const handleChangeValue = (event, key) => {
        const { value } = event.target;
        const { type } = fieldInfos[key];
        let regex = /./;
        if (type === 'number') {
            regex = /^[0-9\b]+$/;
        }
        if (value === '' || regex.test(value)) {
            handleChangeComponentValue(key, value);
        }
    };

    const handleChangeAutoCompleteValue = (event, key, value) => {
        handleChangeComponentValue(key, value);
    };

    const handleChangeComponentValue = (key, value) => {
        setFieldInfos(
            produce(fieldInfos, (draft) => {
                draft[key].defaultValue = value;
            }),
        );
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

    const test = useCallback(async () => {
        const response = await datasetAPI.getDatasetList({ search: defaultSearch });
        const datasetList = response.data.body.list;
        const datasetOption = [];

        for (const dataset of datasetList) {
            /*datasetOption.push({
                value: '' + dataset.datasetSeq,
                label: dataset.datasetName,
            });*/

            datasetOption.push({
                value: '' + dataset.datasetSeq,
                label: dataset.datasetName,
            });
        }
        //console.log(datasetOption);
        setOptions({ ...options, [API_PARAM_HINT_DATASET_SEQ]: datasetOption });
        //return datasetOption;
        //console.log(datasetList);
    });

    const responseCallback = ({ header, body }, type) => {
        if (header.success) {
            const option = [];
            body.list.map((data) => {
                option.push({
                    value: '' + data.datasetSeq,
                    label: data.datasetName,
                });
            });
            setOptions({ ...options, [API_PARAM_HINT_DATASET_SEQ]: option });
        } else {
        }
    };

    /**
     * 검색
     */
    const handleSearch = (search) => {
        dispatch(
            getDatasetListModal({
                search,
                callback: responseCallback,
            }),
        );
    };

    useEffect(() => {
        handleSearch(defaultSearch);
        //onChange(fieldInfos);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFieldInfos(dataApiParamShapes);
    }, [dataApiParamShapes]);

    const render = (key) => {
        let renderer = null;
        const fieldInfo = fieldInfos[key];
        if (fieldInfo) {
            //console.log(fieldInfo);
            const { name, desc = '', defaultValue: apiDefaultValue, hints, require: required } = fieldInfo;

            // 자동완성가능여부 체크
            const isAutocomplete = isHintAutocomplete(hints);
            // 자동완성요소이면서, 다중인지여부 체크
            const isMultiple = isHintMultiple(hints);
            // 데이터 타입 체크
            const type = getDataType(hints);

            if (isAutocomplete) {
                let value = apiDefaultValue;
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
                    } else {
                        value = dataApiParam[name];
                    }
                }
                console.log(key, value);
                console.log(key, apiDefaultValue);
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
                                onChange={(value, event) => {
                                    console.log(value);
                                    console.log(apiDefaultValue);
                                    handleChangeAutoCompleteValue(event, key, value);
                                }}
                            />
                        </Col>
                    </>
                );
            } else {
                renderer = (
                    <MokaInputLabel
                        label={desc}
                        labelWidth={80}
                        className="flex-fill mb-0 mr-2"
                        value={apiDefaultValue}
                        onChange={(event) => handleChangeValue(event, key)}
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
