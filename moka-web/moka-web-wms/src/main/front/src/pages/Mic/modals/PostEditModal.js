import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaInputLabel } from '@/components';
import ImageUploadButton from '../components/ImageUploadButton';

/**
 * 포스트 관리 모달
 */
const PostEditModal = (props) => {
    const { show, onHide, data } = props;

    const [writer, setWriter] = useState('');
    const [post, setPost] = useState('');
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [sum, setSum] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        if (data) {
            setWriter(data.writer);
            setPost(data.post);
        }
    }, [data]);

    return (
        <MokaModal
            width={500}
            size="md"
            show={show}
            onHide={onHide}
            title="사용자 포스트 관리"
            headerClassName="justify-content-start"
            buttons={[
                { text: '저장', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: onHide },
                { text: '삭제', variant: 'negative' },
            ]}
            draggable
        >
            <h3 className="mb-3 color-primary">'Row Title'</h3>
            <Form>
                <MokaInputLabel
                    label="작성자"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    name="writer"
                    inputProps={{ plaintext: true, readOnly: true }}
                    value={writer}
                    onChange={(e) => setWriter(e.target.value)}
                />
                <MokaInputLabel
                    label="단문"
                    labelClassName="d-flex justify-content-end"
                    inputClassName="resize-none"
                    className="mb-2"
                    as="textarea"
                    name="short"
                    inputProps={{ plaintext: true, readOnly: true, rows: 4 }}
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                />
                <MokaInputLabel label="페이지 URL" labelClassName="d-flex justify-content-end" className="mb-2" name="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                <MokaInputLabel
                    label="페이지 제목"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <MokaInputLabel
                    label="페이지 요약"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 3 }}
                    name="sum"
                    value={sum}
                    onChange={(e) => setSum(e.target.value)}
                />
                <Form.Row className="align-items-center">
                    <MokaInputLabel
                        label="페이지 이미지"
                        labelClassName="d-flex justify-content-end"
                        className="mr-2 flex-fill"
                        name="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                    <div>
                        <ImageUploadButton text="업로드" fileUrl={(url) => setImage(url)} className="mr-2" />
                        <Button variant="negative">삭제</Button>
                    </div>
                </Form.Row>
            </Form>
        </MokaModal>
    );
};

export default PostEditModal;
