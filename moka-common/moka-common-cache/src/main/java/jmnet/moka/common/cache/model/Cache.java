package jmnet.moka.common.cache.model;

import java.util.HashMap;
import java.util.Map;

public class Cache {
	private long expire;
	private boolean enable;
	private Map<String, String> propertyMap;
	private String instanceClass;
	private String instanceName;
	private Map<String, Long> expireMap;
	
	public Cache() {
		this.propertyMap = new HashMap<String, String>();
		this.expireMap = new HashMap<String, Long>(16);
	}

	public long getExpire() {
		return expire;
	}

	public void setExpire(long expire) {
		this.expire = expire;
	}

	public boolean isEnable() {
		return enable;
	}

	public void setEnable(boolean enable) {
		this.enable = enable;
	}

	public String getInstanceClass() {
		return instanceClass;
	}

	public void setInstanceClass(String instanceClass) {
		this.instanceClass = instanceClass;
	}

	public String getInstanceName() {
		return instanceName;
	}

	public void setInstanceName(String instanceName) {
		this.instanceName = instanceName;
	}

	public Map<String, String> getPropertyMap() {
		return propertyMap;
	}

	public void setPropertyMap(Map<String, String> propertyMap) {
		this.propertyMap = propertyMap;
	}

	public Map<String, Long> getExpireMap() {
		return expireMap;
	}

	public void setExpireMap(Map<String, Long> expireMap) {
		this.expireMap = expireMap;
	}
	
}
