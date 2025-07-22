package org.example.ticketabackened.controllers;

import lombok.RequiredArgsConstructor;
import org.example.ticketabackened.domain.dto.getPublishedEventDetailsResponseDto;
import org.example.ticketabackened.domain.dto.getPublishedEventsResponseDto;
import org.example.ticketabackened.domain.entity.Event;
import org.example.ticketabackened.mappers.EventMapper;
import org.example.ticketabackened.service.EventService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(path = "/published-events")
@RequiredArgsConstructor
public class PublishedEventsController {

    private final EventService eventService;

    private final EventMapper eventMapper;

    @GetMapping
    public ResponseEntity<Page<getPublishedEventsResponseDto>> getPublishedEvents(
            Pageable pageable,
            @RequestParam(required = false) String query
    ) {
        Page<Event> events;
        if (query != null && !query.trim().isEmpty()) {
            events = eventService.searchPublishedEvents(query, pageable);
        } else {
            events = eventService.getPublishedEvents(pageable);
        }
        return ResponseEntity.ok(events.map(eventMapper::toPublishedEventsResponseDto));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<getPublishedEventDetailsResponseDto> getPublishedEventDetails(
            @PathVariable UUID eventId
    ) {
        return eventService.getPublishedEvent(eventId)
                .map(eventMapper::toPublishedEventDetailsResponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
