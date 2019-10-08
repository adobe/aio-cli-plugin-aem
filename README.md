# Overview
Plugin to Adobe I/O CLI for executing commands related to Adobe Experience Manager.

<!-- toc -->
* [Overview](#overview)
* [Usage](#usage)
* [Adding New Commands](#adding-new-commands)
* [Commands](#commands)
* [Contributing](#contributing)
* [Licensing](#licensing)
<!-- tocstop -->


# Usage
To install the and use the command locally:
<!-- usage -->
```sh-session
$ npm install -g @adobe/aio-cli-plugin-aem
$ aio-aem COMMAND
running command...
$ aio-aem (-v|--version|version)
@adobe/aio-cli-plugin-aem/1.0.0 darwin-x64 node-v10.16.3
$ aio-aem --help [COMMAND]
USAGE
  $ aio-aem COMMAND
...
```
<!-- usagestop -->

# Adding New Commands

To add a new command, do the following:

* Create a new javascript file, named after the command, in src/commands/aem.
* Use the contents of src/commands/aem/upload.js as a starting point for your command, paying
particular attention to the command's `flags`, `args`, and `description`. For additional
information and features, see [https://oclif.io](https://oclif.io/).
* Ensure that the file's exports include an object with a property matching the command name.

## Testing Commands

There are a couple options for running commands through the locally cloned repository.

```
// run command through Node.js
node bin/run aem:COMMAND
```

```
// run command as a binary (Mac)
./bin/run aem:COMMAND
```

```
// run command as a binary (Windows)
bin/run.cmd aem:COMMAND
```

```
// run using specifed NPM command
npm link // only needs to be run once
aio-aem aem:COMMAND
```

# Commands
<!-- commands -->
* [`aio-aem aem:upload FILES_FOLDERS`](#aio-aem-aemupload-files_folders)

## `aio-aem aem:upload FILES_FOLDERS`

Upload asset binaries to AEM

```
USAGE
  $ aio-aem aem:upload FILES_FOLDERS

ARGUMENTS
  FILES_FOLDERS  Space-delimited list of files and folders to upload.

OPTIONS
  -c, --credential=credential  [default: admin:admin] AEM credential
                               The username and password for authenticating with the
                               target AEM instance. Should be in the format
                               <username>:<password>.

  -h, --host=host              [default: http://localhost:4502] AEM host
                               The host value of the AEM instance where files will be
                               uploaded. This should include everything in the host's
                               URL up until /content/dam.

  -l, --log=log                [default: upload-${timestamp}.log] Log file path
                               The local path to where the process's log messages
                               should be saved.

  -o, --output=output          [default: result-${timestamp}.html] Result html file path
                               The local path to where the process's metrics will be
                               saved in html format.

  -r, --threads=threads        [default: 5] Maximum threads
                               Maximum number of files to upload concurrently.

  -t, --target=target          [default: /content/dam/aem-upload-${timestamp}] Target AEM folder
                               The folder in the target AEM instance where asset
                               binaries should be uploaded. Should always begin with
                               /content/dam.

  -v, --version                Show version

  --help                       Show help

DESCRIPTION
  Uploads one or more files to a target AEM instance. The upload process uses the
  direct binary access algorithm, so the target instance must have direct binary
  access enabled; otherwise the upload will fail.

  The process will upload the files or directories (non-recursive) provided in
  the command.

  Note that the process will only work with AEM instances that use basic
  (i.e. non-SSO) authentication.

EXAMPLES
  $ aio aem:upload myimage.jpg
  $ aio aem:upload -t http://myaeminstance -c admin:12345 myimage.jpg
```

_See code: [src/commands/aem/upload.js](https://github.com/adobe/aio-cli-plugin-aem/blob/v1.0.0/src/commands/aem/upload.js)_
<!-- commandsstop -->

# Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

# Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
