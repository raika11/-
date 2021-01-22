import React from 'react';
import { MokaInput } from '@components';

const ContainerSelector = ({ container, contOptions, onChange, error }) => {
    return (
        <MokaInput as="select" name="container" value={container.containerSeq} onChange={onChange} isInvalid={error.container} invalidMessage={error.containerMessage}>
            <option hidden>컨테이너를 선택하세요</option>
            {contOptions.map((con) => (
                <option value={con.containerSeq} key={con.containerSeq}>
                    {con.containerName}
                </option>
            ))}
        </MokaInput>
    );
};

export default ContainerSelector;
