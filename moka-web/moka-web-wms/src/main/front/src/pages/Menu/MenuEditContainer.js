import React from 'react';
import { MokaIconTabs } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import MenuEditContainerEdit from './MenuEditContainerEdit';

const MenuEditContainer = (props) => {
    const { handleClickDelete, menuSeq, depth, parentMenuId } = props;

    return (
        <>
            {/* 탭 */}
            <MokaIconTabs
                foldable={false}
                className="flex-fill"
                tabContentClass="w-100"
                height={CARD_DEFAULT_HEIGHT}
                tabs={[<MenuEditContainerEdit handleClickDelete={handleClickDelete} menuSeq={menuSeq} depth={depth} parentMenuId={parentMenuId} />]}
                tabNavWidth={48}
                tabNavPosition="right"
                tabNavs={[{ title: '메뉴정보', text: 'Info' }]}
            />
        </>
    );
};

export default MenuEditContainer;
