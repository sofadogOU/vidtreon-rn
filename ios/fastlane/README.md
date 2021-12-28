fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios create_app

```sh
[bundle exec] fastlane ios create_app
```

Create app on Apple Developer and App Store Connect

### ios sync_profiles

```sh
[bundle exec] fastlane ios sync_profiles
```

Sync certificates

### ios huawei_Upload

```sh
[bundle exec] fastlane ios huawei_Upload
```

Upload release app to huawei app gallery storage

### ios build

```sh
[bundle exec] fastlane ios build
```

Create ipa

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Upload to TestFlight

### ios screenshot

```sh
[bundle exec] fastlane ios screenshot
```

Take screenshots

### ios upload

```sh
[bundle exec] fastlane ios upload
```

Upload to App Store

### ios release_app

```sh
[bundle exec] fastlane ios release_app
```

Create app, screenshot ,build and upload

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
