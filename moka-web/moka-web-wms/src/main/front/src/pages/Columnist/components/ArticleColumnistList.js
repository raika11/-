import React, { forwardRef } from 'react';
import clsx from 'clsx';
import ArticleColumnistSearch from './ArticleColumnistSearch';
import ArticleColumnistAgGrid from './ArticleColumnistAgGrid';

const ArticleColumnistList = forwardRef((props, ref) => {
    const { className, selectedComponent, dropTargetAgGrid, onDragStop, show } = props;

    return (
        <div className={clsx('d-flex flex-column h-100 py-3 px-card', className)}>
            <ArticleColumnistSearch selectedComponent={selectedComponent} show={show} />
            <ArticleColumnistAgGrid ref={ref} dropTargetAgGrid={dropTargetAgGrid} onDragStop={onDragStop} />
        </div>
    );
});

export default ArticleColumnistList;
