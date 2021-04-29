import { MokaInput, MokaInputLabel } from '@components';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useDebounce from '@hooks/useDebounce';

const propTypes = {
    /**
     * name prefix
     */
    namePrefix: PropTypes.string,
    /**
     * is disabled
     */
    disabled: PropTypes.bool,
    /**
     * Group A 데이터
     */
    aGroup: PropTypes.string,
    /**
     * Group B 데이터
     */
    bGroup: PropTypes.string,
    /**
     * Radio 버튼 개수
     */
    size: PropTypes.number,
};

const defaultProps = {
    namePrefix: '',
    disabled: false,
    aGroup: '',
    bGroup: '',
    size: 10,
};

const ABFixGroupAreaSelect = ({ namePrefix, disabled, aGroup, bGroup, size, onChange }) => {
    const [tempAGroup, setTempAGroup] = useState(aGroup === '' ? [] : aGroup.split(','));
    const [tempBGroup, setTempBGroup] = useState(bGroup === '' ? [] : bGroup.split(','));
    const handleDebounce = useDebounce(onChange, 100);

    return (
        <React.Fragment>
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <MokaInputLabel label="A그룹" labelWidth={40} as="none" />
                {[...Array(size)].map((x, idx) => (
                    <MokaInput
                        key={`fix-a-${idx}`}
                        value={idx}
                        as="radio"
                        id={`fix-a-${idx}`}
                        name={`ab${idx}`}
                        inputProps={{ label: String(idx), checked: tempAGroup.includes(`${idx}`) }}
                        disabled={disabled}
                        onChange={() => {
                            const changeAGroup = [...tempAGroup, String(idx)];
                            const changeBGroup = tempBGroup.filter((data) => data !== String(idx));
                            setTempAGroup(changeAGroup);
                            setTempBGroup(changeBGroup);
                            handleDebounce({ abtestFixGrpA: changeAGroup.join(','), abtestFixGrpB: changeBGroup.join(',') });
                        }}
                    />
                ))}
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <MokaInputLabel label="B그룹" labelWidth={40} as="none" />
                {[...Array(size)].map((x, idx) => (
                    <MokaInput
                        key={`fix-b-${idx}`}
                        value={idx}
                        as="radio"
                        name={`ab${idx}`}
                        id={`fix-b-${idx}`}
                        inputProps={{ label: String(idx), checked: tempBGroup.includes(`${idx}`) }}
                        disabled={disabled}
                        onChange={() => {
                            const changeAGroup = tempAGroup.filter((data) => data !== String(idx));
                            const changeBGroup = [...tempBGroup, String(idx)];
                            setTempBGroup(changeBGroup);
                            setTempAGroup(changeAGroup);

                            handleDebounce({ abtestFixGrpA: changeAGroup.join(','), abtestFixGrpB: changeBGroup.join(',') });
                        }}
                    />
                ))}
            </Form.Row>
        </React.Fragment>
    );
};

ABFixGroupAreaSelect.defaultProps = defaultProps;
ABFixGroupAreaSelect.propTypes = propTypes;

export default ABFixGroupAreaSelect;
