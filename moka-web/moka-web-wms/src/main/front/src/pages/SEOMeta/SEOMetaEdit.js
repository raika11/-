import React, { useEffect, useState } from 'react';
import { MokaCard, MokaInputLabel } from '@components';
import { Form, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { initialState } from '@store/seoMeta';
import produce from 'immer';

const labelWidth = 50;
const SEOMetaEdit = () => {
    const [edit, setEdit] = useState(initialState.seoMeta);
    const { seoMeta } = useSelector((store) => ({
        seoMeta: store.seoMeta.seoMeta,
    }));

    const handleChangeValue = (name, value) => {
        console.log(name, value);
        setEdit(
            produce(edit, (draft) => {
                draft[name] = value;
            }),
        );
    };

    useEffect(() => {
        setEdit(seoMeta);
    }, [seoMeta]);

    return (
        <MokaCard title="공유 메타데이터 관리" className="flex-fill">
            <Form className="pb-2">
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            as="switch"
                            name="usedYn"
                            id="usedYn"
                            label="사용유무"
                            labelWidth={labelWidth}
                            inputProps={{ checked: edit.usedYn === 'Y' }}
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                const value = checked ? 'Y' : 'N';
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            label="제목"
                            name="title"
                            labelWidth={labelWidth}
                            value={edit.title}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            as="textarea"
                            label="설명"
                            name="summary"
                            labelWidth={labelWidth}
                            inputProps={{ rows: 8 }}
                            inputClassName="resize-none"
                            value={edit.summary}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            label="키워드"
                            name="keyword"
                            labelWidth={labelWidth}
                            value={edit.keyword}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            label="추가\n키워드"
                            name="addKeyword"
                            labelWidth={labelWidth}
                            value={edit.addKeyword}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default SEOMetaEdit;
