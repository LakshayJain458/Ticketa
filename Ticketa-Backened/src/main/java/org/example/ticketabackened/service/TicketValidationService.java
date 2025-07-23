package org.example.ticketabackened.service;

import org.example.ticketabackened.domain.entity.TicketValidation;

import java.util.UUID;

public interface TicketValidationService {
    TicketValidation validateTicketByQrCode(UUID qrCodeId);

    TicketValidation validateTicketManually(UUID ticketId);
}
