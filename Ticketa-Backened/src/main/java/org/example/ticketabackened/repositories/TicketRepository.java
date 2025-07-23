package org.example.ticketabackened.repositories;

import org.example.ticketabackened.domain.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    int countByTicketTypeId(UUID ticketTypeId);

    Page<Ticket> findByTicketBuyerId(UUID ticketBuyerId, Pageable pageable);

    Optional<Ticket> findByIdAndTicketBuyerId(UUID ticketId, UUID ticketBuyerId);
}
