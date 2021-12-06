import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { width, height } from './CanvasSize';
import { draw, createItem, createTag } from './DrawUtils';

const useStyles = makeStyles({
  root: {
  },
  canvas: {
    maxWidth: '100%',
  }
});

const appendItem = (items, newItem) => {
  return [...items, newItem];
};

const scaleCanvasPosition = (canvas, position) => {
  if (!canvas) {
    return position;
  }
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return [
    parseFloat((position[0] * scaleX).toFixed(3)), 
    parseFloat((position[1] * scaleY).toFixed(3)), 
  ];
};

function Map({ drawTool, map, items, setItems }) {
  const classes = useStyles();

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [tagLocation, setTagLocation] = useState(null);
  const [tagText, setTagText] = useState('');

  const update = (startPoint, mousePosition, items) => {
    draw(context, map, startPoint, mousePosition, items, drawTool);
  };

  useEffect(() => {
    update(null, null, items);
  }, [map, items, canvas, context]);

  useEffect(() => {
    setTimeout(() => {
      setCanvas(canvasRef.current);
      setContext(canvasRef.current.getContext('2d'));
    }, 200);
  }, []);


  const canvasClicked = (e) => {
    const mousePosition = scaleCanvasPosition(canvas, [e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
    if (drawTool === 'tag') {
      setTagLocation(mousePosition);
      setTagDialogOpen(true);
      return;
    }

    const newStartPoint = startPoint ? null : mousePosition;
    const newItems = startPoint ?
      appendItem(items, createItem(map, drawTool, startPoint, mousePosition)) : items;
    setStartPoint(newStartPoint);
    if (newItems !== items) {
      setItems(newItems);
    }
    if (canvas) {
      update(newStartPoint, mousePosition, newItems);
    }
  };

  const mouseMoved = (e) => {
    const mousePosition = scaleCanvasPosition(canvas, [e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
    if (canvas) {
      update(startPoint, mousePosition, items);
    }
  };

  const mouseLeave = () => {
    update(null, null, items);
  };

  const handleTagDialogClose = () => {
    setTagDialogOpen(false);
  };

  const handleTagAdd = () => {
    const item = createTag(tagLocation, tagText);
    setItems(appendItem(items, item));

    setTagDialogOpen(false);
    setTagText('');
  };

  const handleTagTextChange = (event) => {
    setTagText(event.target.value);
  };

  return (
    <div className={classes.root}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={canvasClicked}
        onMouseMove={mouseMoved}
        onMouseLeave={mouseLeave}
        className={classes.canvas}
      />
      <Dialog open={tagDialogOpen} onClose={handleTagDialogClose}>
        <DialogTitle>Add tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Type in the text for the tag you would like to appear on the map:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="text"
            label="Tag text"
            type="text"
            fullWidth
            variant="standard"
            value={tagText}
            onChange={handleTagTextChange}
            inputProps={{ autoComplete: 'off' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTagDialogClose}>Cancel</Button>
          <Button onClick={handleTagAdd} disabled={!tagText || tagText.trim().length === 0}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Map;
