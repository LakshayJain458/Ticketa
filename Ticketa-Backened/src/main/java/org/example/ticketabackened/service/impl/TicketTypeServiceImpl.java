package org.example.ticketabackened.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.domain.entity.Ticket;
import org.example.ticketabackened.domain.entity.TicketType;
import org.example.ticketabackened.domain.entity.User;
import org.example.ticketabackened.domain.enums.TicketStatus;
import org.example.ticketabackened.exceptionHandler.TicketTypeNotFoundException;
import org.example.ticketabackened.exceptionHandler.TicketsSoldOutException;
import org.example.ticketabackened.exceptionHandler.UserNotFoundException;
import org.example.ticketabackened.repositories.TicketRepository;
import org.example.ticketabackened.repositories.TicketTypeRepository;
import org.example.ticketabackened.repositories.UserRepository;
import org.example.ticketabackened.service.QrCodeService;
import org.example.ticketabackened.service.TicketTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

    private final TicketTypeRepository ticketTypeRepo;
    private final TicketRepository ticketRepo;
    private final UserRepository userRepo;
    private final QrCodeService qrCodeService;

    @Override
    @Transactional
    public Ticket purchaseTicket(UUID userId, UUID ticketTypeId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("user with id " + userId + " not found"));

        TicketType ticketType = ticketTypeRepo.findByIdWithLock(ticketTypeId)
                .orElseThrow(() -> new TicketTypeNotFoundException("ticket type with id " + ticketTypeId + " not found"));

        int purchasedTickets = ticketRepo.countByTicketTypeId(ticketType.getId());

        int totalTickets = ticketType.getAvailableTickets();

        if (purchasedTickets + 1 > totalTickets) {
            throw new TicketsSoldOutException();
        }

        Ticket ticket = new Ticket();
        ticket.setStatus(TicketStatus.PURCHASED);
        ticket.setTicketType(ticketType);
        ticket.setTicketBuyer(user);

        Ticket savedTicket = ticketRepo.save(ticket);
        qrCodeService.generateQRCode(savedTicket);

        return ticketRepo.save(savedTicket);
    }
}
