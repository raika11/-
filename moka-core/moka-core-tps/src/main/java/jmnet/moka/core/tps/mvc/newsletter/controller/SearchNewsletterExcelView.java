package jmnet.moka.core.tps.mvc.newsletter.controller;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import jmnet.moka.core.common.util.AbstractExcelView;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterProductDTO;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.ss.usermodel.Cell;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.controller
 * ClassName : SearchNewsletterExcelView
 * Created : 2021-04-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-19 오후 5:42
 */
public class SearchNewsletterExcelView extends AbstractExcelView {

    @Override
    protected void makeColumnValue(HSSFSheet worksheet, Object resultList) {
        List<NewsletterProductDTO> newsletters = (List<NewsletterProductDTO>) resultList;

        AtomicInteger rowIdx = new AtomicInteger(0);
        for (NewsletterProductDTO newsletter : newsletters) {
            HSSFRow row = worksheet.createRow(rowIdx.addAndGet(1));
            AtomicInteger cellNum = new AtomicInteger(0);

            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getSendType());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getLetterType());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getLetterName());
            Cell cellSendStartDt = row.createCell(cellNum.getAndAdd(1));
            if (newsletter.getSendStartDt() != null) {
                cellSendStartDt.setCellValue(newsletter.getSendStartDt());
            }
            Cell cellLastSendDt = row.createCell(cellNum.getAndAdd(1));
            if (newsletter.getLastSendDt() != null) {
                cellLastSendDt.setCellValue(newsletter.getLastSendDt());
            }
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getSendDay() + newsletter.getSendDay());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getSendTime());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getSendBaseCnt());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getStatus());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getRegDt());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getRegId());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getAbtestYn());
        }
    }
}
