import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { WmsTextField } from '~/components';
import {
    API_PARAM_HINT_DATASET_SEQ,
    API_PARAM_HINT_BUSE_ID,
    API_PARAM_HINT_GIJA_ID,
    API_PARAM_HINT_SERIES_ID,
    API_PARAM_HINT_CODE_ID
} from '~/constants';
import commonStyle from '~/assets/jss/commonStyle';
import AutoCompleteContainer from '../autoComplete/AutoCompleteContainer';
import { isError } from '~/utils/errorUtil';

const DatasetParameter = (props) => {
    const { edit, onChange, error } = props;
    const useStyle = makeStyles(commonStyle);
    const classes = useStyle();

    // 유효성 에러 목록
    let validList = null;
    if (error && error.header && !error.header.success) {
        if (Array.isArray(error.body.list)) {
            validList = error.body.list;
        }
    }

    // 자동완성파라미터 변경
    const handleAutoChange = useCallback(
        (e, newValue, targetName) => {
            const parseValue = Array.isArray(newValue)
                ? newValue.map((v) => v.seq).toString()
                : newValue.seq;
            let param = {
                ...edit.dataApiParam,
                [targetName]: parseValue
            };
            if (!newValue) {
                delete param[targetName]; // 파라미터 값이 없으면 키는 지운다.
            }
            onChange('dataApiParam', param);
        },
        [edit.dataApiParam, onChange]
    );

    // 일반파라미터 변경
    const handleChange = useCallback(
        (e) => {
            let param = {
                ...edit.dataApiParam,
                [e.target.name]: e.target.value
            };
            if (!e.target.value) {
                delete param[e.target.name]; // 파라미터 값이 없으면 키는 지운다.
            }
            onChange('dataApiParam', param);
        },
        [edit.dataApiParam, onChange]
    );

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

    const renderParameter = (api) => {
        // 파라미터 정보 조회
        const {
            name,
            type,
            desc = '',
            hints,
            // filter,
            defaultValue: apiDefaultValue,
            require: required
        } = api;

        // 자동완성가능여부 체크
        const isAutocomplete = isHintAutocomplete(hints);

        // 자동완성요소이면서, 다중인지여부 체크
        const isMultiple = isHintMultiple(hints);

        // 기본값
        const defaultValue = isMultiple
            ? apiDefaultValue
                ? apiDefaultValue.split(',')
                : []
            : apiDefaultValue || '';

        // 기존에 지정된 파라미터 값
        let value = null;
        if (edit.dataApiParam && edit.dataApiParam[name]) {
            if (isAutocomplete) {
                let param = [];
                if (isMultiple) {
                    param = edit.dataApiParam[name].split(',').map((d) => {
                        return { seq: d };
                    });
                } else {
                    param = [{ seq: edit.dataApiParam[name] }];
                }
                value = param;
            } else {
                value = edit.dataApiParam[name];
            }
        } else {
            value = defaultValue;
        }

        return (
            <div key={`container-parameter-${name}`} className={classes.mb8}>
                {isAutocomplete && (
                    <AutoCompleteContainer
                        name={name}
                        desc={desc}
                        required={required}
                        multiple={isMultiple}
                        hints={hints}
                        value={value}
                        onChange={handleAutoChange}
                        error={validList ? isError(validList, `dataApiParam.${name}`) : false}
                    />
                )}
                {!isAutocomplete && (
                    <WmsTextField
                        key={`text-parameter-${name}`}
                        width="700"
                        labelWidth="100"
                        placeholder={`${desc} 입력하세요`}
                        label={desc}
                        name={name}
                        onChange={handleChange}
                        inputProps={{ type: `${type}` }}
                        value={value}
                        required={required}
                        error={validList ? isError(validList, `dataApiParam.${name}`) : false}
                    />
                )}
            </div>
        );
    };

    return (
        <>
            {/** 자동완성 텍스트 필드 */}
            {Object.keys(edit.dataApiParamShape).map((paramKey) =>
                renderParameter(edit.dataApiParamShape[paramKey])
            )}
        </>
    );
};

export default DatasetParameter;
