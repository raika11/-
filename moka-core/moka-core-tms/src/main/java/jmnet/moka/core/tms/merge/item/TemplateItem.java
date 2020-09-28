package jmnet.moka.core.tms.merge.item;

import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;

public class TemplateItem extends MergeItem {

    private static final long serialVersionUID = 3506318437693503147L;

    public String getItemType() {
        return MokaConstants.ITEM_TEMPLATE;
    }

    public String getItemId() {
        return this.get(ItemConstants.TEMPLATE_ID).toString();
    }

}
