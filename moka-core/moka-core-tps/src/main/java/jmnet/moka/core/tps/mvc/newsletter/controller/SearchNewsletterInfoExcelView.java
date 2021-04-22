package jmnet.moka.core.tps.mvc.newsletter.controller;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import jmnet.moka.core.common.util.AbstractExcelView;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSimpleDTO;
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
 * ClassName : SearchNewsletterInfoExcelView
 * Created : 2021-04-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-19 오후 5:42
 */
public class SearchNewsletterInfoExcelView extends AbstractExcelView {

    @Override
    protected void makeColumnValue(HSSFSheet worksheet, Object resultList) {
        List<NewsletterSimpleDTO> newsletters = (List<NewsletterSimpleDTO>) resultList;

        AtomicInteger rowIdx = new AtomicInteger(0);
        Workbook wb = worksheet.getWorkbook();
        CreationHelper createHelper = wb.getCreationHelper();
        CellStyle cellStyle = wb.createCellStyle();
        cellStyle.setDataFormat(createHelper
                .createDataFormat()
                .getFormat("yyyy-mm-dd"));
        for (NewsletterSimpleDTO newsletter : newsletters) {
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
                cellSendStartDt.setCellStyle(cellStyle);
            }
            Cell cellLastSendDt = row.createCell(cellNum.getAndAdd(1));
            if (newsletter.getLastSendDt() != null) {
                cellLastSendDt.setCellValue(newsletter.getLastSendDt());
                cellLastSendDt.setCellStyle(cellStyle);
            }
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getSendDay() + newsletter.getSendDay());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getSendTime());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(0);
            //.setCellValue(newsletter.getSendBaseCnt());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getStatus());
            Cell cellRegDt = row.createCell(cellNum.getAndAdd(1));
            if (newsletter.getRegDt() != null) {
                cellRegDt.setCellValue(newsletter.getRegDt());
                cellRegDt.setCellStyle(cellStyle);
            }
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter
                            .getRegMember()
                            .getMemberNm() + newsletter
                            .getRegMember()
                            .getMemberId());
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getAbtestYn());
        }
    }
}
