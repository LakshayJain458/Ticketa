package org.example.ticketabackened.controllers;

import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.domain.dto.TicketValidationRequestDto;
import org.example.ticketabackened.domain.dto.TicketValidationResponseDto;
import org.example.ticketabackened.domain.entity.TicketValidation;
import org.example.ticketabackened.domain.enums.TicketValidationMethod;
import org.example.ticketabackened.mappers.TicketValidationMapper;
import org.example.ticketabackened.service.TicketValidationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/ticket-validations")
public class TicketValidationController {
    private final TicketValidationService ticketValidationService;
    private final TicketValidationMapper ticketValidationMapper;

    @PostMapping
    public ResponseEntity<TicketValidationResponseDto> validateTicket(
            @RequestBody final TicketValidationRequestDto ticketValidationRequestDto
    ) {
        TicketValidationMethod validationMethod = ticketValidationRequestDto.getMethod();
        TicketValidation ticketValidation;
        if (TicketValidationMethod.MANUAL.equals(validationMethod)) {
            ticketValidation = ticketValidationService
                    .validateTicketManually(ticketValidationRequestDto.getId());
        } else {
            ticketValidation = ticketValidationService
                    .validateTicketByQrCode(ticketValidationRequestDto.getId());
        }
        return ResponseEntity.ok(ticketValidationMapper.toTicketValidationResponseDto(ticketValidation));
    }
}
