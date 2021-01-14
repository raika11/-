package jmnet.moka.core.tps.mvc.poll.controller;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.util.AbstractExcelView;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollVote;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.poll.controller
 * ClassName : TrendpollExcelView
 * Created : 2021-01-14 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-14 13:12
 */
public class TrendpollExcelView extends AbstractExcelView {

    @Override
    protected void makeColumnValue(HSSFSheet worksheet, Object resultList) {

        List<TrendpollVote> votes = (List<TrendpollVote>) resultList;

        AtomicInteger rowIdx = new AtomicInteger(0);
        for (TrendpollVote vote : votes) {
            HSSFRow row = worksheet.createRow(rowIdx.addAndGet(1));
            AtomicInteger cellNum = new AtomicInteger(0);
            String cellValue = McpString.forceLineBreak(vote
                    .getPollItem()
                    .getTitle(), MokaConstants.EXCEL_CELL_VALUE_MAX_LENGTH);
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(cellValue);
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(vote.getDevDiv());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(McpDate.dateStr(vote.getRegDt()));
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(vote.getRegIp());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(vote.getLoginSite());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(vote.getMemId());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(vote.getPcId());

        }
    }
}
