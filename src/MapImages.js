import alAnkhSource from './images/map_final_al_ankh.jpg';
import emeraldArchipelagoSource from './images/map_final_emerald_archipelago.jpg';
import aestrinSource from './images/map_final_aestrin.jpg';
import oceanSource from './images/map_final_ocean.jpg';

const maps = [];

const canvasWidth = 1000;
const canvasHeight = 1000;

const createImage = (name, source) => {
    const image = new Image();
    image.src = source;
    image.onload = () => {
        let scaledWidth = image.naturalWidth;
        let scaleX = 1;
        if (scaledWidth > canvasWidth)
            scaleX = canvasWidth / scaledWidth;
        let scaledHeight = image.naturalHeight;
        let scaleY = 1;
        if (scaledHeight > canvasHeight)
            scaleY = canvasHeight / scaledHeight;
        let scale = Math.min(scaleX, scaleY);
        if (scale < 1) {
            scaledWidth = scaledWidth * scale;
            scaledHeight = scaledHeight * scale;
        }
        const mapItem = maps.find(item => item.name === name);
        mapItem.naturalWidth = image.naturalWidth;
        mapItem.naturalHeight = image.naturalHeight;
        mapItem.scaledWidth = scaledWidth;
        mapItem.scaledHeight = scaledHeight;
    };
    return image;
};

const createMap = (name, source, scale) => {
    return {
        name,
        image: createImage(name, source),
        scale,
        items: [],
    };
};

maps.push(createMap('Al\'Ankh', alAnkhSource, 84 / 850));
maps.push(createMap('Emerald Archipelago', emeraldArchipelagoSource, 111 / 920));
maps.push(createMap('Aestrin', aestrinSource, 60 / 585));
maps.push(createMap('Ocean', oceanSource, 891 / 846));

export default maps;
