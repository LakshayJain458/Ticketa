package org.example.ticketabackened.service;

import org.example.ticketabackened.domain.entity.Ticket;

import java.util.UUID;

public interface TicketTypeService {
    Ticket purchaseTicket(UUID userId, UUID ticketTypeId);
}
