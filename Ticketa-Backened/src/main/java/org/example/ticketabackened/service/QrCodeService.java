package org.example.ticketabackened.service;

import org.example.ticketabackened.domain.entity.Ticket;
import org.example.ticketabackened.domain.entity.TicketQRCode;

import java.util.UUID;

public interface QrCodeService {

    TicketQRCode generateQRCode(Ticket ticket);

    byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);
}
