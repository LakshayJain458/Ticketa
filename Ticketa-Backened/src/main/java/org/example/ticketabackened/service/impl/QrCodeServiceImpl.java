package org.example.ticketabackened.service.impl;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.domain.entity.Ticket;
import org.example.ticketabackened.domain.entity.TicketQRCode;
import org.example.ticketabackened.domain.enums.QrCodeStatus;
import org.example.ticketabackened.exceptionHandler.QrCodeGenerationException;
import org.example.ticketabackened.exceptionHandler.QrCodeNotFoundException;
import org.example.ticketabackened.repositories.QrCodeRepository;
import org.example.ticketabackened.service.QrCodeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QrCodeServiceImpl implements QrCodeService {

    private static final int QR_CODE_WIDTH = 300;
    private static final int QR_CODE_HEIGHT = 300;
    private static final Logger log = LoggerFactory.getLogger(QrCodeServiceImpl.class);

    private final QRCodeWriter qrCodeWriter;

    private final QrCodeRepository qrCodeRepo;

    @Override
    public TicketQRCode generateQRCode(Ticket ticket) {
        try {
            UUID id = UUID.randomUUID();
            String qrCodeImage = generateQRCodeImage(id);

            TicketQRCode qrCode = new TicketQRCode();
            qrCode.setId(id);
            qrCode.setCodeStatus(QrCodeStatus.ACTIVE);
            qrCode.setValue(qrCodeImage);
            qrCode.setTicket(ticket);

            return qrCodeRepo.saveAndFlush(qrCode);

        } catch (WriterException | IOException ex) {
            throw new QrCodeGenerationException("Error while generating QR Code", ex);
        }
    }

    @Override
    public byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId) {
        TicketQRCode qrCode = qrCodeRepo.findByTicketIdAndTicket_TicketBuyerId(ticketId, userId)
                .orElseThrow(QrCodeNotFoundException::new);

        try {
            return Base64.getDecoder().decode(qrCode.getValue());
        } catch (IllegalArgumentException ex) {
            log.error("Invalid QR Code for ticketId : {}", ticketId, ex);
            throw new QrCodeNotFoundException();
        }
    }

    private String generateQRCodeImage(UUID id) throws WriterException, IOException {
        BitMatrix bitMatrix = qrCodeWriter.encode(
                id.toString(),
                BarcodeFormat.QR_CODE,
                QR_CODE_WIDTH,
                QR_CODE_HEIGHT
        );
        BufferedImage qr_image = MatrixToImageWriter.toBufferedImage(bitMatrix);
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ImageIO.write(qr_image, "PNG", outputStream);
            byte[] qr_image_bytes = outputStream.toByteArray();
            return Base64.getEncoder().encodeToString(qr_image_bytes);
        }
    }
}
