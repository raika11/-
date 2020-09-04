package jmnet.moka.common.template.merge;

import static jmnet.moka.common.template.Constants.LOOP_DATA_ROW;
import static jmnet.moka.common.template.Constants.LOOP_INDEX;
import java.util.Map;
import jmnet.moka.common.JSONResult;

/**
 * 
 * <pre>
 * 머징을 위한 값을 Row Data를 보관한다. Loop의 경우 _ROW의 데이터를 교체하며 반복수행된다.
 * 값 참조시 불편을 줄이기 위해 _ROW를 제외하고 사용할 수 있다.  
 * 현재의 컨텍스트에 값이 없을 경우 조상 컨텍스트에서 조회한다.
 * 부모의 컨텍스트는 parent. 으로 조회할 수 있다. 
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 5:56:07
 * @author kspark
 */
public class RowDataContext extends MergeContext {

	public RowDataContext() {
		super(false); //LoopContext는 root가 될 수 없다.
	}
	
    @SuppressWarnings("rawtypes")
	@Override
    public boolean has(String name) {
        //_ROW의 키가 있을 경우 맵의 key값에서 조회할 수 있도록 한다.
    	if ( map.containsKey(LOOP_INDEX) && map.containsKey(LOOP_DATA_ROW)) {
    		Object dataMap = map.get(LOOP_DATA_ROW);
    		// ROW에 존재하는지 먼저 체크한다.
    		if ( dataMap instanceof JSONResult ) {
    			if (((JSONResult)dataMap).containsKey(name)) return true;
    		} else if ( dataMap instanceof Map ){
    			if (((Map)dataMap).containsKey(name)) return true;
    		}
    	}
    	
		if ( map.containsKey(name)) {
			return true;
		} else {
			return super.has(name);
		}
    }
    
    @SuppressWarnings("rawtypes")
	@Override
    public Object get(String name) {
    	if ( has(name) ) {
    		if ( map.containsKey(LOOP_INDEX) && map.containsKey(LOOP_DATA_ROW)) {
	    		Object dataMap = map.get(LOOP_DATA_ROW);
				/*if ( dataMap instanceof JSONResult) {
					if (((JSONResult)dataMap).containsKey(name)) {
						return ((JSONResult)dataMap).get(name);
					}
				} else */if ( dataMap instanceof Map) {
					if (((Map)dataMap).containsKey(name)) {
						return ((Map)dataMap).get(name);
					}
				}
    		}
			Object object = map.get(name);
			if ( object != null) {
				return object;
			} else {
				return super.get(name);
			}
    	}
    	return null;
    }
    
}
