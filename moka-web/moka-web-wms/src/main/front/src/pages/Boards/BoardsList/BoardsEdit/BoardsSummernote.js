import React, { Suspense, forwardRef, useEffect } from 'react';
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

// Summernote 컴포 넌트.
const BoardsSummernote = forwardRef((props, ref) => {
    const { contentValue, editChange, editImageUpload } = props;

    return (
        <Suspense>
            <div className="p-0 d-flex moka-summernote">
                {/* <div className="d-flex moka-summernote"> */}
                <ReactSummernote
                    value={contentValue !== '' ? unescapeHtml(contentValue) : contentValue}
                    options={{
                        lang: 'ko-KR',
                        height: 250,
                        dialogsInBody: true,
                    }}
                    onChange={(value) => {
                        editChange(value);
                    }}
                    onImageUpload={(e) => {
                        editImageUpload(e);
                    }}
                />
                {/* </div> */}
            </div>
        </Suspense>
    );
});

BoardsSummernote.propTypes = propTypes;
BoardsSummernote.defaultProps = defaultProps;

export default BoardsSummernote;
