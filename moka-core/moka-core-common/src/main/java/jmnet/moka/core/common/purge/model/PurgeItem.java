package jmnet.moka.core.common.purge.model;

public class PurgeItem {
    private String domainId;
    private String itemType;
    private String itemId;

    public PurgeItem() {
    }

    public PurgeItem(String domainId, String itemType, String itemId) {
        this.domainId = domainId;
        this.itemType = itemType;
        this.itemId = itemId;
    }

    public void setDomainId(String domainId) {
        this.domainId = domainId;
    }
    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getDomainId() {
        return domainId;
    }

    public String getItemType() {
        return itemType;
    }

    public String getItemId() {
        return itemId;
    }

}
