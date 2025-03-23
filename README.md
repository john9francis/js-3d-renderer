# JS 3D Renderer

# Plan
- 3D renderer with html and javascript
- Reads json data to construct the shapes
- Client can rotate around using the mouse 
- can be used integrated in a website or using the browser on some local code

# Goals
- JSON parsing
- obj parsing 

# Details
- html has a canvas element with an id of "3dcanvas"

# Useful websites
- [w3 schools html canvas](https://www.w3schools.com/html/html5_canvas.asp)
- [3JS docs](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)

# TODO
- [ ] Label the axes with unit vectors
- [ ] Render text
- [x] Allow user control of the viewer
- [ ] Json parsing to get the objects rendered including at least a box and a line

# Bugs
- [ ] On x,y moving it does some weird things at different angles... it will like curve when moving or move backwards. see camera.js shiftLookPositionX function
- [ ] Zoom doesn't work on mobile