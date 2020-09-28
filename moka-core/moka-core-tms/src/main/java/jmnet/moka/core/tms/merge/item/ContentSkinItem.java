package jmnet.moka.core.tms.merge.item;

import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;

public class ContentSkinItem extends MergeItem {

    private static final long serialVersionUID = 1668733134682932848L;

    public String getItemType() {
        return MokaConstants.ITEM_CONTENT_SKIN;
    }

    public String getItemId() {
        return this.get(ItemConstants.SKIN_ID).toString();
    }

}
