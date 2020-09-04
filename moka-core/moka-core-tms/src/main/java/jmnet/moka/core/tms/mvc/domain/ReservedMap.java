package jmnet.moka.core.tms.mvc.domain;

import java.util.HashMap;

public class ReservedMap extends HashMap<String, String> {
    private static final long serialVersionUID = 1564903336157022712L;
    private long lastLoaded;
    private long expireTime;
    private String lastModified;
    public ReservedMap(long expireTime) {
        this.lastLoaded = System.currentTimeMillis();
        this.expireTime = expireTime;
    }

    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    public boolean isExpired() {
        if ( System.currentTimeMillis() - this.lastLoaded > this.expireTime) {
            return true;
        }
        return false;
    }
}
