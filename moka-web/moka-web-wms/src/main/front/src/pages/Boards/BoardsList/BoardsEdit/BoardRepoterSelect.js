import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaInputLabel, MokaAutocomplete } from '@components';

const BoardRepoterSelect = ({ ChannalList, SelectValue, OnChange }) => {
    const [selectValue, setSelectValue] = useState({});

    useEffect(() => {
        if (ChannalList.length > 0) {
            let tempSelectValue = ChannalList.filter((e) => e.value === String(SelectValue));
            if (tempSelectValue[0]) {
                setSelectValue(tempSelectValue[0]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ChannalList, SelectValue]);

    return (
        <>
            <Form.Row className="mb-2">
                <Col xs={2.5} className="p-0 pt-2">
                    <MokaInputLabel as="none" label="기자명"></MokaInputLabel>
                </Col>
                <MokaAutocomplete
                    options={ChannalList}
                    closeMenuOnSelect={true}
                    searchIcon={true}
                    // value={editData.channelId}
                    value={selectValue}
                    onChange={(e) => {
                        OnChange(e);
                    }}
                />
            </Form.Row>
        </>
    );
};

export default BoardRepoterSelect;
