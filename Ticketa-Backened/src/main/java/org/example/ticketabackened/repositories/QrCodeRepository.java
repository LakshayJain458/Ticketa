package org.example.ticketabackened.repositories;

import org.example.ticketabackened.domain.entity.TicketQRCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QrCodeRepository extends JpaRepository<TicketQRCode, UUID> {
}
