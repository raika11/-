import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import NewsLetterSummernote from './components/NewsLetterSummerNote';

/**
 * 뉴스레터 관리 > 뉴스레더 발송 관리 > 에디터
 */
const NewsLetterSendEditor = () => {
    const [data, setData] = useState('');
    return (
        <Form.Row className="mb-2">
            <Col className="p-0">
                <NewsLetterSummernote
                    contentValue={data}
                    onChangeValue={(value) => {
                        setData(value);
                    }}
                    // onImageUpload={(e) => summerNoteImageUpload(e)}
                />
            </Col>
        </Form.Row>
    );
};

export default NewsLetterSendEditor;
