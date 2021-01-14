package jmnet.moka.core.common.util;

import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.servlet.view.document.AbstractXlsView;

/**
 * <pre>
 * 엑셀 다운로드 view
 * 2018. 1. 2. 차상인 최초생성
 * </pre>
 *
 * @author 차상인
 * @since 2018. 1. 2. 오후 4:34:06
 */
public abstract class AbstractExcelView extends AbstractXlsView {



    /**
     * <pre>
     * poi 라이브러리를 이용해 데이터를 엑셀 시트 오브젝트로 변환하여 response 싫어 보냄
     * </pre>
     *
     * @param modelMap 엑셀에 출력해야 할 정보
     * @param workbook 엑셀 오브젝트
     * @param request  HttpServletRequest
     * @param response HttpServletResponse
     * @throws Exception
     * @see AbstractXlsView#buildExcelDocument(Map, org.apache.poi.ss.usermodel.Workbook, HttpServletRequest, HttpServletResponse)
     */
    @Override
    protected void buildExcelDocument(Map<String, Object> modelMap, Workbook workbook, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        HSSFSheet worksheet = null;
        HSSFRow row = null;
        String title = String.valueOf(modelMap.get("title"));
        String fileName = title + "_" + McpDate.nowDateStr();
        worksheet = (HSSFSheet) workbook.createSheet(fileName + "_WorkSheet");

        List<String> columnList = (List<String>) (modelMap.get("columnList"));
        row = worksheet.createRow(0);
        int i = 0;
        for (String column : columnList) {
            row
                    .createCell(i++)
                    .setCellValue(column);
        }
        makeColumnValue(worksheet, modelMap.get("resultList"));

        for (int colNum = 0; colNum < row.getLastCellNum(); colNum++) {
            worksheet.autoSizeColumn(colNum);
            worksheet.setColumnWidth(colNum, (worksheet.getColumnWidth(colNum)) + 512);  // 윗줄만으로는 컬럼의 width 가 부족하여 더 늘려야 함.

        }
        response.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(fileName, MokaConstants.DEFAULT_CHARSET) + ".xls");

    }

    protected abstract void makeColumnValue(HSSFSheet worksheet, Object resultList);

    protected void makeColumnValueBasicTemplate(List<String[]> contentsList, HSSFSheet worksheet) {
        int cellNum = 0;
        int rowIdx = 0;
        for (String[] contents : contentsList) {
            HSSFRow row = worksheet.createRow(rowIdx + 1);
            cellNum = 0;
            for (String cellValue : contents) {
                cellValue = McpString.forceLineBreak(cellValue, MokaConstants.EXCEL_CELL_VALUE_MAX_LENGTH);
                row
                        .createCell(cellNum++)
                        .setCellValue(cellValue);
            }
            rowIdx++;
        }
    }



}
