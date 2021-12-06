import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import ArchitectureIcon from '@mui/icons-material/Architecture';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const DrawModes = ({drawTool, setDrawTool}) => {
    const handleDrawTool = (event, newAlignment) => {
        setDrawTool(newAlignment);
    };

    return (
        <ToggleButtonGroup
            value={drawTool}
            exclusive
            onChange={handleDrawTool}
        >
            <ToggleButton value="line">
                <BorderColorIcon />
            </ToggleButton>
            <ToggleButton value="circle">
                <ArchitectureIcon />
            </ToggleButton>
            <ToggleButton value="tag">
                <LocalOfferIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    );
}

export default DrawModes;
