package jmnet.moka.common.data.mybatis.support;

/**
 * 
 * <pre>
 * Mybatis Dialect
 * 2017. 4. 21. ince 최초생성
 * </pre>
 * @since 2017. 4. 21. 오후 3:32:08
 * @author ince
 */
public interface Dialect {
	char NL = '\n';
	/**
	 * 
	 * <pre>
	 * 페이징 쿼리 적용 여부
	 * </pre>
	 * @return 지원 여부
	 */
	public boolean supportsLimit();

	/**
	 * 
	 * <pre>
	 * 페이징 쿼리 적용 여부
	 * </pre>
	 * @return 지원 여부
	 */
	public boolean supportsLimitOffset();

	/**
	 * 
	 * <pre>
	 * 페이징 쿼리 
	 * </pre>
	 * @param sql sql문
	 * @param offset
	 * @param scale
	 * @return 페이징 쿼리 적용 된 쿼리 문
	 */
	public String getLimitedSQL(String sql, int offset, int scale);
}