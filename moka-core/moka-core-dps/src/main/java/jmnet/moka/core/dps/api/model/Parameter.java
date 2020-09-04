package jmnet.moka.core.dps.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jmnet.moka.core.dps.api.ApiParser;

public class Parameter {
    private String name;
    private String type;
    private String desc;
    private String hints;
    private String filter;
    @JsonIgnore
    private String defaultValueStr;
    private Object defaultValue;
    private String evalStr;
    private boolean require;

    public Parameter(String name, String type, String desc, String hints, String filter,
            boolean require,
            String defaultValue, String evalStr) {
        this.name = name;
        this.type = type;
        this.desc = desc == null ? "" : desc;
        this.hints = hints == null ? "" : hints;
        this.filter = filter;
        this.require = require;
        this.defaultValueStr = defaultValue;
        this.evalStr = evalStr;
        if (defaultValue != null && defaultValue.length() > 0) {
            if (this.type.equals(ApiParser.PARAM_TYPE_NUMBER)) {
                this.defaultValue = Integer.parseInt(defaultValue);
            } else {
                this.defaultValue = defaultValue;
            }
        }
    }

    public String getName() {
        return this.name;
    }

    public String getFilter() {
        return this.filter;
    }

    public String getType() {
        return this.type;
    }

    public String getDesc() {
        return this.desc;
    }

    public String getHints() {
        return this.hints;
    }

    public Object getDefaultValue() {
        return this.defaultValue;
    }

    public String getDefaultValueStr() {
        return this.defaultValueStr;
    }

    public String getEvalStr() {
        return this.evalStr;
    }

    public boolean isRequire() {
        return require;
    }
}
