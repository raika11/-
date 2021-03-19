import React, { forwardRef } from 'react';
import 'bootstrap';
import PropTypes from 'prop-types';
import ReactSummernote from 'react-summernote';
import 'react-summernote/lang/summernote-ko-KR';
import { unescapeHtml } from '@utils/convertUtil';

const propTypes = {
    contentValue: PropTypes.string,
    editChange: PropTypes.func,
    editImageUpload: PropTypes.func,
};

const defaultProps = {
    contentValue: '',
    editChange: false,
    editImageUpload: false,
};

/**
 * Summernote
 */
const BoardsSummernote = forwardRef((props, ref) => {
    const { contentValue, editChange, editImageUpload } = props;

    return (
        <div className="p-0 d-flex moka-summernote" ref={ref}>
            <ReactSummernote
                className="overflow-hidden flex-fill mb-0"
                value={contentValue !== '' ? unescapeHtml(contentValue) : contentValue}
                options={{
                    lang: 'ko-KR',
                    height: 250,
                    dialogsInBody: true,
                }}
                onChange={(value) => editChange(value)}
                onImageUpload={(e) => editImageUpload(e)}
            />
            {/* </div> */}
        </div>
    );
});

BoardsSummernote.propTypes = propTypes;
BoardsSummernote.defaultProps = defaultProps;

export default BoardsSummernote;
