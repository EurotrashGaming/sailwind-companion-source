import { width, height } from './CanvasSize';
import { getNextId } from './ItemUtils';

const directions16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const directions32 = ['N', 'NbE', 'NNE', 'NEbN', 'NE', 'NEbE', 'ENE', 'EbN', 'E', 'EbS', 'ESE', 'SEbE', 'SE', 'SEbS', 'SSE', 'SbE', 'S', 'SbW', 'SSW', 'SWbS', 'SW', 'SWbW', 'WSW', 'WbS', 'W', 'WbN', 'WNW', 'NWbW', 'NW', 'NWbN', 'NNW', 'NbW'];

const directionMode = {
    wind16: '16',
    wind32: '32',
};

const lineStyles = {
    inProgress: {
        line1: {
            width: 5,
            stroke: '#00000033',
            dash: [15, 5],
        },
        line2: {
            width: 5,
            stroke: '#FFFFFFDD',
            dash: [15, 5],
        },
        showLength: true,
        showDirection: true,
    },
    default: {
        line1: {
            width: 5,
            stroke: '#00000033',
            dash: [],
        },
        line2: {
            width: 5,
            stroke: '#FFFFFFDD',
            dash: [],
        },
        showLength: true,
        showDirection: false,
    },
};

const circleStyles = {
    inProgress: {
        line1: {
            width: 5,
            stroke: '#00000033',
            dash: [15, 5],
        },
        line2: {
            width: 5,
            stroke: '#FFFFFFDD',
            dash: [15, 5],
        },
        showLength: true,
    },
    default: {
        line1: {
            width: 5,
            stroke: '#00000033',
            dash: [],
        },
        line2: {
            width: 5,
            stroke: '#FFFFFFDD',
            dash: [],
        },
        showLength: true,
    },
};

export const createItem = (map, type, start, end, settings) => {
    if (type === 'line') {
        return createLine(map, start, end, settings);
    } else if (type === 'circle') {
        return createCircle(map, start, end, settings);
    }
}

const createLine = (map, start, end, settings) => {
    return {
        id: getNextId(),
        description: getLineDescription(map, start, end, settings),
        type: 'line',
        start,
        end,
        style: lineStyles.default,
    };
};

const createCircle = (map, start, end, settings) => {
    return {
        id: getNextId(),
        description: getCircleDescription(map, start, end, settings),
        type: 'circle',
        start,
        end,
        style: circleStyles.default,
    };
};

export const createTag = (location, text) => {
    return {
        id: getNextId(),
        description: `Tag "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`,
        type: 'tag',
        location,
        text,
    };
};

const drawCursorGuides = (ctx, mousePosition) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF33";
    ctx.setLineDash([1]);
    ctx.beginPath();
    ctx.moveTo(0, mousePosition[1]);
    ctx.lineTo(width, mousePosition[1]);
    ctx.moveTo(mousePosition[0], 0);
    ctx.lineTo(mousePosition[0], height);
    ctx.stroke();
};

const getLineData = (start, end, settings) => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const length = Math.round(Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)));

    let angleText = '';
    let reciprocalAngleText = '';

    if (length > 1) {
        const oh = dx / length;
        let angle = (360 + Math.round(Math.asin(oh) * 360 / (2 * Math.PI))) % 360;
        if (isNaN(angle)) {
            angle = (end[0] > start[0]) ? 90 : 270;
        } else if (start[0] < end[0] && start[1] < end[1]) {
            angle = 180 - angle;
        } else if (start[0] >= end[0] && start[1] < end[1]) {
            angle = 270 - (angle - 270)
        }

        angle = angle % 360;

        const reciprocalAngle = (angle + 180) % 360;

        angleText = angle + '° (' + categorizeAngle(angle, settings.compass) + ')';
        reciprocalAngleText = reciprocalAngle + '° (' + categorizeAngle(reciprocalAngle, settings.compass) + ')';
    }

    return {
        dx,
        dy,
        length,
        mid: [
            start[0] + Math.round(dx / 2),
            start[1] + Math.round(dy / 2)
        ],
        angleText,
        reciprocalAngleText
    };
};

