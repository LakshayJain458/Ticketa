package org.example.ticketabackened.controllers;

import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.service.TicketTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/events/{eventId}/ticket-types")
public class TicketTypeController {
    private final TicketTypeService ticketTypeService;

    @PostMapping("/{ticketTypeId}/tickets")
    public ResponseEntity<Void> purchaseTicket(
            @AuthenticationPrincipal Jwt principal,
            @PathVariable UUID ticketTypeId
    ) {
        UUID userId = UUID.fromString(principal.getSubject());
        ticketTypeService.purchaseTicket(userId, ticketTypeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
