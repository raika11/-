package jmnet.moka.core.tms.merge.item;

import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MspConstants;

public class TemplateItem extends MergeItem {

    private static final long serialVersionUID = 3506318437693503147L;

    public String getItemType() {
        return MspConstants.ITEM_TEMPLATE;
    }

    public String getItemId() {
        return this.get(ItemConstants.TEMPLATE_ID).toString();
    }

}
