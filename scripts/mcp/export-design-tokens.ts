/* eslint-disable no-console */
import { COLOR, RADIUS, ELEVATION, SPACING, TEXT, TRANSITION } from '../../src/lib/config/design';

const tokens = {
	color: COLOR,
	radius: RADIUS,
	elevation: ELEVATION,
	spacing: SPACING,
	text: TEXT,
	transition: TRANSITION
};

console.log(JSON.stringify(tokens, null, 2));
