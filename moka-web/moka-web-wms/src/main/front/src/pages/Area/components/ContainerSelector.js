import React from 'react';
import Col from 'react-bootstrap/Col';
import { MokaInput } from '@components';

const ContainerSelector = ({ container, contOptions, onChange, error }) => {
    return (
        <Col xs={8} className="p-0 pl-2 pr-2">
            <MokaInput as="select" name="container" value={container.containerSeq} onChange={onChange} isInvalid={error.container} invalidMessage={error.containerMessage}>
                <option hidden>컨테이너를 선택하세요</option>
                {contOptions.map((con) => (
                    <option value={con.containerSeq} key={con.containerSeq}>
                        {con.containerName}
                    </option>
                ))}
            </MokaInput>
        </Col>
    );
};

export default ContainerSelector;
