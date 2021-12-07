import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SailingIcon from '@mui/icons-material/Sailing';

import DrawModes from './DrawModes';
import ItemList from './ItemList';
import Map from './Map';
import maps from './MapImages';

import JSZip from 'jszip';
import { setLastId } from './ItemUtils';
import About from './About';
import Settings from './Settings';

const useStyles = makeStyles({
    container: {
        paddingTop: 64,
    }
});

const parseParams = (params, oldState) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (!queryString || queryString.length < 3 || !urlParams.get('map')) {
        return {
            mapName: 'Al\'Ankh',
            data: null,
            tabIndex: 0,
            state: null,
        };
    }

    const location = urlParams.get('map');
    const data = urlParams.get('data');

    return {
        mapName: location,
        tabIndex: maps.findIndex(item => item.name === location),
        data: data,
        state: oldState,
    }
};

const getDefaultSettings = () => {
    return {
        compass: '16'
    };
};

const getDefaultState = () => {
    const state = {
        isDefault: true,
        settings: getDefaultSettings(),
        maps: {},
    };
    for (let map of maps) {
        state.maps[map.name] = [];
    }
    return state;
};

function Planner() {
    const classes = useStyles();
    const navigate = useNavigate();
    const [state, setState] = useState(getDefaultState());

    const [drawTool, setDrawTool] = useState('line');
    const params = parseParams(useParams()['*'], state);
    const tabIndex = params.tabIndex;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isAboutOpen, setIsAboutOpen] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const showAboutDialog = () => {
        closeMenu();
        setIsAboutOpen(true);
    };

    const showSettingsDialog = () => {
        closeMenu();
        setIsSettingsOpen(true);
    };

    useEffect(() => {
        if (params.data && params.data.trim().length > 0) {
            JSZip.loadAsync(params.data, { base64: true }).then(function (zip) {
                zip.files['state.json'].async('string').then(function (fileData) {
                    const contents = JSON.parse(fileData);
                    let maxId = 0;
                    for (let key in contents.maps) {
                        const items = contents.maps[key];
                        for (let item of items) {
                            if (item.id > maxId) {
                                maxId = item.id;
                            }
                        }
                    }
                    setLastId(maxId);
                    contents.settings = { ...getDefaultSettings(), ...(contents.settings || {}) };
                    setState(contents);
                });
            });
        }
    }, []);

    const navigateTo = (mapName, data) => {
        if (!data) {
            navigate(`?map=${mapName}`);
        } else {
            navigate(`?map=${mapName}&data=${encodeURIComponent(data)}`);
        }
    };

    const settingsAreDefault = (settings) => {
        const defaultSettings = getDefaultSettings();
        for (let key in settings) {
            if (settings.hasOwnProperty(key)) {
                if (settings[key] !== defaultSettings[key]) {
                    return false;
                }
            }
        }

        return true;
    };

    const updateState = (newState) => {
        let count = 0;
        for (let key in newState.maps) {
            count += newState.maps[key].length;
        }

        if (count === 0 && settingsAreDefault(newState.settings)) {
            navigateTo(maps[tabIndex].name);
        } else {
            var zip = new JSZip();
            zip.file('state.json', JSON.stringify(newState));
            zip.generateAsync({
                type: 'base64',
                compression: "DEFLATE",
                compressionOptions: { level: 9 }
            })
                .then(function (content) {
                    navigateTo(maps[tabIndex].name, content);
                });
        }
    };

    const items = state.maps[params.mapName];
    const setItems = (items) => {
        const newState = { ...state };
        newState.maps[params.mapName] = items;
        newState.isDefault = false;

        setState(newState);
        updateState(newState);
    }

    const handleTabChange = (event, newIndex) => {
        navigateTo(maps[newIndex].name, params.data);
    };

    const handleAcceptSettings = (newSettings) => {
        setIsSettingsOpen(false);

        const newState = { ...state };
        newState.settings = newSettings;
        newState.isDefault = false;

        setState(newState);
        updateState(newState);
    };

    return (
        <>
            <header>
                <AppBar>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            <SailingIcon />
                        </IconButton>
                        <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                            Sailwind Navigation Companion
                        </Typography>
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={openMenu}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={closeMenu}
                        >
                            <MenuItem onClick={showAboutDialog}>About</MenuItem>
                            <MenuItem onClick={showSettingsDialog}>Settings</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </header>
            <Container className={classes.container}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 1 }}>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        {maps.map((item) => (
                            <Tab key={item.name} label={item.name} />
                        ))}
                    </Tabs>
                </Box>

                <Box sx={{ marginBottom: 1 }}>
                    <DrawModes drawTool={drawTool} setDrawTool={setDrawTool} />
                </Box>

                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <Map
                            drawTool={drawTool}
                            items={items}
                            setItems={setItems}
                            settings={state.settings}
                            map={maps[tabIndex]}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ItemList items={items} setItems={setItems} />
                    </Grid>
                </Grid>
            </Container>
            <About open={isAboutOpen} handleClose={() => setIsAboutOpen(false)}/>
            <Settings 
                open={isSettingsOpen} 
                handleClose={() => setIsSettingsOpen(false)}
                handleAccept={handleAcceptSettings}
                settings={state.settings}
            />
        </>
    );
}

export default Planner;
