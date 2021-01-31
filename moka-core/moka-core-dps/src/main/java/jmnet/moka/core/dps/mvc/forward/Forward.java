package jmnet.moka.core.dps.mvc.forward;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Pattern;
import javax.servlet.http.HttpServletRequest;

public class Forward {
    private Map<String, String> parameterMap;
    private List<String> variableList ;
    private String path;
    private Pattern pattern;
    private String description;
    private String apiPath;
    private String apiId;

    public Forward(String path, String description, String apiPath, String apiId) {
        this.path = path;
        this.description = description;
        this.apiPath = apiPath;
        this.apiId = apiId;
        this.parameterMap = new LinkedHashMap<String, String>(16);
        setPatternAndVariables();

    }

    private void setPatternAndVariables() {
        this.pattern = Pattern.compile(this.path.replaceAll("\\{.*\\}",".*"));
        String[] splits = path.split("\\/");
        if ( splits.length > 0) {
            this.variableList = new ArrayList<>(8);
            for ( int i=0; i<splits.length; i++) {
                if ( splits[i].startsWith("{") && splits[i].endsWith("}")) {
                    this.variableList.add(splits[i].substring(1,splits[i].length()-1));
                } else {
                    this.variableList.add(null);
                }
            }
        }
    }

    public void addParamer(String name, String to) {
        this.parameterMap.put(name, to);
    }

    public String getPath() {
        return this.path;
    }

    public String getApiPath() { return this.apiPath; }

    public String getApiId() { return this.apiId; }

    /**
     * 파라미터 정보를 재구성한다.
     * @param request http요청
     * @param httpParamMap 요청 파라미터
     */
    public void rebuildHttpParameter(HttpServletRequest request, Map<String, String> httpParamMap) {
        // path variable을 추가한다.
        if ( this.variableList != null) {
            String[] splits = request
                    .getRequestURI()
                    .split("\\/");
            for (int i = 0; i < splits.length; i++) {
                if (this.variableList.get(i) != null) {
                    httpParamMap.put(this.variableList.get(i), splits[i]);
                }
            }
        }
        // 파라미터 이름 변경
        for ( Entry<String,String> entry : this.parameterMap.entrySet()) {
            String from = entry.getKey();
            String to = entry.getValue();
            String value = httpParamMap.get(from);
            httpParamMap.put(to, value);
        }
    }

    /**
     * 매칭되는 forward 정보가 있는 지 여부를 반환한다.
     * @param request http요청
     * @return forward 매칭 여부
     */
    public boolean matches(HttpServletRequest request) {
        if ( this.pattern.matcher(request.getRequestURI()).matches()) {
            return true;
        }
        return false;
    }
}
