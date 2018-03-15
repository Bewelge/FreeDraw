# FreeDraw
Free drawing on HTML Canvas with several different Brushes.
[Try here!](https://bewelge.github.io/FreeDraw/)



### A Javascript Free Drawing App

Features: 
* 18 different Brushes (+ the Eraser)
* Fully customisable Settings
* Not much more


### How it works

This little program uses JavaScript to draw on a HTML Canvas object. 

All the different brushes are contained in the *brushes* variable (in freeDraw.js).

While the mouse is down and within the drawing canvas, the draw call for the currently selected brush is executed.
Within that call, a function will be called to generate points to draw at depending on the current and latest mouse position. 
If these are too far away from each other it will automatically generate additional points to create smoother lines. This distance can be changed for each brush with the *margin* attribute. 

After the points are generated, the actual drawing will take place.

You are free to copy and use the code from indivdual brushes or create your own by adding items to the *brushes* variable.

### To-Do

- [ ] Allow creation of custom brushes
- [ ] Allow combination of brushes
- [ ] Create nicer looking starting settings for each brush
- [ ] Create more brushes
- [ ] Ability to save image(You can already save by right-clicking the canvas and choosing *save image as*)
- [ ] Add undo


### Libraries

* jQuery
* [Spectrum.js - Color Picker](https://bgrins.github.io/spectrum/)
* [QuickSettings.js - Settings Menu](https://github.com/bit101/quicksettings)
