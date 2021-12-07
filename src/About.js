import React from 'react';
import { makeStyles } from '@mui/styles';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const useStyles = makeStyles({
    paragraph: {
        paddingTop: 16,
    }
});

const About = ({ open, handleClose }) => {
    const classes = useStyles();
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    About Sailwind Navigation Companion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText component="div">
                        <Typography variant="body1" component="div">
                            A simple companion utility for the
                            game <Link href="https://store.steampowered.com/app/1764530/Sailwind/" underline="hover"
                                target="_blank" rel="noreferrer">
                                Sailwind
                            </Link>.
                        </Typography>
                        <Typography variant="body1" component="div" className={classes.paragraph}>
                            This app is made by Eurotrash. For bug reports, feature suggestions, or
                            general feedback, please PM me on the <Link href="https://discord.gg/HM3TadVv3e" underline="hover"
                                target="_blank" rel="noreferrer">
                                Sailwind Community Discord
                            </Link>.
                        </Typography>

                        <Divider className={classes.paragraph} />
                        <Typography variant="body2" component="div" className={classes.paragraph}>
                            What is this app for?
                            You can use it to work out your position via triangulation,
                            to measure various distances, to estimate visible range
                            of islands via the circle tool, to keep track of your
                            longer journeys via the tags / notes, or just to look
                            at the game's maps in general.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default About;
