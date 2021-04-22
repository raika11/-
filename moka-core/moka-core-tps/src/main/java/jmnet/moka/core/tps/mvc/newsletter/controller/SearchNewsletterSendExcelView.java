package jmnet.moka.core.tps.mvc.newsletter.controller;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import jmnet.moka.core.common.util.AbstractExcelView;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSendSimpleDTO;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Workbook;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.controller
 * ClassName : SearchNewsletterSendExcelView
 * Created : 2021-04-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-19 오후 5:42
 */
public class SearchNewsletterSendExcelView extends AbstractExcelView {

    @Override
    protected void makeColumnValue(HSSFSheet worksheet, Object resultList) {
        List<NewsletterSendSimpleDTO> newsletterSends = (List<NewsletterSendSimpleDTO>) resultList;

        AtomicInteger rowIdx = new AtomicInteger(0);
        Workbook wb = worksheet.getWorkbook();
        CreationHelper createHelper = wb.getCreationHelper();
        CellStyle cellStyle = wb.createCellStyle();
        cellStyle.setDataFormat(createHelper
                .createDataFormat()
                .getFormat("yyyy-mm-dd hh-mm"));
        for (NewsletterSendSimpleDTO newsletterSend : newsletterSends) {
            HSSFRow row = worksheet.createRow(rowIdx.addAndGet(1));
            AtomicInteger cellNum = new AtomicInteger(0);

            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletterSend.getLetterType());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletterSend.getLetterName());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletterSend.getLetterTitle());
            Cell cellSendStartDt = row.createCell(cellNum.getAndAdd(1));
            if (newsletterSend.getSendDt() != null) {
                cellSendStartDt.setCellValue(newsletterSend.getSendDt());
                cellSendStartDt.setCellStyle(cellStyle);
            }
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletterSend.getAbtestYn());
        }
    }
}
