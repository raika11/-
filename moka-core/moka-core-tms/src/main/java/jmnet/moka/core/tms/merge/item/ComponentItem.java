package jmnet.moka.core.tms.merge.item;

import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;

public class ComponentItem extends MergeItem {

    private static final long serialVersionUID = 7844344606132646735L;

    public String getItemType() {
        return MokaConstants.ITEM_COMPONENT;
    }

    public String getItemId() {
        return this.get(ItemConstants.COMPONENT_ID).toString();
    }
}
