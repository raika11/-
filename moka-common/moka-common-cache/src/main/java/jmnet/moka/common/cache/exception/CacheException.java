package jmnet.moka.common.cache.exception;

public class CacheException extends Exception {

	private static final long serialVersionUID = -7284442998682648063L;

	public CacheException(String message, Exception cause) {
		super(message, cause);
	}

    public CacheException(String message) {
		super(message);
	}
				
}
