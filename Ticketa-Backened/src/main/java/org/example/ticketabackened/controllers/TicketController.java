package org.example.ticketabackened.controllers;

import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.domain.dto.getTicketResponseDto;
import org.example.ticketabackened.domain.dto.getTicketsResponseDto;
import org.example.ticketabackened.mappers.TicketMapper;
import org.example.ticketabackened.service.QrCodeService;
import org.example.ticketabackened.service.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final TicketMapper ticketMapper;
    private final QrCodeService qrCodeService;

    @GetMapping
    public Page<getTicketsResponseDto> getAllTickets(
            @AuthenticationPrincipal Jwt principal,
            Pageable pageable
    ) {
        UUID userId = UUID.fromString(principal.getSubject());
        return ticketService.getTicketsForUser(userId, pageable).map(ticketMapper::toDto);
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<getTicketResponseDto> getTicket(
            @AuthenticationPrincipal Jwt principal,
            @PathVariable UUID ticketId
    ) {
        UUID userId = UUID.fromString(principal.getSubject());
        return ticketService.getTicketForUser(userId, ticketId)
                .map(ticketMapper::toGetTicketResponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{ticketId}/qr-code")
    public ResponseEntity<byte[]> getTicketQRCode(
            @AuthenticationPrincipal Jwt principal,
            @PathVariable UUID ticketId
    ) {
        UUID userId = UUID.fromString(principal.getSubject());
        byte[] qrCodeImage = qrCodeService.getQrCodeImageForUserAndTicket(userId, ticketId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentLength(qrCodeImage.length);
        return ResponseEntity.ok().headers(headers).body(qrCodeImage);
    }

}
