import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import classNames from 'classnames';

const EmbedVideoComponent = (props) => {
    const { title, subtitle, link, ratio, ...rest } = props;
    // 1by1 4by3 16by9 21by9
    const ratioClasses = classNames({
        'embed-responsive': true,
        'embed-responsive-1by1': ratio === '1by1' ? true : false,
        'embed-responsive-4by3': ratio === '4by3' ? true : false,
        'embed-responsive-16by9': ratio === '16by9' ? true : false,
        'embed-responsive-21by9': ratio === '21by9' ? true : false,
    });

    return (
        <Card ratio={ratio} {...rest}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted ">{subtitle}</Card.Subtitle>
                <div className={ratioClasses}>
                    <iframe title={title} className="embed-responsive-item" src={link}></iframe>
                </div>
            </Card.Body>
        </Card>
    );
};

export default EmbedVideoComponent;
