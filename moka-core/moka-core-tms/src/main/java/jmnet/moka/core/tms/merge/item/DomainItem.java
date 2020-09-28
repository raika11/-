package jmnet.moka.core.tms.merge.item;

import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;

public class DomainItem extends MergeItem {

    private static final long serialVersionUID = -4025386041152662828L;

    public DomainItem() {
    }

    public DomainItem(String domainId, String domainUrl, String apiHost, String apiPath) {
        this.put(ItemConstants.DOMAIN_ID, domainId);
        this.put(ItemConstants.DOMAIN_URL, domainUrl);
        this.put(ItemConstants.DOMAIN_API_HOST, apiHost);
        this.put(ItemConstants.DOMAIN_API_PATH, apiPath);
    }

    public String getItemType() {
        return MokaConstants.ITEM_DOMAIN;
    }

    public String getItemId() {
        return this.getString(ItemConstants.DOMAIN_ID);
    }

    public String getApiHost() {
        return this.getString(ItemConstants.DOMAIN_API_HOST);
    }

    public String getApiPath() {
        return this.getString(ItemConstants.DOMAIN_API_PATH);
    }
}
