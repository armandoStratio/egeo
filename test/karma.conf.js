/*
 * © 2017 Stratio Big Data Inc., Sucursal en España.
 *
 * This software is licensed under the Apache License, Version 2.0.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the terms of the License for more details.
 *
 * SPDX-License-Identifier: Apache-2.0.
 */
'use strict';

const path = require('path');

function parseTestPattern(argv) {
   var found = false;
   var pattern = argv.map(function(v) {
      if (found) {
         return v;
      }
      if (v === '--') {
         found = true;
      }
   }).
   filter(function(a) {
      return a
   }).
   join(' ');
   return pattern ? ['--grep', pattern] : [];
}

var args = parseTestPattern(process.argv);

module.exports = function(config) {
   config.set({
      basePath: path.join(__dirname, '..'),
      files: [{
            pattern: 'test/base.spec.ts'
         },
         {
            pattern: 'src/lib/**/*.+(ts|html)'
         }
      ],
      client: {
         args: args
      },
      frameworks: ['jasmine', 'karma-typescript'],
      karmaTypescriptConfig: {
         tsconfig: 'src/lib/tsconfig-test.json',
         bundlerOptions: {
            directories: [
               path.resolve(process.cwd(), 'node_modules'),
               path.resolve(process.cwd(), 'src/lib')
            ],
            entrypoints: /\.spec\.ts$/,
            transforms: [
               require("karma-typescript-angular2-transform")
            ]
         },
         coverageOptions: {
            exclude: /(\.d|\.spec|\.module|\.routing|index|barrels|public_api)\.ts/i,
            instrumentation: true
         },
         reports: {
            'cobertura': {
               'directory': 'target',
               'subdirectory': '.',
               'filename': 'coverage.xml'
            },
            'lcovonly':  {
               'directory': 'target',
               'subdirectory': '.',
               'filename': 'lcovUT.info'
            },
            'html': {
               'directory': 'target',
               'subdirectory': '.'
            },
            'text-summary': null,
            'json': './target/coverage',
         }
      },

      preprocessors: {
         "src/lib/**/*.ts": ["karma-typescript"],
         "test/**/*.ts": ["karma-typescript"]
      },
      reporters: ['mocha', 'karma-typescript', 'junit'],
      mochaReporter: {
         ignoreSkipped: args && args.length > 0
      },

      // the default configuration
      junitReporter: {
         outputDir: 'target/surefire-reports', // results will be saved as $outputDir/$browserName.xml
         outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
         suite: ''
      },

      logLevel: config.LOG_INFO,
      autoWatch: false,
      singleRun: true,
      failOnEmptyTestSuite: false,
      browsers: ['PhantomJS'],
      phantomJsLauncher: {
         exitOnResourceError: true
      }
   });
};
