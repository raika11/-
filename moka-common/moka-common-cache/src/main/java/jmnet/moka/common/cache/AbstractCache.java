package jmnet.moka.common.cache;

import java.util.Map;

public abstract class AbstractCache implements Cacheable {
	protected String name;
	protected Map<String, Long> expireMap;
	protected long defaultExpire;
	protected Map<String, String> propertyMap;
	
	public AbstractCache(String name, Map<String, Long> expireMap, long defaultExpire, Map<String, String> propertyMap) {
		this.name = name;
		this.expireMap = expireMap;
		this.defaultExpire = defaultExpire;
		this.propertyMap = propertyMap;
	}
	
	public String getName() {
		return this.name;
	}
	
	public long getExpire(String type) {
		if ( this.expireMap == null) return defaultExpire;
		Long expire = this.expireMap.get(type);
		return expire == null ? this.defaultExpire :expire;
	}
	
	
}
