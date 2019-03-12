# Stormant

Minimal Cloudant desktop GUI built on Electron

## Installation

* `git@github.com:cjm322/stormant.git`
* `cd stormant`
* `yarn`

## Usage

### Development mode
Run these commands to start dev server and Electron app
``` bash
# Parcel bundles the code and runs dev server
$ yarn dev

# Run the electron app which uses local dev server
$ yarn start-dev
```

### Production mode and packaging app
Run this command to bundle code in production mode
``` bash
# Parcel bundle code once
$ yarn build

# Create executables
$ yarn dist
```
