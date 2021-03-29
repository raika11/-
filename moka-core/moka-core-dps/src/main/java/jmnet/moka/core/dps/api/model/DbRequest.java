package jmnet.moka.core.dps.api.model;

import java.util.Arrays;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.dps.api.handler.DbRequestHandler;

public class DbRequest extends AbstractRequest {

    public final static String DML_TYPE_SELECT = "select";
    public final static String DML_TYPE_PROCEDURE = "sp";
    public final static String DML_TYPE_INSERT = "insert";
    public final static String DML_TYPE_UPDATE = "update";
    public final static String DML_TYPE_DELETE = "delete";
    private final static String[] DML_TYPES = {DML_TYPE_SELECT, DML_TYPE_PROCEDURE, DML_TYPE_INSERT, DML_TYPE_UPDATE, DML_TYPE_DELETE};
    private boolean eval;
    private String setNames;
    private String mapperId;
//    private boolean total;
    private String total;
    private String dmlType;

    public DbRequest(String type, boolean eval, boolean async, String resultName, String setNames, String mapperId, String total, String dmlType) {
        super(type, async, resultName);
        this.eval = eval;
        this.setNames = setNames;
        this.mapperId = mapperId;
        this.total = total;
        if (dmlType == null || dmlType.length() == 0) {
            this.dmlType = DML_TYPE_SELECT;
        } else if (Arrays
                .asList(DML_TYPES)
                .contains(dmlType)) {
            this.dmlType = dmlType;
        } else {
            this.dmlType = DML_TYPE_SELECT;
        }
    }

    public boolean getEval() {
        return this.eval;
    }

    public String getDmlType() {
        return this.dmlType;
    }

    public String getSetNames() {
        return this.setNames;
    }

    public String getResultName() {
        if (this.isTotal()) {
            return ApiResult.MAIN_TOTAL;
        }
        return this.resultName;
    }

    public boolean isTotal() {
        return this.total.equalsIgnoreCase("Y");
    }

    public String getTotal() {
        return this.total;
    }

    public String getMapperId() {
        return this.mapperId;
    }

    @Override
    public Class<?> getHandlerClass() {
        return DbRequestHandler.class;
    }

    public String toString() {
        return String.join("/", this.type, this.dmlType, this.mapperId);
    }
}
