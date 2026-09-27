# Burdocks — MVP Design Doc

## Concept

A private PWA game for my wife.

Technical/project name: **Burdocks**
Player-facing game name: **«Лопушиный сад»**

The game is a small virtual garden that grows over time through short interactions. It should feel personal, affectionate, surprising, and increasingly connected to our shared history.

Final name should ideally come from an inside joke, nickname, phrase, or other relationship-specific reference.

---

## Core experience

Typical session: **30–90 seconds**, a few times per week.

Basic loop:

**Open app → give sunlight → check plant → care for it → see progress/surprise → leave**

Opening the app gives sunlight because I call her **Sunshine**.

The first plant begins as:

**Seed → Sprout → Small plant → Young plant → Mature plant**

Basic care:

- sunlight from opening the app;
- watering when needed;
- occasional nutrients.

Plants cannot permanently die.

Missing days should never create guilt or punishment.

---

## MVP

The first release contains:

- one plant;
- multiple visible growth stages;
- sunlight;
- watering;
- nutrients;
- one default pot;
- unlockable cosmetic pots;
- simple special tasks;
- an admin interface for me;
- persistent progress.

The admin interface lets me:

- see her progress;
- create/schedule tasks;
- attach rewards;
- send small surprises;
- inspect recent activity.

---

## Tasks

Tasks are one of the main ways I can keep the game personal without writing new code.

Examples:

- tiny scavenger hunts;
- jokes;
- affectionate messages;
- real-world surprises;
- small challenges;
- date-related activities.

Tasks can reward cosmetics such as pots or decorations.

The admin interface should make creating one take only a few minutes.

---

## Art direction

Simple, warm **vector illustration**.

Goals:

- easy to draw myself;
- reusable shapes;
- minimal shading;
- no complex painted assets;
- subtle animation provides personality.

Plants should be assembled from reusable parts such as leaves, stems, soil, and pots.

New ordinary plants should ideally be possible to create in **one evening**.

---

## Development constraint

Realistic development time is roughly:

**2 hours per week / ~8 hours per month**

Development enthusiasm will be inconsistent.

The game must therefore **not depend on frequent updates**.

Key rule:

> Garden should remain enjoyable even if I do not ship anything for 2–3 months.

New gameplay mechanics should normally appear no more frequently than about once per month.

A mechanic should ideally remain interesting for **4–8 weeks**.

Most novelty should come from cheap content:

- plant growth;
- tasks;
- messages;
- pots;
- decorations;
- seasonal changes;
- rewards.

---

## Development strategy

Development can happen in bursts.

If I build several things during an enthusiasm streak, they should be saved and released gradually instead of appearing immediately.

The player experience should feel steady even when development is not.

Before launch, the game should contain enough progression/content to run for several weeks without intervention.

---

## Long-term direction

Garden should slowly accumulate history.

Possible future additions:

- more plants;
- different plant mechanics;
- decorations;
- seasonal events;
- minigames;
- relationship milestones;
- memories;
- event-specific plants such as a Christmas tree;
- collections from previous years.

Old plants and rewards should remain visible rather than becoming obsolete.

The garden should gradually become a record of our relationship.

---

## Technical direction

Keep infrastructure simple and self-hosted.

Current likely stack:

- React Router Framework Mode;
- React;
- SQLite;
- Drizzle;
- Better Auth;
- `vite-plugin-pwa`;
- Docker.

Important game logic should live in plain TypeScript rather than being tightly coupled to the UI framework.

SQLite stores application state.

Important historical events should also be easy to export/archive in human-readable formats such as JSONL or SQL dumps.

---

## Product principles

1. **Personal over polished.**
2. **Affection over optimization.**
3. **No guilt mechanics.**
4. **Short sessions.**
5. **Visible progress.**
6. **Few mechanics, reused deeply.**
7. **Cheap content should create most novelty.**
8. **Developer inactivity must not break the experience.**
9. **The game should become more meaningful as history accumulates.**
10. **Do not build systems until the game actually needs them.**

---

## MVP success

The MVP works if:

- she enjoys checking the plant;
- she is curious about what happens next;
- tasks/surprises feel personal;
- I can maintain it without it becoming another job;
- adding a small surprise takes minutes rather than hours.
