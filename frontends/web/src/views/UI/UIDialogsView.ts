import { BaseView, addDomEvents } from "views/base";
import { display, frag } from "mvdom";
import { DialogBase } from "views/Dialog/DialogBase";


export class UIDialogsView extends BaseView {

	events = addDomEvents(this.events, {

		'click; .show-dialog2': async (evt) => {
			console.log('show dialog 2');
			const dialog = new DialogBase();
			dialog.title = 'Dialog 2';
			dialog.content = frag('<div>Dialog 2 Content</div');
			await display(dialog, 'body');
		}

	});

}