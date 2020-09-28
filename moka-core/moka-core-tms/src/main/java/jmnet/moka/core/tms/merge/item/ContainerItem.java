package jmnet.moka.core.tms.merge.item;

import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;

public class ContainerItem extends MergeItem {

    private static final long serialVersionUID = -896088079436157237L;

    public String getItemType() {
        return MokaConstants.ITEM_CONTAINER;
    }

    public String getItemId() {
        return this.get(ItemConstants.CONTAINER_ID).toString();
    }
}
