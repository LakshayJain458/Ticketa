package org.example.ticketabackened.service;

import org.example.ticketabackened.domain.entity.Ticket;
import org.example.ticketabackened.domain.entity.TicketQRCode;

public interface QrCodeService {

    TicketQRCode generateQRCode(Ticket ticket);
}
