package jmnet.moka.core.dps.excepton;

public class ApiException extends Exception {

	private static final long serialVersionUID = -7284442998682648063L;
	private String path;
	private String id;

	public ApiException(String message, String path, String id) {
		super(message);
		this.path = path;
		this.id = id;
	}

	public String getPath(){
		return this.path;
	}
	
	public String getId() {
		return this.id;
	}
}
