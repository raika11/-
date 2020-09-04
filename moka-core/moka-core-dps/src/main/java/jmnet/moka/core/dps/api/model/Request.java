package jmnet.moka.core.dps.api.model;

public interface Request {
	
	public static String TYPE_DB = "db";
	public static String TYPE_URL = "url";
    public static String TYPE_SCRIPT = "script";
    public static String TYPE_PURGE = "purge";
    public static String TYPE_MODULE = "module";
	public static String TYPE_SAMPLE = "sample";
	
	public String getType();
	public boolean getAsync();
	public String getResultName();
	public Class<?> getHandlerClass();
	
}
