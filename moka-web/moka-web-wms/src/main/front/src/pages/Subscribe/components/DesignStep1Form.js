import React from 'react';
import Form from 'react-bootstrap/Form';
import { MokaInput } from '@components';

const DesignStep1Form = () => {
    return (
        <div>
            <p className="mb-2">구독 제안할 서비스 또는 콘텐츠를 설정합니다.</p>
            <Form.Row className="mb-2">
                <MokaInput as="radio" name="type" id="radio-1" inputProps={{ label: '중앙일보' }} />
                <MokaInput as="radio" name="type" id="radio-2" inputProps={{ label: '기사' }} />
                <MokaInput as="radio" name="type" id="radio-3" inputProps={{ label: '기자' }} />
                <MokaInput as="radio" name="type" id="radio-4" inputProps={{ label: '패키지' }} />
                <MokaInput as="radio" name="type" id="radio-5" inputProps={{ label: '뉴스레터' }} />
                <MokaInput as="radio" name="type" id="radio-6" inputProps={{ label: 'J팟' }} />
                <MokaInput as="radio" name="type" id="radio-7" inputProps={{ label: '개별페이지(URL)' }} />
            </Form.Row>
        </div>
    );
};

export default DesignStep1Form;
