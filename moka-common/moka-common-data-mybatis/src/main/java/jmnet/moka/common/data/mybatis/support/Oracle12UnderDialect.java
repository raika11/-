package jmnet.moka.common.data.mybatis.support;

/**
 * <pre>
 * Mybatis Oracle12Dialect
 * 2017. 4. 21. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2017. 4. 21. 오후 3:32:12
 */
public class Oracle12UnderDialect implements Dialect {

    /**
     * <pre>
     * 페이징 쿼리 적용 여부
     * </pre>
     *
     * @return 적용 여부
     */
    @Override
    public boolean supportsLimit() {
        return true;
    }

    /**
     * <pre>
     * 페이징 쿼리 적용 여부
     * </pre>
     *
     * @return 적용 여부
     */
    @Override
    public boolean supportsLimitOffset() {
        return true;
    }

    /**
     * <pre>
     * 전달받은 쿼리 문을 페이징 쿼리 적용하여 리턴
     * </pre>
     *
     * @param sql    sql문
     * @param offset
     * @param scale
     * @return 페이징 쿼리 적용 된 쿼리 문
     */
    private String getSQL(String sql, int offset, int scale) {
        int start = offset + 1;
        int end = offset + scale;

        StringBuffer buf = new StringBuffer();
        buf
                .append(NL)
                .append("select * from (select ROWNUM as rnum, OQ.*  from (");
        buf
                .append(NL)
                .append(sql);
        buf
                .append(NL)
                .append(") OQ) WHERE rnum BETWEEN ")
                .append(start)
                .append(" AND ")
                .append(end);
        return buf.toString();
    }

    /**
     * <pre>
     * 전달받은 쿼리 문을 페이징 쿼리 적용하여 리턴
     * </pre>
     *
     * @param sql    sql문
     * @param offset
     * @param scale
     * @return 페이징 쿼리 적용 된 쿼리 문
     */
    @Override
    public String getLimitedSQL(String sql, int offset, int scale) {
        sql = sql.trim();
        return getSQL(sql, offset, scale);
    }
}