const drawText = (ctx, centerPoint, text) => {
    ctx.font = "16px Arial";
    const measured = ctx.measureText(text);

    ctx.fillStyle = '#00000066';
    ctx.fillRect(centerPoint[0] - (measured.width / 2) - 5, centerPoint[1] - 18, measured.width + 10, 16 + 10);
    ctx.fillStyle = '#FFFFFFDD';
    ctx.fillText(text, centerPoint[0] - (measured.width / 2), centerPoint[1]);
};

const categorizeAngle = (angle, mode) => {
    if (mode === directionMode.wind16) {
        angle = (angle + (22.5 / 2)) % 360;
        const category = Math.floor(angle / (360 / 16));
        return directions16[category];
    } else if (mode === directionMode.wind32) {
        angle = (angle + (22.5 / 4)) % 360;
        const category = Math.floor(angle / (360 / 32));
        return directions32[category];
    }
    return '';
};

const getLineDescription = (map, start, end, settings) => {
    const { length, angleText } = getLineData(start, end, settings);

    return `${Math.round(length * map.scale)} nm line at ${angleText}`;
};

const getCircleDescription = (map, start, end, settings) => {
    const { length } = getLineData(start, end, settings);

    return `${Math.round(length * map.scale)} nm circle`;
};

const setLineStyle = (ctx, style) => {
    ctx.lineWidth = style.width;
    ctx.strokeStyle = style.stroke;
    ctx.setLineDash(style.dash);
}

const drawLineSegment = (ctx, map, start, end, style, settings) => {
    const { length, mid, angleText, reciprocalAngleText } = getLineData(start, end, settings);

    if (style.line1) {
        setLineStyle(ctx, style.line1)
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
    }

    if (style.line2) {
        setLineStyle(ctx, style.line2)
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
    }

    if (length > 40 && style.showDirection) {
        drawText(ctx, [start[0] + 20, start[1] + 20], reciprocalAngleText);
        drawText(ctx, [end[0] + 40, end[1] + 40], angleText);
    }

    if (style.showLength) {
        drawText(ctx, mid, Math.round(length * map.scale) + ' nm');
    }
};

const drawCircle = (ctx, map, start, end, style, settings) => {
    const { length } = getLineData(start, end, settings);

    setLineStyle(ctx, style.line1)
    ctx.beginPath();
    ctx.arc(start[0], start[1], length, 0, 2 * Math.PI);
    ctx.stroke();

    setLineStyle(ctx, style.line2)
    ctx.beginPath();
    ctx.arc(start[0], start[1], length, 0, 2 * Math.PI);
    ctx.stroke();

    drawLineSegment(ctx, map, start, end, style, settings);
};

const drawTag = (ctx, location, text) => {
    drawText(ctx, [location[0] + 20, location[1] + 20], text);
};

const drawItems = (ctx, map, items, settings) => {
    if (!items) {
        return;
    }

    for (let item of items) {
        if (item.type === 'line') {
            drawLineSegment(ctx, map, item.start, item.end, item.style, settings);
        } else if (item.type === 'circle') {
            drawCircle(ctx, map, item.start, item.end, item.style, settings);
        } else if (item.type === 'tag') {
            drawTag(ctx, item.location, item.text);
        }
    }
};

export const draw = (ctx, map, startPoint, mousePosition, items, drawTool, settings) => {
    if (!ctx) {
        return;
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // ctx.drawImage(map.image, 0, 0);
    ctx.drawImage(map.image, 0, 0, map.naturalWidth, map.naturalHeight, 0, 0, map.scaledWidth, map.scaledHeight);

    if (mousePosition) {
        drawCursorGuides(ctx, mousePosition);
    }

    if (startPoint && mousePosition) {
        if (drawTool === 'line') {
            drawLineSegment(ctx, map, startPoint, mousePosition, lineStyles.inProgress, settings);
        } else if (drawTool === 'circle') {
            drawCircle(ctx, map, startPoint, mousePosition, circleStyles.inProgress, settings);
        }
    }

    drawItems(ctx, map, items, settings);
};
