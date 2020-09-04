import React, { useRef } from 'react';
import clsx from 'clsx';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

/**
 * 관련기사본문뷰
 * @param {object} param0.classes 스타일
 * @param {boolean} param0.open 오픈여부
 * @param {func} param0.setOpen 오픈 조절함수
 * @param {object} param0.article 기사데이터
 */
const RelationArticleListView = ({ classes, open, setOpen, article }) => {
    const articleRef = useRef(null);

    const handleCloseBtn = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (articleRef.current) {
            setOpen(false);
        }
    };

    React.useEffect(() => {
        if (articleRef.current) {
            articleRef.current.scrollTop = 0;
        }
    }, [article]);

    return (
        <div
            className={clsx(classes.relArticleListView, {
                [classes.relArticleListViewShow]: open
            })}
            ref={articleRef}
        >
            <div
                role="button"
                tabIndex={0}
                className={classes.articleListViewClose}
                onClick={handleCloseBtn}
                onKeyDown={handleCloseBtn}
            >
                <Icon>close</Icon>
            </div>
            <div className={classes.articleTitleWrapper}>
                <Typography component="div" variant="h2" className={classes.articleTitle}>
                    {article.title}
                </Typography>
            </div>
            <Typography component="div" variant="h6" className={classes.articleBody}>
                {/* eslint-disable-next-line react/no-danger */}
                <p dangerouslySetInnerHTML={{ __html: article.contentsBody }}></p>
            </Typography>
        </div>
    );
};

export default RelationArticleListView;
