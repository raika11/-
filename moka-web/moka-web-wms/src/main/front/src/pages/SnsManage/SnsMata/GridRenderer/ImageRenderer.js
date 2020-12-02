import React from 'react';
import Figure from 'react-bootstrap/Figure';
import { NewIcon } from '@components';

const ImageRenderer = ({ value: { image_url, new_flag } }) => {
    return (
        <>
            {new_flag && (
                <div style={{ position: 'absolute' }}>
                    <div style={{ position: 'relative', top: '-3px', left: '-3px' }}>
                        <NewIcon width={10} height={10} className="m-1" />
                    </div>
                </div>
            )}
            <Figure.Image className="mb-0" src={image_url} />
        </>
    );
};

export default ImageRenderer;
