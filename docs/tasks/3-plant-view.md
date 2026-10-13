# Plant View

## Outcome

A signed-in player can open the garden and see the first playable plant view:
an isometric pot with soil, a visible plant placeholder, an enabled Water
button, and the current sunlight score.

## Acceptance

- The garden view displays the supplied static isometric pot image with soil.
- A visible placeholder marks where the plant will be rendered in later work.
- The current sunlight score is visibly displayed.
- A new player starts at a sunlight score of `0`; their first garden view gives
  them `2` points.
- The first garden view on each subsequent player-local calendar day gives
  exactly `2` sunlight points.
- For every player-local calendar day missed since the previous garden view,
  subtract `1` sunlight point before awarding the current day's points. The
  score never falls below `0`.
- Additional garden views on the same local calendar day do not change the
  score.
- Water is an enabled control but has no effect yet.

## Non-goals

- Plant artwork, animation, growth stages, or plant-care mechanics.
- Water behavior or any other player action.
- Rewards, tasks, cosmetics, notifications, or progression beyond sunlight
  accounting.
- Creating or commissioning pot artwork.

## Decisions

- A daily visit is the player's first garden view in their local browser/device
  calendar day.
- The supplied pot asset is static and replaces any temporary presentation
  placeholder.
- When a player returns after missed days, decay is applied before that day's
  sunlight award.

## Required Input

- The static isometric pot image from the project owner.

Ready for Shape.
