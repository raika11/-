package jmnet.moka.common.template.merge;

import static jmnet.moka.common.template.Constants.CURRENT_INDENT;
import static jmnet.moka.common.template.Constants.MERGE_OPTIONS;
import static jmnet.moka.common.template.Constants.PARENT;
import static jmnet.moka.common.template.Constants.PREV_HAS_TAIL_SPACE;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.jexl3.JexlContext;

/**
 * 
 * <pre>
 * 머징을 위한 값을 보관한다. 
 * 현재의 컨텍스트에 값이 없을 경우 조상 컨텍스트에서 조회한다.
 * 부모의 컨텍스트는 parent. 으로 조회할 수 있다. 
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 5:56:07
 * @author kspark
 */
public class MergeContext implements JexlContext, JexlContext.NamespaceResolver {

//    protected final Map<String, Object> map;
    protected Map<String, Object> map;
    protected MergeContext parentContext ;
    protected static final Functions defaultFunctions = new Functions();

    public MergeContext() {
        this(null, true, null);
    }
    
    public MergeContext(boolean isRoot) {
    	this(null, isRoot, null);
    }

    public MergeContext(Functions functions) {
        this(null,true,functions);
    }
    
    public MergeContext(Map<String, Object> vars, boolean isRoot, Functions functions) {
    	map = vars == null ? new HashMap<>(32) : vars;
    	if ( functions == null) {
            map.put(null, defaultFunctions);
        } else {
            map.put(null, functions);
        }
		if ( isRoot ) {
	        this.set(MERGE_OPTIONS, new MergeOptions());
			this.set(CURRENT_INDENT, "");
			this.set(PREV_HAS_TAIL_SPACE, false);
		}
    }
    
//    public MergeContext(Map<String, Object> vars) {
//        map = vars == null ? new HashMap<String, Object>(32) : vars;
//        map.put(null, functions);
//    }
    
//    func:함수명 으로 사용할 경우
//
//    @Override
//    public Object resolveNamespace(String name) {
//        return "func".equals(name) ? functions : null;
//    }
    
    /**
     * 
     * <pre>
     * 자식 컨텍스트를 생성한다.
     * </pre>
     * @return 자식 컨텍스트
     */
    public MergeContext createChild() {
		MergeContext context = new MergeContext(false);
		context.setParent(this);
		context.set(PARENT, this);
		return context;
    }

    /**
     * 
     * <pre>
     * Loop에서 사용할 자식 컨텍스트를 생성한다.
     * </pre>
     * @return 자식 컨텍스트
     */
    public MergeContext createRowDataChild() {
    	MergeContext context = new RowDataContext();
    	context.setParent(this);
    	context.set(PARENT, this);
    	return context;
    }
    
    @Override
    public Object resolveNamespace(String name) {
        return map.get(name);
    }

    private MergeContext setParent(MergeContext context) {
    	return this.parentContext = context;
    }
    
    public boolean hasParent() {
    	return this.parentContext != null;
    }
    

    @Override
    public boolean has(String name) {    	
    	if ( map.containsKey(name) ) {
    		return map.containsKey(name);
    	} else { // 자신에게 없을때 상위에서 찾는다.
            return this.parentContext != null && this.parentContext.has(name);
    	}
    }

    @Override
    public Object get(String name) {
        if ( map.containsKey(name) ) {
    		return map.get(name);
    	} else { // 자신에게 없을때 상위에서 찾는다.
    		if ( this.parentContext != null  && this.parentContext.has(name) ) {
    			return parentContext.get(name);
    		}
    	}
    	return null;
    }

    public int getInt(String name) {
    	Object value = get(name);
    	if ( value instanceof Number) {
    		return ((Number)value).intValue();
    	} else if ( value instanceof String) {
    		return Integer.parseInt((String)value);
    	}
    	return Integer.MIN_VALUE;
    }
    
    @Override
    public void set(String name, Object value) {
        map.put(name, value);
    }

    
    public void remove(String name) {
    	map.remove(name);
    }
    
    public void clear() {
        map.clear();
    }

    /**
     * 
     * <pre>
     * 머지 옵션을 조회한다.
     * </pre>
     * @return 머지옵션
     */
    public MergeOptions getMergeOptions() {
    	return (MergeOptions)get(MERGE_OPTIONS);
    }
    
    /**
     * 
     * <pre>
     * 현재 들여쓰기를 가져온다.
     * </pre>
     * @return 현재 들여쓰기
     */
    public String getCurrentIndent() {
    	Object indent = get(CURRENT_INDENT);
    	return indent == null ? "" : (String)indent;
    }
}
