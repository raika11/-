import React, { forwardRef } from 'react';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css';
import 'react-summernote/lang/summernote-ko-KR';
import 'bootstrap';
import PropTypes from 'prop-types';
import { unescapeHtml } from '@utils/convertUtil';

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
        <div className="d-flex moka-summernote" ref={ref}>
            <ReactSummernote
                className="overflow-hidden flex-fill mb-0"
                value={contentValue ? unescapeHtml(contentValue) : '내용을 입력해주세요'}
                options={{
                    lang: 'ko-KR',
                    height: 250,
                    dialogsInBody: true,
                }}
                onChange={(value) => onChangeValue(value)}
                onImageUpload={(e) => onImageUpload(e)}
                // onBlur={(value) => onChangeValue(value)}
            />
        </div>
    );
});

BoardsSummernote.propTypes = propTypes;
BoardsSummernote.defaultProps = defaultProps;

export default BoardsSummernote;
