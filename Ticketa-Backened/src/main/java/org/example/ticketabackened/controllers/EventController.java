package org.example.ticketabackened.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.domain.dto.EventCreationRequestDto;
import org.example.ticketabackened.domain.dto.EventCreationResponseDto;
import org.example.ticketabackened.domain.entity.Event;
import org.example.ticketabackened.domain.model.EventCreationRequest;
import org.example.ticketabackened.mappers.EventMapper;
import org.example.ticketabackened.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping(params = "/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final EventMapper eventMapper;

    @PostMapping("/create")
    public ResponseEntity<EventCreationResponseDto> createEvent(
            @AuthenticationPrincipal Jwt principal,
            @Valid @RequestBody EventCreationRequestDto requestDto) {
        UUID organizerId = UUID.fromString(principal.getSubject());
        EventCreationRequest request = eventMapper.fromDto(requestDto);
        Event createdEvent = eventService.createEvent(organizerId, request);
        EventCreationResponseDto responseDto = eventMapper.toDto(createdEvent);
        return ResponseEntity.ok(responseDto);
    }
}
