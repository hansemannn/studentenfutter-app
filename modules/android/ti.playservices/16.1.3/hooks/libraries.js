/**
 * Copyright (c) 2019-present by Axway Appcelerator
 * All Rights Reserved.
 */

'use strict';

const fork = require('child_process').fork;
const path = require('path');

exports.id = 'ti.playservices.libraries';
exports.cliVersion = '>=3.2';
exports.init = init;

/**
 * Main entry point for our plugin which looks for the platform specific
 * plugin to invoke
 */
function init (logger, config, cli, appc) {
	cli.on('build.module.pre.compile', {
		pre: function (builder, done) {
			logger.info('Downloading playservices libraries...');

			const p = fork(path.join(__dirname, '../../updater/index.js'), [ 'bootstrap' ], { cwd: path.join(builder.projectDir, '..'), silent: true });
			p.stderr.on('data', data => logger.error(data.toString().trim()));
			p.stdout.on('data', data => logger.trace(data.toString().trim()));
			p.on('close', function (code) {
				if (code !== 0) {
					return done(new Error(`Failed to download google play libraries, exited with code: ${code}`));
				}

				done();
			});
			
		}
	});
}
