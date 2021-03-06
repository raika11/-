package jmnet.moka.core.tms.merge.item;

import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;

public class DatasetItem extends MergeItem {
    private static final long serialVersionUID = 3461661200470223250L;

    public String getItemType() {
        return MokaConstants.ITEM_DATASET;
    }

    public String getItemId() {
        return this.get(ItemConstants.DATASET_ID).toString();
    }

}
