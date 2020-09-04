package jmnet.moka.core.common.purge.model;

public class PurgeUrl {
    private String domain;
    private String url;
    private boolean isRegExpr;

    public PurgeUrl(String domain, String url) {
        this(domain, url, false);
    }

    public PurgeUrl(String domain, String url, boolean isRegExpr) {
        super();
        this.domain = domain;
        this.url = url;
        this.isRegExpr = isRegExpr;
    }

    public String getDomain() {
        return domain;
    }

    public boolean isRegExpr() {
        return isRegExpr;
    }

    public void setRegExpr(boolean isRegExpr) {
        this.isRegExpr = isRegExpr;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }


}
