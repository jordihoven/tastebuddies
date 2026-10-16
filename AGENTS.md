# tastebuddies — agent notes

## iOS taps

A home-screen (standalone) web app does not get iOS's fast-tap optimization, so
taps carry the ~350ms double-tap delay and buttons need two taps. A normal Safari
tab *does* get it, so the bug only reproduces when the app is added to the home
screen — testing in Safari alone will not show it.

Fix lives in `src/styles/main.css`:

```css
html {
  touch-action: manipulation;
}
```

`touch-action: manipulation` on any ancestor opts all its children out of
double-tap detection. Verify on a real iPhone, added to the home screen.
