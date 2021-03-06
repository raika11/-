import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel, MokaInput } from '@components';

const ArticleEtc = ({ bulkSiteList, articleService = {} }) => {
    const [bulkSiteObj, setBulkSiteObj] = useState({});

    useEffect(() => {
        // 벌크사이트 => obj
        setBulkSiteObj(
            bulkSiteList.reduce(
                (all, cu) => ({
                    ...all,
                    [cu.siteName]: cu,
                }),
                {},
            ),
        );
    }, [bulkSiteList]);

    return (
        <Form.Row className="mb-2">
            <Col xs={6} className="d-flex p-0">
                <MokaInputLabel label="벌크" as="none" />
                <div className="d-flex flex-column flex-fill">
                    <div>
                        <MokaInput as="checkbox" className="mr-2 float-left" inputProps={{ label: '기사', checked: bulkSiteObj['기사']?.bulkYn === 'Y', readOnly: true }} />
                        <MokaInput as="checkbox" className="float-left" inputProps={{ label: '이미지', checked: bulkSiteObj['이미지']?.bulkYn === 'Y', readOnly: true }} />
                    </div>
                    <div>
                        <MokaInput as="checkbox" className="mr-2 float-left" inputProps={{ label: '네이버', checked: bulkSiteObj['네이버']?.bulkYn === 'Y', readOnly: true }} />
                        <MokaInput as="checkbox" className="mr-2 float-left" inputProps={{ label: '다음', checked: bulkSiteObj['다음']?.bulkYn === 'Y', readOnly: true }} />
                        <MokaInput as="checkbox" className="mr-2 float-left" inputProps={{ label: '네이트', checked: bulkSiteObj['네이트']?.bulkYn === 'Y', readOnly: true }} />
                        <MokaInput as="checkbox" className="mr-2 float-left" inputProps={{ label: '줌', checked: bulkSiteObj['줌']?.bulkYn === 'Y', readOnly: true }} />
                        <MokaInput as="checkbox" className="float-left" inputProps={{ label: '기타', checked: bulkSiteObj['기타']?.bulkYn === 'Y', readOnly: true }} />
                    </div>
                </div>
            </Col>
            <Col xs={6} className="d-flex p-0">
                <hr className="vertical-divider" />
                <MokaInputLabel label="종류" as="none" />
                <div className="d-flex flex-column flex-fill">
                    <div>
                        <MokaInput as="checkbox" className="mr-2 float-left" inputProps={{ label: '로그인', checked: articleService?.loginFlag === 'Y', readOnly: true }} />
                        <MokaInput as="checkbox" className="float-left" inputProps={{ label: 'AB테스트용', readOnly: true }} />
                    </div>
                    <div>
                        <MokaInput as="checkbox" className="float-left" inputProps={{ label: '연재기사(번호: 000)', readOnly: true }} />
                    </div>
                </div>
            </Col>
        </Form.Row>
    );
};

export default ArticleEtc;
