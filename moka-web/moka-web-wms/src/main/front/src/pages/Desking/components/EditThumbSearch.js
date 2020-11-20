import React from 'react';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaSearchInput } from '@components';

const EditThumbSearch = () => {
    return (
        <Form className="d-flex mb-2">
            <div className="mr-2" style={{ width: 62 }}>
                <MokaInput as="select" disabled>
                    <option>전체</option>
                </MokaInput>
            </div>

            <div className="mr-2" style={{ width: 140 }}>
                <MokaInput as="dateTimePicker" disabled />
            </div>

            <div className="mr-2" style={{ width: 140 }}>
                <MokaInput as="dateTimePicker" disabled />
            </div>

            <div className="mr-2" style={{ width: 150 }}>
                <MokaInput as="select" className="mr-2" disabled>
                    <option>등록 사진 외 3개</option>
                </MokaInput>
            </div>

            <div className="mr-2" style={{ width: 150 }}>
                <MokaInput as="select" className="mr-2" disabled>
                    <option>전체</option>
                </MokaInput>
            </div>

            <MokaSearchInput className="flex-fill" disabled />
        </Form>
    );
};

export default EditThumbSearch;
