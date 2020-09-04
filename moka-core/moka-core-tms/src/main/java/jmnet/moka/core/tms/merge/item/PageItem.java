package jmnet.moka.core.tms.merge.item;

import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MspConstants;

public class PageItem extends MergeItem {

    private static final long serialVersionUID = -3012644793161789063L;

    public String getItemType() {
        return MspConstants.ITEM_PAGE;
    }

    public String getItemId() {
        return this.get(ItemConstants.PAGE_ID).toString();
    }

}
