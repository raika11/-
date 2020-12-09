import React from 'react';
import Figure from 'react-bootstrap/Figure';
import { NewIcon } from '@components';

const AgGridThumbnailComponent = ({ src, isNew }) => {
    return (
        <>
            {isNew && (
                <div style={{ position: 'absolute' }}>
                    <div style={{ position: 'relative', top: '-3px', left: '-3px' }}>
                        <NewIcon width={10} height={10} className="m-1" />
                    </div>
                </div>
            )}
            <Figure.Image className="mb-0" src={src} style={{ width: 60, height: 50 }} />
        </>
    );
};

export default AgGridThumbnailComponent;
