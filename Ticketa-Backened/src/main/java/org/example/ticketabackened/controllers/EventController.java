package org.example.ticketabackened.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.domain.dto.*;
import org.example.ticketabackened.domain.entity.Event;
import org.example.ticketabackened.domain.model.EventCreationRequest;
import org.example.ticketabackened.domain.model.EventUpdationRequest;
import org.example.ticketabackened.mappers.EventMapper;
import org.example.ticketabackened.service.EventService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(path = "/events")
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

    @GetMapping("/list-all")
    public ResponseEntity<Page<getEventsResponseDto>> getEvents(
            @AuthenticationPrincipal Jwt principal,
            Pageable pageable
    ) {
        UUID userId = UUID.fromString(principal.getSubject());
        Page<Event> events = eventService.getEventsForOrganiser(userId, pageable);
        return ResponseEntity.ok(events.map(eventMapper::togetEventsResponseDto));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<getEventDetailsResponseDto> getEvent(
            @AuthenticationPrincipal Jwt principal,
            @PathVariable UUID eventId
    ) {
        UUID userId = UUID.fromString(principal.getSubject());
        return eventService.getEventForOrganiser(eventId, userId)
                .map(eventMapper::toEventDetailsResponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{eventId}")
    public ResponseEntity<EventUpdationResponseDto> updateEvent(
            @AuthenticationPrincipal Jwt principal,
            @PathVariable UUID eventId,
            @Valid @RequestBody EventUpdationRequestDto requestDto) {
        UUID organizerId = UUID.fromString(principal.getSubject());
        EventUpdationRequest request = eventMapper.fromDto(requestDto);
        Event updatedEvent = eventService.updateEventForOrganiser(eventId, organizerId, request);
        EventUpdationResponseDto responseDto = eventMapper.toEventUpdationResponseDto(updatedEvent);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @AuthenticationPrincipal Jwt principal,
            @PathVariable UUID eventId
    ) {
        UUID organizerId = UUID.fromString(principal.getSubject());
        eventService.deleteEventForOrganiser(eventId, organizerId);
        return ResponseEntity.noContent().build();
    }
}
