import React, { forwardRef } from 'react';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css';
import 'react-summernote/lang/summernote-ko-KR';
import 'bootstrap';
import PropTypes from 'prop-types';

const propTypes = {
    contentValue: PropTypes.string,
    onChangeValue: PropTypes.func,
    onImageUpload: PropTypes.func,
};

const defaultProps = {
    contentValue: '',
};

/**
 * Summernote
 */
const BoardsSummernote = forwardRef((props, ref) => {
    const { contentValue, onChangeValue, onImageUpload } = props;

    return (
        <ReactSummernote
            ref={ref}
            className="overflow-hidden flex-fill mb-0"
            value={contentValue || ''}
            options={{
                lang: 'ko-KR',
                height: 250,
                dialogsInBody: true,
            }}
            onChange={(value) => onChangeValue(value)}
            onImageUpload={(e) => onImageUpload(e)}
        />
    );
});

BoardsSummernote.propTypes = propTypes;
BoardsSummernote.defaultProps = defaultProps;

export default BoardsSummernote;
