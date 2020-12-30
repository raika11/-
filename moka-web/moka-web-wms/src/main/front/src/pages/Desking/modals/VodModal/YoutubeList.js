import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaInput } from '@components';

const YoutubeList = ({ youtubeUrl, setYoutubeUrl }) => {
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setYoutubeUrl({
            ...youtubeUrl,
            [name]: value,
        });
    };

    return (
        <div className="px-card pt-3">
            <p className="text-positive mb-0">※&nbsp;입력예제</p>
            <p className="mb-2">https://www.youtube.com/embed/-WWWIWDD0G44</p>

            <Row className="m-0">
                <Col xs={9} className="p-0 pr-2">
                    <MokaInput name="url" value={youtubeUrl.url} onChange={handleChangeValue} className="ft-12" />
                </Col>
                <Col xs={3} className="p-0">
                    <MokaInput as="select" name="option" className="ft-12" value={youtubeUrl.option} onChange={handleChangeValue}>
                        <option value="">멈춤재생</option>
                        <option value="?autoplay=1">자동재생</option>
                    </MokaInput>
                </Col>
            </Row>
        </div>
    );
};

export default YoutubeList;
