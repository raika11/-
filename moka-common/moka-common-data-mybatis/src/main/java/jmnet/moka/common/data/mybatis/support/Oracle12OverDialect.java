package jmnet.moka.common.data.mybatis.support;

/**
 * @author ince
 */
public class Oracle12OverDialect implements Dialect {
    @Override
    public boolean supportsLimit() {
        return true;
    }

    @Override
    public boolean supportsLimitOffset() {
        return true;
    }

    private String getSQL(String sql, int scale) {
        StringBuffer buf = new StringBuffer();
        buf
                .append(NL)
                .append(sql);
        buf
                .append(NL)
                .append(" FETCH NEXT ")
                .append(scale)
                .append(" ROWS ONLY");
        return buf.toString();
    }

    private String getSQL(String sql, int offset, int scale) {
        StringBuffer buf = new StringBuffer();
        buf
                .append(NL)
                .append(sql);
        buf
                .append(NL)
                .append(" OFFSET ")
                .append(offset)
                .append(" ROWS ");
        buf
                .append(" FETCH NEXT ")
                .append(scale)
                .append(" ROWS ONLY");
        return buf.toString();
    }

    @Override
    public String getLimitedSQL(String sql, int offset, int scale) {
        sql = sql.trim();
        if (offset > 0) {
            return getSQL(sql, offset, scale);
        }
        return getSQL(sql, scale);
    }
}
