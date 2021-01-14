import React from 'react';
import * as ImageEditor from '@moka/tui-image-editor/dist/@moka/tui-image-editor';
import ReactDOM from 'react-dom';
import toast from '@utils/toastUtil';
import { MokaImageEditor } from '@components';
import { IMAGE_PROXY_API } from '@/constants';

export const imageEditor = {
    create: (imageSrc, onApply, options) => {
        if (imageSrc) {
            const hostname = document.location.hostname.split('.');
            let domain = '';
            for (let i = 1; i < hostname.length; i++) {
                domain += `.${hostname[i]}`;
            }
            if (!imageSrc.startsWith('blob') && imageSrc.indexOf(domain) <= 0) {
                imageSrc = IMAGE_PROXY_API + imageSrc;
            }
            ReactDOM.render(<MokaImageEditor />, document.getElementById('mokaImageEditor'));
            new ImageEditor('.image-editor', {
                includeUI: {
                    title: '이미지 편집',
                    lang: 'ko-KR',
                    loadImage: {
                        path: imageSrc,
                        name: 'editImage',
                    },
                    initMenu: 'filter',
                    menuBarPosition: 'bottom',
                    isDownloadButton: true,
                    uiSize: {
                        width: '1000px',
                        height: '700px',
                    },
                    etc: {
                        crop: {
                            width: options.cropWidth,
                            height: options.cropHeight,
                        },
                    },
                },

                selectionStyle: {
                    cornerStyle: 'circle',
                    cornerSize: 16,
                    cornerColor: '#fff',
                    cornerStrokeColor: '#fff',
                    transparentCorners: false,
                    lineWidth: 2,
                    borderColor: '#fff',
                },
                cssMaxWidth: 800,
                cssMaxHeight: 800,
                usageStatistics: false,
                callback: {
                    apply: (imgUrl, name) => {
                        if (onApply) {
                            onApply(imgUrl, name);
                        }
                        ReactDOM.unmountComponentAtNode(document.getElementById('mokaImageEditor'));
                    },
                    cancel: () => {
                        ReactDOM.unmountComponentAtNode(document.getElementById('mokaImageEditor'));
                    },
                },
            });
        } else {
            toast.error('이미지 경로가 올바르지 않습니다.');
        }
    },
};

export default imageEditor;
