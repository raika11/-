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

            // 방법
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getSendTypeName());
            // 유형
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getLetterTypeName());
            // 카테고리
            Cell cellCategory = row.createCell(cellNum.getAndAdd(1));
            if (newsletter.getCategoryInfo() != null) {
                cellCategory.setCellValue(newsletter
                        .getCategoryInfo()
                        .getCdNm());
            }
            // 뉴스레터명
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getLetterName());
            // 발송시작일
            Cell cellSendStartDt = row.createCell(cellNum.getAndAdd(1));
            if (newsletter.getSendStartDt() != null) {
                cellSendStartDt.setCellValue(newsletter.getSendStartDt());
                cellSendStartDt.setCellStyle(cellStyle);
            }
            // 최근발송일
            Cell cellLastSendDt = row.createCell(cellNum.getAndAdd(1));
            if (newsletter.getLastSendDt() != null) {
                cellLastSendDt.setCellValue(newsletter.getLastSendDt());
                cellLastSendDt.setCellStyle(cellStyle);
            }
            // 발송주기 - 일정/콘텐츠
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getSendDay() + newsletter.getSendDay());
            // 발송주기 - 시간
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getSendTime());
            // 구독자수
            // TODO: 값 조인필요
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(0);
            // 상태
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getStatusName());
            // 등록일
            Cell cellRegDt = row.createCell(cellNum.getAndAdd(1));
            if (newsletter.getRegDt() != null) {
                cellRegDt.setCellValue(newsletter.getRegDt());
                cellRegDt.setCellStyle(cellStyle);
            }
            // 등록자
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter
                            .getRegMember()
                            .getMemberNm() + "(" + newsletter
                            .getRegMember()
                            .getMemberId() + ")");
            // 전용상품여부(구독상품여부)
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getScbYn());
            // A/B TEST
            row
                    .createCell(cellNum.getAndAdd(1))
                    .setCellValue(newsletter.getAbtestYn());
        }
    }
}
