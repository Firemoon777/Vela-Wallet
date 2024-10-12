import {CODE39} from './CODE39/index.js';
import {CODE128, CODE128A, CODE128B, CODE128C} from './CODE128/index.js';
import {EAN13, EAN8, EAN5, EAN2, UPC, UPCE} from './EAN_UPC/index.js';
import {ITF, ITF14} from './ITF/index.js';
import {MSI, MSI10, MSI11, MSI1010, MSI1110} from './MSI/index.js';
import {pharmacode} from './pharmacode/index.js';
import {codabar} from './codabar/index.js';
import {GenericBarcode} from './GenericBarcode/index.js';

export default {
	CODE39,
	CODE128, CODE128A, CODE128B, CODE128C,
	EAN13, EAN8, EAN5, EAN2, UPC, UPCE,
	ITF14,
	ITF,
	MSI, MSI10, MSI11, MSI1010, MSI1110,
	pharmacode,
	codabar,
	GenericBarcode
};
