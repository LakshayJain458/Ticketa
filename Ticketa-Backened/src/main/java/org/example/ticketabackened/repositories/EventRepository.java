package org.example.ticketabackened.repositories;
import org.example.ticketabackened.domain.entity.Event;
import org.example.ticketabackened.domain.enums.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    Page<Event> findByOrganizerId(UUID organiserId, Pageable pageable);

    Optional<Event> findEventByIdAndOrganizerId(UUID eventId, UUID organizerId);

    Page<Event> findEventByStatus(EventStatus status, Pageable pageable);

    @Query(
            value = """
                    SELECT * FROM events
                    WHERE event_status = 'PUBLISHED'
                      AND to_tsvector('english', COALESCE(event_Name, '') || ' ' || COALESCE(venue, ''))
                      @@ plainto_tsquery('english', :query)
                    """,
            countQuery = """
                    SELECT count(*) FROM events
                    WHERE event_status = 'PUBLISHED'
                      AND to_tsvector('english', COALESCE(event_Name, '') || ' ' || COALESCE(venue, ''))
                      @@ plainto_tsquery('english', :query)
                    """,
            nativeQuery = true
    )
    Page<Event> searchEvents(@Param("query") String query, Pageable pageable);

    Optional<Event> findEventByIdAndStatus(UUID eventId, EventStatus status);
}
