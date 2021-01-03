package jmnet.moka.core.tps.common.util;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import javax.imageio.ImageIO;
import jmnet.moka.common.utils.McpFile;
import org.springframework.web.multipart.MultipartFile;

public class ImageUtil {

    public static final String JPG_EXTENSTION = "jpg";

    /**
     * <pre>
     * MultipartFile이 이미지인지 확인한다
     * </pre>
     *
     * @param file MultipartFile
     * @return 이미지 여부
     */
    public static boolean isImage(MultipartFile file) {
        if (file
                .getContentType()
                .startsWith("image")) {
            return true;
        }
        return false;
    }

    /**
     * 업로드 된 파일이 시스템에서 허용하는 파일 포맷인지 체크
     *
     * @param file File
     * @return 시스템 허용 파일 포맷 여부
     * @throws Exception 예외처리
     */
    public static boolean isAllowUploadImageFormat(MultipartFile file) {
        boolean isValid = isImage(file);
        if (isValid) {
            String mimeType = file.getContentType();
            isValid = false;
            for (String mime : McpFile.IMG_MIMETYPES) {
                if (mimeType.equalsIgnoreCase(mime)) {
                    isValid = true;
                    break;
                }
            }
        }
        return isValid;
    }

    /**
     * 파일이 이미지 파일인지 확장자를 리턴
     *
     * @param file File
     * @return 이미지 확장자
     * @throws Exception 예외처리
     */
    public static String ext(MultipartFile file) {
        String mimeType = file.getContentType();
        String[] types = mimeType.split("\\/");
        if (types != null && types.length == 2) {
            return types[1].equals("jpeg") ? "jpg" : types[1];
        }
        return null;
    }

    /**
     * <pre>
     * 이미지 리사이즈
     * </pre>
     *
     * @param inputStream InputStream
     * @param width       가로사이즈
     * @param height      세로사이즈
     * @return buffered Image
     * @throws IOException 입출력예외
     */
    public static BufferedImage resize(InputStream inputStream, int width, int height)
            throws IOException {
        BufferedImage inputImage = ImageIO.read(inputStream);

        BufferedImage outputImage = new BufferedImage(width, height, inputImage.getType());

        Graphics2D graphics2D = outputImage.createGraphics();
        graphics2D.drawImage(inputImage, 0, 0, width, height, null);
        graphics2D.dispose();

        return outputImage;
    }

    /**
     * <pre>
     * 이미지 리사이즈(가로사이즈만 사용)
     * </pre>
     *
     * @param inputStream InputStream
     * @param maxWidth    가로사이즈
     * @return buffered Image
     * @throws IOException 입출력예외
     */
    public static BufferedImage resize(InputStream inputStream, int maxWidth)
            throws IOException {
        BufferedImage inputImage = ImageIO.read(inputStream);
        int newWidth = inputImage.getWidth();
        int newHeight = inputImage.getHeight();

        if (newWidth > maxWidth) {
            newWidth = maxWidth;
            newHeight = inputImage.getHeight() * maxWidth / inputImage.getWidth();
        }

        BufferedImage outputImage = new BufferedImage(newWidth, newHeight, inputImage.getType());

        Graphics2D graphics2D = outputImage.createGraphics();
        graphics2D.drawImage(inputImage, 0, 0, newWidth, newHeight, null);
        graphics2D.dispose();

        return outputImage;
    }

    /**
     * url 이미지 다운로드
     *
     * @param sourceUrl      이미지url
     * @param targetFilename 저장할 파일명
     * @return 성공여부
     */
    public static boolean downloadImage(String sourceUrl, String targetFilename) {
        FileOutputStream fos = null;
        InputStream is = null;
        try {
            fos = new FileOutputStream(targetFilename);

            URL url = new URL(sourceUrl);
            URLConnection urlConnection = url.openConnection();
            is = urlConnection.getInputStream();
            byte[] buffer = new byte[1024];
            int readBytes;
            while ((readBytes = is.read(buffer)) != -1) {
                fos.write(buffer, 0, readBytes);
            }
            return true;
        } catch (IOException e) {
            return false;
        } finally {
            try {
                if (fos != null) {
                    fos.close();
                }
                if (is != null) {
                    is.close();
                }
            } catch (IOException e) {
                // no
            }
        }
    }
}
