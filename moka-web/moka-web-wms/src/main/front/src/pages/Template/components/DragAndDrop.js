import React, { useRef, useState, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import style from '~/assets/jss/pages/Template/TemplateImageInputStyle';

const useStyles = makeStyles(style);

/**
 * 드래그앤드롭 컴포넌트
 * 참고 사이트
 * https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929
 * @param {node} props.children 자식
 * @param {string} props.overrideClassName css name
 * @param {function} props.handleDrop 파일드롭 후 콜백함수
 */
const DragAndDrop = (props) => {
    const { children, overrideClassName, handleDrop: optionalDropFunc } = props;
    const classes = useStyles();
    const dropRef = useRef();
    const dragCounter = useRef(0);
    const [dragging, setDragging] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current += 1;

        // 드래그한 아이템이 있는지 체크
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragging(true);
        }
    }, []);

    const handleDragOut = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current -= 1;
        if (dragCounter.current < 1) {
            setDragging(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const { files } = e.dataTransfer;
                if (typeof optionalDropFunc === 'function') {
                    optionalDropFunc(files);
                }
                e.dataTransfer.clearData();
                dragCounter.current = 0;
            }
        },
        [optionalDropFunc]
    );

    return (
        <div
            ref={dropRef}
            className={clsx(classes.dragAndDropRoot, overrideClassName)}
            onDrop={handleDrop}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
        >
            <div
                className={clsx({
                    [classes.dragging]: dragging
                })}
            />
            {children}
        </div>
    );
};

DragAndDrop.propType = {
    children: PropTypes.node,
    className: PropTypes.string,
    handleDrop: PropTypes.func
};

DragAndDrop.defaultProps = {
    children: undefined,
    className: undefined,
    handleDrop: undefined
};

export default DragAndDrop;
