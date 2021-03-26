import React, { useImperativeHandle, forwardRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MokaInputLabel, MokaInput, MokaIcon } from '@components';

const RelArticleRenderer = forwardRef((params, ref) => {
    const [article, setArticle] = useState(params.node.data);

    /**
     * blur 시 row 업데이트
     * @param {object} e 이벤트
     */
    const handleChangeBlur = (e) => {
        params.api.applyTransaction({ update: [{ ...params.node.data, [e.target.name]: e.target.value }] });
    };

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setArticle({
            ...article,
            [name]: value,
        });

        if (name === 'relLinkTarget') {
            handleChangeBlur(e);
        }
    };

    /**
     * 관련기사 삭제
     */
    const handleDeleteArticle = () => {
        params.api.applyTransaction({ remove: [params.node.data] });
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setArticle(params.node.data || {});
                return true;
            },
        }),
        [],
    );

    return (
        <div key={article.totalId} className="py-2 pl-1 pr-2 d-flex align-items-center">
            {/* 기사 ID, 제목 노출 */}
            <div className="flex-fill">
                <MokaInputLabel
                    label="제목"
                    className="mb-2"
                    labelWidth={40}
                    name="relTitle"
                    onChange={handleChange}
                    value={article.relTitle}
                    inputProps={{ onBlur: handleChangeBlur }}
                />
                <div className="d-flex">
                    <MokaInputLabel
                        label="URL"
                        className="mr-2 flex-fill"
                        labelWidth={40}
                        name="relLink"
                        value={article.relLink}
                        onChange={handleChange}
                        inputProps={{ onBlur: handleChangeBlur }}
                    />
                    <Form.Row className="flex-shrink-0">
                        <MokaInput as="select" name="relLinkTarget" value={article.relLinkTarget} onChange={handleChange}>
                            <option value="S">본창</option>
                            <option value="N">새창</option>
                        </MokaInput>
                    </Form.Row>
                </div>
            </div>
            {/* 기사 삭제버튼 */}
            <div className="ml-2 flex-shrink-0">
                <Button variant="white" className="border-0 p-0 bg-transparent" onClick={handleDeleteArticle}>
                    <MokaIcon iconName="fas-minus-circle" />
                </Button>
            </div>
        </div>
    );
});

export default RelArticleRenderer;
