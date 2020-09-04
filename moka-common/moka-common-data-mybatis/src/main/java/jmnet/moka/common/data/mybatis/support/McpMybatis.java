package jmnet.moka.common.data.mybatis.support;

import org.apache.ibatis.session.RowBounds;

public class McpMybatis {

    public static RowBounds getRowBounds(int page, int rows) {
        int offset = (page < 0 ? 0 : page) * rows;
        int scale = rows;
        return new RowBounds(offset, scale);
    }
}
