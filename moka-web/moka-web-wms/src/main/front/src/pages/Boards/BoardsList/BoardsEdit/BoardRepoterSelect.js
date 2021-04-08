import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaInputLabel, MokaAutocomplete } from '@components';

/**
 * 게시판 관리 > 게시글 관리 > 기자 선택
 */
const BoardRepoterSelect = ({ channalList, selectValue, onChange }) => {
    const [value, setValue] = useState({});

    useEffect(() => {
        if (selectValue) {
            let tempSelectValue = channalList.filter((e) => e.value === String(selectValue));
            if (tempSelectValue[0]) {
                setValue(tempSelectValue[0]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channalList, selectValue]);

    return (
        <Form.Row className="mb-2 align-items-center">
            <MokaInputLabel as="none" label="기자명" />
            <MokaAutocomplete
                options={channalList}
                closeMenuOnSelect
                value={value}
                onChange={(value, event) => {
                    setValue(value);
                    onChange(value);
                }}
            />
        </Form.Row>
    );
};

export default BoardRepoterSelect;
