import React from 'react';
import Form from 'react-bootstrap/Form';
import { MokaInputLabel } from '@components';
import DatasetParameter from './DatasetParameter';

const OptionsForm = (props) => {
    const { dataset, setDataset, dataApiParam, dataApiParamShape, setDataApiParam, options, error, setError, loading } = props;

    /**
     * 입력 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setDataset({ ...dataset, [name]: value });
    };

    return (
        <React.Fragment>
            <h3 className="mb-3">데이터 설정</h3>
            <Form>
                {/* 데이터셋의 파라미터에 따라 변경됨 */}
                {dataset.autoCreateYn === 'Y' && dataApiParamShape && (
                    <DatasetParameter
                        dataApiParamShapes={dataApiParamShape}
                        dataApiParam={dataApiParam}
                        onChange={setDataApiParam}
                        options={options}
                        isInvalid={error}
                        onChangeValid={setError}
                        loading={loading}
                    />
                )}
                <MokaInputLabel
                    label="설명"
                    as="textarea"
                    name="description"
                    labelWidth={90}
                    className="mb-0"
                    inputClassName="resize-none"
                    inputProps={{ rows: 7 }}
                    value={dataset.description}
                    onChange={handleChangeValue}
                />
            </Form>
        </React.Fragment>
    );
};

export default OptionsForm;
