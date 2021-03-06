import * as chokidar from 'chokidar';
import { router } from 'cmdrouter';
import { spawn } from 'p-spawn';
import { join as joinPath } from 'path';
import { wait } from 'utils-min';
import { sketch, SKETCH_FILE } from './cmd-sketch';
import { CallReducer } from './utils';

const IMG_NAME_PREFIX = 'cba-';
const NOT_RESTART_IF_PATH_HAS = '/test/';


router({ watch }).route();


async function watch() {

	//#region    ---------- Frontend watch ---------- 
	// watch the watch for frontends/web
	spawn('./node_modules/.bin/vdev', ['watch', 'web']);
	spawn('./node_modules/.bin/vdev', ['watch', 'admin']);
	//#endregion ---------- /Frontend watch ---------- 

	//#region    ---------- services watch ---------- 
	// NOTE: the number is the debug port, and we avoid the standard 9229 as chrome tend to automatically ping it which create console noise
	// watch services (configure in .vscode/launch.json for debug)
	watchService('web-server', '9230');
	watchService('admin-server', '9231');

	watchService('vid-init', '9240');
	watchService('vid-scaler', '9241');
	//#endregion ---------- /services watch ---------- 


	//#region    ---------- agent sql watch ---------- 
	const recreateDbCr = new CallReducer(() => {
		spawn('npm', ['run', 'vdev', 'kexec', 'agent', 'npm', 'run', 'recreateDb']);
	}, 500);

	const sqlWatcher = chokidar.watch('services/agent/sql', { depth: 99, ignoreInitial: true, persistent: true });

	sqlWatcher.on('change', async function (filePath: string) {
		console.log(`services/agent/sql change: ${filePath}`);
		recreateDbCr.map(filePath);
	});

	sqlWatcher.on('add', async function (filePath: string) {
		console.log(`services/agent/sql add: ${filePath}`);
		recreateDbCr.map(filePath);
	});
	//#endregion ---------- /agent sql watch ---------- 

	//#region    ---------- ico watch ---------- 
	const icoWatcher = chokidar.watch(SKETCH_FILE, { ignoreInitial: true, persistent: true });

	icoWatcher.on('change', async function (filePath: string) {
		await sketch();
	});
	//#endregion ---------- /ico watch ---------- 
}


async function watchService(serviceName: string, debugPort: string) {
	const serviceDir = `services/${serviceName}`;

	// kubectl port-forward $(kubectl get pods -l run=cba-web-server --no-headers=true -o custom-columns=:metadata.name) 9229
	const podName = (await spawn('kubectl', ['get', 'pods', '-l', `run=${IMG_NAME_PREFIX}${serviceName}`, '--no-headers=true', '-o', 'custom-columns=:metadata.name'], { capture: 'stdout' })).stdout?.trim();
	spawn('kubectl', ['port-forward', podName, `${debugPort}:9229`]);


	spawn('tsc', ['-w'], { cwd: serviceDir }); // this will create a new restart

	console.log('waiting for tsc -w');
	await wait(2000);

	const distDir = joinPath(serviceDir, '/dist/');

	const watcher = chokidar.watch(distDir, { depth: 99, ignoreInitial: true, persistent: true });

	const cr = new CallReducer(() => {
		spawn('npm', ['run', 'vdev', 'krestart', serviceName]);
	}, 500);

	watcher.on('change', async function (filePath: string) {
		if (filePath.includes(NOT_RESTART_IF_PATH_HAS)) {
			// console.log(`no restart because path contains ${NOT_RESTART_IF_PATH_HAS}`);
		} else {
			cr.map(filePath);
		}

	});

	watcher.on('add', async function (filePath: string) {
		if (filePath.includes(NOT_RESTART_IF_PATH_HAS)) {
			// console.log(`no restart because path contains ${NOT_RESTART_IF_PATH_HAS}`);
		} else {
			cr.map(filePath);
		}
	});
}