import React from 'react';
import { MokaInputLabel } from '@components';
import DatasetParameter from './DatasetParameter';

/**
 * 데이터셋의 옵션셋팅
 */
const OptionsForm = (props) => {
    const { dataset, setDataset, options, error, setError, loading } = props;

    /**
     * 입력 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setDataset({ ...dataset, [name]: value });
    };

    /**
     * param 변경
     * @param {object} newParam 변경된 param
     */
    const handleChangeParam = (newParam) => {
        setDataset({
            ...dataset,
            dataApiParam: newParam,
        });
    };

    return (
        <React.Fragment>
            <h3 className="mb-3">데이터 설정</h3>
            <div>
                {/* 데이터셋의 파라미터에 따라 변경됨 */}
                {dataset.autoCreateYn === 'Y' && (
                    <DatasetParameter
                        dataApiParamShapes={dataset?.dataApiParamShape?.parameter}
                        dataApiParam={dataset?.dataApiParam}
                        onChange={handleChangeParam}
                        options={options}
                        isInvalid={error}
                        onChangeValid={setError}
                        loading={loading}
                    />
                )}
                <MokaInputLabel label="설명" as="textarea" name="description" inputProps={{ rows: 7 }} value={dataset.description} onChange={handleChangeValue} />
            </div>
        </React.Fragment>
    );
};

export default OptionsForm;
