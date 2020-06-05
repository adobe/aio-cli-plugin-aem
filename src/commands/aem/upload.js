/*
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const Path = require('path');
const fs = require('fs');
const winston = require('winston');
const mustache = require('mustache');

const {flags} = require('@oclif/command');
const {
    DirectBinaryUploadOptions,
    FileSystemUpload,
} = require('@adobe/aem-upload');

const BaseCommand = require('../../base-command');
const { trimRight } = require('../../utils');

function getLogger(logFile) {
    const { combine, timestamp, label, printf } = winston.format;
    const myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    });
    const log = winston.createLogger({
        format: combine(
            label({ label: '' }),
            timestamp(),
            myFormat
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: logFile })
        ]
    });
    return log;
}

class UploadCommand extends BaseCommand {
    async doRun(args) {
        const { flags, argv } = args;

        const newFlags = Object.assign({}, flags);
        const timestamp = new Date().getTime();
        Object.keys(newFlags).forEach(key => {
            if (typeof(newFlags[key]) === 'string') {
                newFlags[key] = newFlags[key].replace('${timestamp}', timestamp)
            }
        });

        const {
            host,
            credential,
            target,
            log: logFile,
            output: htmlResult,
            threads,
        } = newFlags;

        const uploadOptions = new DirectBinaryUploadOptions()
            .withUrl(`${trimRight(host, ['/'])}${target}`)
            .withBasicAuth(credential)
            .withMaxConcurrent(parseInt(threads, 10));

        // setup logger
        const log = getLogger(logFile);

        // upload local folder
        const fileUpload = new FileSystemUpload({ log });
        fileUpload.upload(uploadOptions, argv).then((allUploadResult) => {
                log.info('finished uploading files');
                // generate html format result
                let mstTemplate = fs.readFileSync(Path.join(__dirname, '../../../view/result.mst')).toString();
                let htmlOutput = mustache.render(mstTemplate, allUploadResult.toJSON());
                fs.writeFileSync(htmlResult, htmlOutput);
                log.info(`Uploading result is saved to html file '${htmlResult}'`);
            })
            .catch(err => {
                log.error('unhandled exception attempting to upload files', err);
            });

        log.info(`Log file is saved to log file '${logFile}'`);
    }
}

UploadCommand.flags = Object.assign({}, BaseCommand.flags, {
    host: flags.string({
        char: 'h',
        description: `AEM host
The host value of the AEM instance where files will be
uploaded. This should include everything in the host's
URL up until /content/dam.`,
        default: 'http://localhost:4502'
    }),
    credential: flags.string({
        char: 'c',
        description: `AEM credential
The username and password for authenticating with the
target AEM instance. Should be in the format
<username>:<password>.`,
        default: 'admin:admin'
    }),
    target: flags.string({
        char: 't',
        description: `Target AEM folder
The folder in the target AEM instance where asset
binaries should be uploaded. Should always begin with
/content/dam.`,
        default: '/content/dam/aem-upload-${timestamp}'
    }),
    log: flags.string({
        char: 'l',
        description: `Log file path
The local path to where the process's log messages
should be saved.`,
        default: 'upload-${timestamp}.log'
    }),
    output: flags.string({
        char: 'o',
        description: `Result html file path
The local path to where the process's metrics will be
saved in html format.`,
        default: 'result-${timestamp}.html'
    }),
    threads: flags.string({
        char: 'r',
        description: `Maximum threads
Maximum number of files to upload concurrently.`,
        default: 5,
    })
})

UploadCommand.strict = false

UploadCommand.args = [{
    name: 'files_folders',
    required: true,
    description: `Space-delimited list of files and folders to upload.`
}];

UploadCommand.description = `Upload asset binaries to AEM
Uploads one or more files to a target AEM instance. The upload process uses the
direct binary access algorithm, so the target instance must have direct binary
access enabled; otherwise the upload will fail.

The process will upload the files or directories (non-recursive) provided in
the command.

Note that the process will only work with AEM instances that use basic
(i.e. non-SSO) authentication.`

UploadCommand.examples = [
    '$ aio aem:upload myimage.jpg',
    '$ aio aem:upload -h http://myaeminstance -c admin:12345 myimage.jpg ',
]

module.exports = {
    upload: UploadCommand
}
