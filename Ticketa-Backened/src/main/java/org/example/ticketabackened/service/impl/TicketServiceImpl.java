package org.example.ticketabackened.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.domain.entity.Ticket;
import org.example.ticketabackened.repositories.TicketRepository;
import org.example.ticketabackened.service.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepo;

    @Override
    public Page<Ticket> getTicketsForUser(UUID userId, Pageable pageable) {
        return ticketRepo.findByTicketBuyerId(userId, pageable);
    }

    @Override
    public Optional<Ticket> getTicketForUser(UUID userId, UUID ticketId) {
        return ticketRepo.findByIdAndTicketBuyerId(ticketId, userId);
    }
}
