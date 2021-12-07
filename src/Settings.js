import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

import MenuItem from '@mui/material/MenuItem';

const Settings = ({ open, handleClose, handleAccept, settings }) => {
    const currentCompass = settings.compass;

    const [compass, setCompass] = React.useState(currentCompass);

    useEffect(() => {
        setCompass(settings.compass);
    }, [settings]);

    const handleCompassChange = (event) => {
        setCompass(event.target.value);
    };

    return (
        <>
            <Box sx={{ minWidth: 220 }}>
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>
                        Settings
                    </DialogTitle>
                    <DialogContent style={{width: 400}}>
                        <FormControl fullWidth style={{marginTop: 8}}>
                            <InputLabel id="compass-label">Compass / heading format</InputLabel>
                            <Select
                                labelId="compass-label"
                                id="compass-select"
                                value={compass}
                                label="Compass / heading format"
                                onChange={handleCompassChange}
                            >
                                <MenuItem value={'16'}>16-wind compass</MenuItem>
                                <MenuItem value={'32'}>32-wind compass</MenuItem>
                            </Select>
                            <FormHelperText style={{marginLeft: 0}}>(will only affect new items)</FormHelperText>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={ () => handleAccept({compass})}>Accept</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default Settings;
