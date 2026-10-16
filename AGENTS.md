# tastebuddies — agent notes

## CSS

Wrap every `:hover` rule in `@media (hover: hover)`, and add a matching `:active`
rule for the touch press state.

Unguarded `:hover` (especially with a `transition`) makes iOS Safari treat the
first tap as hover-intent and require a double tap before `click` fires.
