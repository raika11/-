package jmnet.moka.core.common.purge.model;

public class PurgeResult {
    public static final int PURGE_FAIL = -1;
    private String name;
    private boolean success;
    private int responseCode;
    private String responseMessage;

    public PurgeResult(String name) {
        super();
        this.name = name;
    }
    public PurgeResult(String name, boolean success, int responseCode, String responseMessage) {
        super();
        this.name = name;
        this.success = success;
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public int getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(int responseCode) {
        this.responseCode = responseCode;
    }

    public String getResponseMessage() {
        return responseMessage;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }


}
