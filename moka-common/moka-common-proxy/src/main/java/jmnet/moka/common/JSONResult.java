package jmnet.moka.common;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings({"rawtypes", "unchecked"})
public class JSONResult implements Map {
    private static final Logger logger = LoggerFactory.getLogger(JSONResult.class);
    public static final int TYPE_MAP = 0;
    public static final int TYPE_LIST = 1;
    public static final int TYPE_OBJECT = 2;
    public static final int TYPE_NULL = 3;

    public static final JSONResult NULL = new JSONResult(null);
    private Object object;
    private int type;

    public JSONResult(Object object) {
        this.object = object;
        if (this.object == null) {
            this.type = TYPE_NULL;
        } else if (this.object instanceof Map) {
            this.type = TYPE_MAP;
        } else if (this.object instanceof List) {
            this.type = TYPE_LIST;
        } else {
            this.type = TYPE_OBJECT;
        }
    }

    public static JSONResult parseJSON(String jsonString) throws ParseException {
        JSONParser jsonParser = new JSONParser();
        Object object = jsonParser.parse(jsonString);
        return new JSONResult(object);
    }

    public Set<String> keySet() {
        if (this.type == TYPE_MAP) {
            return ((Map) this.object).keySet();
        }
        return new HashSet<String>();
    }

    public boolean containsKey(Object key) {
        if (this.type == TYPE_MAP) {
            return ((Map) this.object).containsKey(key);
        }
        return false;
    }

    public int size() {
        if (this.type == TYPE_MAP) {
            return ((Map) object).size();
        } else if (this.type == TYPE_LIST) {
            return ((List) object).size();
        }
        return 0;
    }

    public Object remove(Object key) {
        if (containsKey(key)) {
            return ((Map) object).remove(key);
        }
        return null;
    }

    public Object get(Object key) {
        if (containsKey(key)) {
            Object obj = ((Map) object).get(key);
            if (obj instanceof JSONResult) {
                return obj;
            } else if (obj instanceof Map) {
                return new JSONResult(obj);
            }
            return obj;
        }
        return NULL;
    }

    public Object get(int index) {
        try {
            if (this.type == TYPE_LIST) {
                Object obj = ((List) object).get(index);
                return obj;
            }
        } catch (Exception e) {
            // index에 해당하는 값이 없을 경우
            logger.warn(e.getMessage());
        }
        return NULL;
    }


    public String toString() {
        try {
            if (this.type == TYPE_OBJECT) {
                return object.toString();
            } else if (this.type == TYPE_MAP) {
                return ((Map) object).toString();
            } else if (this.type == TYPE_LIST) {
                return ((List) object).toString();
            }
        } catch (Exception e) {
            // index에 해당하는 값이 없을 경우
            logger.warn(e.getMessage());
        }
        return "";
    }

    public int getInt() {
        try {
            if (this.type == TYPE_OBJECT) {
                return ((Number) object).intValue();
            }
        } catch (Exception e) {
            // index에 해당하는 값이 없을 경우
            logger.warn(e.getMessage());
        }
        return Integer.MIN_VALUE;
    }

    public boolean getBool() {
        try {
            if (this.type == TYPE_OBJECT) {
                return ((Boolean) object).booleanValue();
            }
        } catch (Exception e) {
            // index에 해당하는 값이 없을 경우
            logger.warn(e.getMessage());
        }
        return false;
    }

    /**
     * 
     * <pre>
     * _TOTAL의 _DATA값을 가져온다.
     * </pre>
     * 
     * @return total
     */
    public int getTotal() {
        JSONResult totalJsonResult = (JSONResult) this.get(ApiResult.MAIN_TOTAL);
        int total = 0;
        if (totalJsonResult.isEmpty() == false) {
            Object totalObj = totalJsonResult.get(ApiResult.MAIN_DATA);
            Object totalValue = null;
            if (totalObj instanceof List) {
                totalValue = ((List<?>) totalObj).get(0);
            } else {
                totalValue = totalObj;
            }

            if (totalValue instanceof Long) {
                return ((Long) totalValue).intValue();
            } else if (totalValue instanceof String) {
                return Integer.parseInt((String) totalValue);
            } else {
                return (int) totalValue;
            }
        }
        return total;
    }

