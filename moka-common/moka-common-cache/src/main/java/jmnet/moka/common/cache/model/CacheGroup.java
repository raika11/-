package jmnet.moka.common.cache.model;

import java.util.ArrayList;
import java.util.List;

public class CacheGroup {
	private List<Cache> cacheList;
	private String name;
	private long gcInterval;
	
	public CacheGroup() {
		this.cacheList = new ArrayList<Cache>();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void addCache(Cache cache) {
		this.cacheList.add(cache);
	}
	
	public List<Cache> getCacheList() {
		return this.cacheList;
	}
	
	public long getGcInterval() {
		return gcInterval;
	}

	public void setGcInterval(long gcInterval) {
		this.gcInterval = gcInterval;
	}
	
}
