package jmnet.moka.core.common.user;

import java.util.List;

public class MspUser {
	private String userId;
	private String password;
	private boolean admin;
	private List<String> domainIds;
	private List<String> volumes;
	
	public List<String> getDomainIds() {
		return domainIds;
	}
	public void setDomainIds(List<String> domainIds) {
		this.domainIds = domainIds;
	}
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public boolean isAdmin() {
		return admin;
	}
	public void setAdmin(boolean admin) {
		this.admin = admin;
	}
	public List<String> getVolumes() {
		return volumes;
	}
	public void setVolumes(List<String> volumes) {
		this.volumes = volumes;
	}
	
}
