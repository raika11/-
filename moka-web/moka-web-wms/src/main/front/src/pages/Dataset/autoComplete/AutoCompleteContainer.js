import React from 'react';
import {
    API_PARAM_HINT_DATASET_SEQ,
    API_PARAM_HINT_BUSE_ID,
    API_PARAM_HINT_GIJA_ID,
    API_PARAM_HINT_SERIES_ID,
    API_PARAM_HINT_CODE_ID
} from '~/constants';
import DatasetAutoCompleteContainer from './dataset/DatasetAutoCompleteContainer';
import CodeAutoCompleteContainer from './code/CodeAutoCompleteContainer';

/**
 * 자동완성 텍스트필드 그리기
 * @param {*} props
 */
const AutoCompleteContainer = (props) => {
    const { name, desc, required, multiple, hints, value, error } = props;
    const { onChange } = props;

    // 데이타셋아이디
    if (hints === API_PARAM_HINT_DATASET_SEQ || hints === `${API_PARAM_HINT_DATASET_SEQ}s`) {
        return (
            <DatasetAutoCompleteContainer
                key={`autocomplete-parameter-${name}`}
                name={name}
                label={desc}
                required={required}
                multiple={multiple}
                value={value}
                onChange={onChange}
                error={error}
            />
        );
    }
    // 부서아이디
    if (hints === API_PARAM_HINT_BUSE_ID || hints === `${API_PARAM_HINT_BUSE_ID}s`) {
        return null;
    }
    // 기자아이디
    if (hints === API_PARAM_HINT_GIJA_ID || hints === `${API_PARAM_HINT_GIJA_ID}s`) {
        return null;
    }
    // 시리즈아이디
    if (hints === API_PARAM_HINT_SERIES_ID || hints === `${API_PARAM_HINT_SERIES_ID}s`) {
        return null;
    }
    // 분류아이디
    if (hints === API_PARAM_HINT_CODE_ID || hints === `${API_PARAM_HINT_CODE_ID}s`) {
        return (
            <CodeAutoCompleteContainer
                key={`autocomplete-parameter-${name}`}
                name={name}
                label={desc}
                required={required}
                multiple={multiple}
                value={value}
                onChange={onChange}
                error={error}
            />
        );
    }
    return null;
};

export default AutoCompleteContainer;
