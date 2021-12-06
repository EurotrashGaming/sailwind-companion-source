import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActions } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    list: {
    }
});

function ItemList({ items, setItems }) {
    const classes = useStyles();

    const clearClicked = () => {
        setItems([]);
    }

    const removeItem = (itemToRemove) => {
        setItems(items.filter(item => item !== itemToRemove));
    };

    return (
        <>
            <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                    <List
                        className={classes.list}
                        subheader={
                            <ListSubheader component="div">
                                Navigation items
                            </ListSubheader>
                        }
                    >
                    {items.map(item => (
                        <ListItem
                            key={item.id}
                            secondaryAction={
                                <IconButton onClick={() => removeItem(item)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={item.description} />
                        </ListItem>
                    ))}

                </List>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={clearClicked}>
                    Clear
                </Button>
            </CardActions>
        </Card>


        </>
    );
}

export default ItemList;