    /**
     * _DATA의 List를 반환한다. List가 아닐 경우 null을 반환한다.
     * @return _DATA의 List
     */
    public List<Map<String, Object>> getDataList() {
        return getDataList(ApiResult.MAIN_DATA);
    }

    /**
     * key에 해당하는 List를 반환한다. List가 아닐 경우 null을 반환한다.
     * @param dataKey 키
     * @return key에 해당하는 List
     */
    public List<Map<String, Object>> getDataList(String dataKey) {
        Object dataObject = unwrap(dataKey);
        if ( dataObject instanceof List) {
            return (List<Map<String, Object>>)dataObject;
        }
        return null;
    }

    /**
     * _DATA에 해당하는 List의 첫번째 Object를 반환한다. List가 아닌 경우 null을 반환한다.
     * @return key에 해당하는 List 의 첫번째 Object
     */
    public Map<String, Object> getDataListFirst() { return getDataListFirst(ApiResult.MAIN_DATA); }

    /**
     * key에 해당하는 List의 첫번째 Object를 반환한다. List가 아닌 경우 null을 반환한다.
     * @param dataKey 키
     * @return key에 해당하는 List 의 첫번째 Object
     */
    public Map<String, Object> getDataListFirst(String dataKey) {
        List<Map<String, Object>> dataList = getDataList(dataKey);
        if ( dataList != null && dataList.size()>0) {
            return dataList.get(0);
        }
        return null;
    }

    /**
     * _DATA의 Object를 반환한다. List이던 Map이던 상관하지 않는다.
     * @return _DATA의 Object
     */
    public Map<String,Object> getData() {return getData(ApiResult.MAIN_DATA);}

    /**
     * key에 해당하는 Object를 반환한다. List이던 Map이던 상관하지 않는다.
     * @return key에 해당하는 Object
     */
    public Map<String,Object> getData(String dataKey) {
        Object dataObject = unwrap(dataKey);
        if ( dataObject instanceof Map) {
            return (Map<String,Object>)dataObject;
        }
        return null;
    }

    private Object unwrap(String dataKey) {
        if ( this.containsKey(dataKey)) {
            if ( dataKey.equals(ApiResult.MAIN_DATA)) {
                return this.get(ApiResult.MAIN_DATA);
            } else {
                Object dataObject =  this.get(dataKey);
                if ( dataObject instanceof Map) {
                    return ((Map)dataObject).get(ApiResult.MAIN_DATA);
                }
            }
        }
        return null;
    }


    @Override
    public boolean isEmpty() {
        return this.type == TYPE_NULL;
    }


    @Override
    public boolean containsValue(Object value) {
        if (this.type == TYPE_MAP) {
            return ((Map) this.object).containsValue(value);
        }
        return false;
    }

    @Override
    public Object put(Object key, Object value) {
        if (this.type == TYPE_MAP) {
            return ((Map) this.object).put(key, value);
        }
        return null;
    }


    @Override
    public void putAll(Map m) {
        if (this.type == TYPE_MAP) {
            ((Map) this.object).putAll(m);
        }
    }

    @Override
    public void clear() {
        if (this.type == TYPE_MAP) {
            ((Map) this.object).clear();
        }
    }

    @Override
    public Collection values() {
        if (this.type == TYPE_MAP) {
            return ((Map) this.object).values();
        }
        return null;
    }

    @Override
    public Set entrySet() {
        if (this.type == TYPE_MAP) {
            return ((Map) this.object).entrySet();
        }
        return null;
    }
}
