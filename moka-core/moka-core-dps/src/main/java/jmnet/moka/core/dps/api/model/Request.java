package jmnet.moka.core.dps.api.model;

public interface Request {
    String TYPE_DB = "db";
    String TYPE_URL = "url";
    String TYPE_SCRIPT = "script";
    String TYPE_PURGE = "purge";
    String TYPE_MODULE = "module";
    String TYPE_SAMPLE = "sample";
    String TYPE_API_CALL = "apiCall";

    String getType();

    boolean getAsync();

    String getResultName();

    Class<?> getHandlerClass();
}
