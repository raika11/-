package jmnet.moka.common.cache;

import java.io.Serializable;

public class CacheObject implements Serializable {
	private static final long serialVersionUID = -8424141649376821492L;
	private String key;
	private String value;
    private long expire;
	private long created;
	
    public CacheObject(String key, String value, long expire) {
		this.key = key;
		this.value = value;
        this.expire = expire;
		this.created = System.currentTimeMillis();
	}
	
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.created = System.currentTimeMillis();
		this.value = value;
	}

    public boolean isExpired() {
        if (expire <= 0 || expire > System.currentTimeMillis() - this.created) {
            return false;
        } else {
            return true;
        }
	}
}
