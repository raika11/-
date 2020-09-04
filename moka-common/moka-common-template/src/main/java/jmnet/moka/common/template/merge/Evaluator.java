package jmnet.moka.common.template.merge;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JexlEngine;
import org.apache.commons.jexl3.JexlExpression;
import org.apache.commons.jexl3.JexlScript;
import org.apache.commons.jexl3.JxltEngine.Template;
import org.apache.commons.jexl3.internal.Engine;
import org.apache.commons.jexl3.internal.TemplateEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <pre>
 * 토큰과 속성의 표현식을 평가하여 값을 생성한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 4:18:53
 * @author kspark
 */
public class Evaluator {
	private static final Logger logger = LoggerFactory.getLogger(Evaluator.class);
	public final static JexlBuilder jexlb = new JexlBuilder();
	public final static JexlEngine jexl = jexlb.create();
	public final static TemplateEngine jxlt = new TemplateEngine(new Engine(jexlb),false,100,'$','#');
	private HashMap<String,JexlExpression>  exprMap = new HashMap<String,JexlExpression>(256);
	private HashMap<String, JexlScript>  scriptMap = new HashMap<String,JexlScript>(256);
    private HashMap<String, Template> templateMap = new HashMap<String, Template>(256);
	
	public Evaluator() {
		this.exprMap = new HashMap<String,JexlExpression>(256);
	}
	
	public List<String> getVariables(String expr) {
        Template template = jxlt.createTemplate("${"+expr+"}");
        Set<List<String>> variablesSet = template.getVariables();
        List<String> allVariables = new ArrayList<String>(8);
        for ( List<String> variables : variablesSet ) {
        	allVariables.addAll(variables);
        }
        return allVariables;
	}
	
	/**
	 * <pre>
	 * 평가된 값을 반환한다.
	 * </pre>
	 * @param expr 표현식
	 * @param context 컨텍스트
	 * @return 평가된 값
	 */
	public Object eval(String expr, MergeContext context) {
		try {
			JexlExpression je = exprMap.get(expr);
			if ( je == null) {
				je = jexl.createExpression(expr);
				this.exprMap.put(expr, je);
			}
			return je.evaluate(context);
		} catch (Exception e){
			logger.warn("{} evaluation fail: {}",expr, e.getMessage());
			return null;
		}
	}
	
    /**
     * <pre>
     * ${var}를 포함한 텍스트를 평가하여 반환한다.
     * </pre>
     * 
     * @param templateText 템플릿 내용
     * @param context 컨텍스트
     * @return 평가된 값
     */
    public String evalTemplate(String templateText, MergeContext context) {
        if (templateText.contains("$") == false) {
            return templateText;
        }
        try {
            Template template = templateMap.get(templateText);
            if (template == null) {
                template = jxlt.createTemplate(templateText);
                this.templateMap.put(templateText, template);
            }
            StringWriter writer = new StringWriter();
            template.evaluate(context, writer);
            return writer.toString();
        } catch (Exception e) {
            logger.warn("{} evaluation fail: {}", templateText, e.getMessage());
            return null;
        }
    }

	/**
	 * <pre>
	 * 평가된 값을 스트링으로 반환한다.
	 * </pre>
	 * @param expr 표현식
	 * @param context 컨텍스트
	 * @return 평가된 값
	 */
	public String evalString(String expr, MergeContext context) {
		Object object = eval(expr,context);
		if ( object != null ) {
			return (String)object;
		} 
		return "";
	}

	/**
	 * <pre>
	 * 평가된 값을 boolean으로 반환한다.
	 * </pre>
	 * @param expr 표현식
	 * @param context 컨텍스트
	 * @return 평가된 값
	 */
	public boolean evalBool(String expr, MergeContext context) {
		Object object = eval(expr,context);
		if ( object != null ) {
			return (boolean)object;
		} 
		return false;
	}
	
	/**
	 * 
	 * <pre>
	 * 평가된 값을 int로 반환한다.
	 * </pre>
	 * @param expr 표현식
	 * @param context 컨텍스트
	 * @return 평가된 값
	 */
	public int evalInt(String expr, MergeContext context) {
		Object object = eval(expr,context);
		if ( object != null ) {
			return (int)object;
		} 
		return -1;
	}
	
	
	public void executeScript(String scriptText, MergeContext context) {
		try {
			JexlScript js = scriptMap.get(scriptText);
			if ( js == null) {
				js = jexl.createScript(scriptText);
				this.scriptMap.put(scriptText, js);
			}
			js.execute(context);
		} catch ( Exception e) {
			logger.warn("Script execution error: {}",e.getMessage());
		}
	}
}
