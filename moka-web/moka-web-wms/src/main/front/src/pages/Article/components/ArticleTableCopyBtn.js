import React from 'react';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import copy from 'copy-to-clipboard';
import toast from '@utils/toastUtil';
import useClickPreventionOnDoubleClick from '@hooks/useClickPreventionOnDoubleClick';

/**
 * 기사테이블에 노출하는 카피 버튼 (1번 클릭 => 기사제목 복사, 2번 클릭 => 기사키 + 기사제목 복사)
 */
const ArticleTableCopyBtn = ({ artUrl, artTitle, className }) => {
    /**
     * 복사 함수
     */
    const [handleClickCopy, handleDoubleClickCopy] = useClickPreventionOnDoubleClick(
        () => {
            copy(artUrl);
            toast.success('기사 링크를 복사하였습니다');
        },
        () => {
            copy(`${artTitle}\n${artUrl}`);
            toast.success('제목과 기사 링크를 복사하였습니다');
        },
    );

    return (
        <Button size="sm" variant="outline-table-btn" className={clsx('flex-shrink-0 px-1', className)} onClick={handleClickCopy} onDoubleClick={handleDoubleClickCopy}>
            C
        </Button>
    );
};

export default ArticleTableCopyBtn;
