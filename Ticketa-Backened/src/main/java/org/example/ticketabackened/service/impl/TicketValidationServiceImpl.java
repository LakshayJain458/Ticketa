package org.example.ticketabackened.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.domain.entity.Ticket;
import org.example.ticketabackened.domain.entity.TicketQRCode;
import org.example.ticketabackened.domain.entity.TicketValidation;
import org.example.ticketabackened.domain.enums.QrCodeStatus;
import org.example.ticketabackened.domain.enums.TicketValidationMethod;
import org.example.ticketabackened.domain.enums.TicketValidationStatus;
import org.example.ticketabackened.exceptionHandler.QrCodeNotFoundException;
import org.example.ticketabackened.exceptionHandler.TicketNotFoundException;
import org.example.ticketabackened.repositories.QrCodeRepository;
import org.example.ticketabackened.repositories.TicketRepository;
import org.example.ticketabackened.repositories.TicketValidationRepository;
import org.example.ticketabackened.service.TicketValidationService;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketValidationServiceImpl implements TicketValidationService {

    private final TicketValidationRepository ticketValidationRepo;
    private final TicketRepository ticketRepo;
    private final QrCodeRepository qrCodeRepo;

    @Override
    public TicketValidation validateTicketByQrCode(UUID qrCodeId) {
        TicketQRCode qrCode = qrCodeRepo.findByIdAndCodeStatus(qrCodeId, QrCodeStatus.ACTIVE)
                .orElseThrow(() -> new QrCodeNotFoundException("QR Code not found or inactive: " + qrCodeId));

        return validate(qrCode.getTicket(), TicketValidationMethod.QR_SCAN);
    }

    @Override
    public TicketValidation validateTicketManually(UUID ticketId) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found: " + ticketId));

        return validate(ticket, TicketValidationMethod.MANUAL);
    }

    private TicketValidation validate(Ticket ticket, TicketValidationMethod method) {
        boolean alreadyValidated = ticket.getTicketValidations().stream()
                .anyMatch(v -> v.getValidationStatus() == TicketValidationStatus.VALID);

        TicketValidation validation = TicketValidation.builder()
                .ticket(ticket)
                .validationMethod(method)
                .validationStatus(alreadyValidated ? TicketValidationStatus.INVALID : TicketValidationStatus.VALID)
                .build();

        return ticketValidationRepo.save(validation);
    }
}
