package jmnet.moka.core.tms.merge.item;

import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;

public class AdItem extends MergeItem {
    private static final long serialVersionUID = 2273035980398075571L;

    public String getItemType() {
        return MokaConstants.ITEM_AD;
    }

    public String getItemId() {
        return this.get(ItemConstants.AD_ID).toString();
    }

}
