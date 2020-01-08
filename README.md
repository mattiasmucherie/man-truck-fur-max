# man-truck-fur-max

This is a game made by Max.
Hopefully we can get it work properly.
I remade the `main.js` since I had troubles reading everything throught the german comments :smiley:
However much of the code that you wrote is reused so you should feel somewhat at home.

The best way to tweak the game is by switching these variables:

```js
let gameSpeed = 5;
let gameSpeedIncrement = 0.5;
let minEnemySpeed = -2;
let maxEnemySpeed = 2;
```

The enemies spawn at their usual position but there movement is random and changes for every score point you collect.
And I made it so that the game speeds up after each score points you collect.

And I added a little bonus when you go over 10 and 20 points :wink:

I also did some style fixes, like centering on the screen and stuff.

I don't know why it was flickering before, I'll try to investigate that and maybe find the source so that you can use your old javascript code. I kept in under `js/oldMain.js`

In the new `main.js` I use more ES6 style of javascript when possible. It is pretty much not using `var` and setting `const` or `let` instead and using the new way of setting function:

```js
function example(a, b) {
  return a + b;
}
```

becomes:

```js
const example = (a, b) => {
  return a + b;
};
```

you can even type it like this if you only place you logic in the `return` statement:

```js
const example = (a, b) => a + b;
```

Don't hesitate to ask me question if you have any :smiley:
