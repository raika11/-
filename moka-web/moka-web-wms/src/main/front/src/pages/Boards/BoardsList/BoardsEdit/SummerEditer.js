import React from 'react';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css'; // import styles

// Import bootstrap(v3 or v4) dependencies
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/js/dist/modal';

import 'bootstrap/dist/css/bootstrap.css';

const SummerEditer = () => {
    const tempEvent = (e) => {
        console.log(e);
    };

    return (
        <ReactSummernote
            value="Default value"
            options={{
                height: 350,
                dialogsInBody: false,
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'video']],
                    ['view', ['fullscreen', 'codeview']],
                ],
            }}
            onChange={(e) => tempEvent(e)}
        />
    );
};

export default SummerEditer;
