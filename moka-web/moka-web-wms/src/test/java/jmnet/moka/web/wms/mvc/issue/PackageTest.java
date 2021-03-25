package jmnet.moka.web.wms.mvc.issue;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageKeyword;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.issue.mapper.IssueMapper;
import jmnet.moka.core.tps.mvc.issue.service.PackageService;
import jmnet.moka.core.tps.mvc.issue.vo.PackageVO;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class PackageTest {

    @Autowired
    private PackageService packageService;

    @Autowired
    private IssueMapper issueMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @SneakyThrows
    @Test
    public void selectPackageList() {
        //        List<PackageMaster> a = packageService
        //                .findAllPackage(PackageSearchDTO
        //                        .builder()
        //                        .build())
        //                .getContent();
        assertTrue(false);

        List<PackageVO> a = issueMapper.findAll(PackageSearchDTO
                .builder()
                .endDt(new Date())
                .build());

        log.debug(objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(a));

        assertNotNull(a);
    }

    @Test
    //        @Rollback(false)
    public void insertPackageTest() {
        PackageMaster packageMaster = PackageMaster
                .builder()
                .usedYn("Y")
                .pkgDiv("T")
                .scbYn("Y")
                .scbNo(0000L)
                .artCnt(0L)
                .totalId1(00000L)
                .catList("test1,test2")
                .pkgTitle("테스트")
                .pkgDesc("테스트설명")
                .recommPkg("0000")
                .reservDt(new Date())
                .build();

        PackageKeyword packageKeyword = PackageKeyword
                .builder()
                .catDiv("C")
                .schCondi("T")
                .keyword("테스트123")
                .sDate("2020-03-24")
                .build();

        packageMaster
                .getPackageKeywords()
                .add(packageKeyword);
        //        packageKeyword.setPackageMaster(packageMaster);

        PackageMaster resultValue = packageService.insertPackage(packageMaster);
        assertNotNull(resultValue.getPkgSeq());
    }

    //    @Test
    //    public void updateMenuTest() {
    //        Optional<Menu> menuOptional = menuService.findMenuById("03000000");
    //        menuOptional.ifPresent(menu -> {
    //            menu.setMenuDisplayNm("테스트");
    //            menuService.updateMenu(menu);
    //        });
    //
    //
    //    }
    //
    //    @Test
    //    @Rollback(false)
    //    public void deleteMenuTest() {
    //        menuService.deleteMenuById("03000000");
    //    }

}
