import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaInput } from '@components';

const YoutubeList = ({ youtubeUrl, setYoutubeUrl }) => {
    const [option, setOption] = useState('');

    return (
        <div className="px-3">
            <p className="text-positive mb-0">※&nbsp;입력예제</p>
            <p className="mb-2">https://www.youtube.com/embed/-WWWIWDD0G44</p>

            <Row className="m-0">
                <Col xs={9} className="p-0 pr-2">
                    <MokaInput value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
                </Col>
                <Col xs={3} className="p-0">
                    <MokaInput as="select" value={option} onChange={(e) => setOption(e.target.value)}>
                        <option>멈춤재생</option>
                    </MokaInput>
                </Col>
            </Row>
        </div>
    );
};

export default YoutubeList;
