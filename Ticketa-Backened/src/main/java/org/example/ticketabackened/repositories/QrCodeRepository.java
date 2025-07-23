package org.example.ticketabackened.repositories;

import org.example.ticketabackened.domain.entity.TicketQRCode;
import org.example.ticketabackened.domain.enums.QrCodeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface QrCodeRepository extends JpaRepository<TicketQRCode, UUID> {

    Optional<TicketQRCode> findByTicketIdAndTicket_TicketBuyerId(UUID ticketId, UUID ticketBuyerId);

    Optional<TicketQRCode> findByIdAndCodeStatus(UUID qrCodeId, QrCodeStatus qrCodeStatus);
}
