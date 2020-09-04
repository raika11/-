package jmnet.moka.core.tms.merge.item;

public class ComponentAd {
    private String adId;
    private String adName;
    private int listParagraph;

    public ComponentAd(String adId, String adName, int listParagraph) {
        super();
        this.adId = adId;
        this.adName = adName;
        this.listParagraph = listParagraph;
    }

    public String getAdId() {
        return adId;
    }

    public String getAdName() {
        return adName;
    }

    public int getListParagraph() {
        return listParagraph;
    }

}
