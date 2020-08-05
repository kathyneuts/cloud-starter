import { pathAt } from 'base/route';
import { all, customElement, onHub } from 'dom-native';
import { BaseViewElement } from './v-base';
import { WksMainView } from './v-wks-main';

const defaultPath = '';

@customElement('v-nav')
export class NavView extends BaseViewElement {

	get wksId() { return (<WksMainView>this.closest('v-wks-main'))?.wksId }

	//#region    ---------- Element & Hub Events ---------- 
	@onHub('routeHub', 'CHANGE')
	routeChange() {
		this.refresh();
	}
	//#endregion ---------- /Element & Hub Events ---------- 

	init() {
		super.init();
		this.innerHTML = _render(this.wksId);
		this.refresh();
	}

	refresh() {
		const idx = 1; // path ind
		let urlName = pathAt(idx) ?? 'videos';

		for (const a of all(this, 'a')) {
			let href = a.getAttribute('href');
			let linkName = href?.split('/')[idx + 1] ?? ''; // has an extra / at start
			if (linkName === urlName) {
				a.classList.add('sel');
			} else if (a.classList.contains('sel')) {
				a.classList.remove('sel');
			}
		}
	}

}

//// HTML
function _render(wksId: number | null) {
	return `<a href="/${wksId}/images"><span class='bar'></span><label>Images</label></a>
			<a href="/${wksId}/videos"><span class='bar'></span><label>Videos</label></a>`;
}