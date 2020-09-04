import React from 'react';

const Thumbnail = ({ params }) => {
    return (
        <span style={{ width: '50px', height: '48px', display: 'flex', alignItems: 'center' }}>
            <img width="50" src="http://img.com/{params.data.thumbnailFileName}" alt="이미지" />
        </span>
    );
};

export default Thumbnail;
