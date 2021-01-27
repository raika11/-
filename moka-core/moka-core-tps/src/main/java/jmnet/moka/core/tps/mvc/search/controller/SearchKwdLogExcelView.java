package jmnet.moka.core.tps.mvc.search.controller;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import jmnet.moka.core.common.util.AbstractExcelView;
import jmnet.moka.core.tps.mvc.search.vo.SearchKwdLogVO;
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
public class SearchKwdLogExcelView extends AbstractExcelView {

    @Override
    protected void makeColumnValue(HSSFSheet worksheet, Object resultList) {

        List<SearchKwdLogVO> votes = (List<SearchKwdLogVO>) resultList;

        AtomicInteger rowIdx = new AtomicInteger(0);
        for (SearchKwdLogVO log : votes) {
            HSSFRow row = worksheet.createRow(rowIdx.addAndGet(1));
            AtomicInteger cellNum = new AtomicInteger(0);

            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(log.getRank());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(log.getSchKwd());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(log.getTotalCnt());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(log.getPcCnt());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(log.getMobileCnt());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(log.getTabletCnt());

        }
    }
}
