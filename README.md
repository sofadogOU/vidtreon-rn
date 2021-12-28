**How to start fastlane :-** 
Install fastlane by using following command:-
*sudo gem install fastlane*.
fastlane for iOS=>
official doc for environment set-up:https://docs.fastlane.tools/getting-started/ios/setup
Make sure, you have the latest version of the Xcode command line tools installed:
*xcode-select --install*
Setting up  fastlane :-
*fastlane init*
**Appfile**:- contains a bundle identifier and your Apple ID:- 
app_identifier("com.vidtreon.ios")
apple_id("sysadmin@so.fa.dog")
**Fastfile** :- contains the  fastlane.tools  configuration and actions.
Here is our project iOS main lane:-
desc "Upload to TestFlight"
lane :beta do
build
cert
sigh(force: true)
pilot(ipa: "fastlane/builds/sofadog.ipa")
end
**build**:- This is used for making release iOS build.
Building an ipa file with gym
*fastlane gym init*
lane is:- desc "Create ipa"
lane :build do
sync_profiles
increment_build_number
gym
end
**cert:**- Profiles & Certificate handling.
we are handling Code Signing With Match.
Match easily share certificates across your development team.
terminal command:- *fastlane match init.*
Once proceed with a password, certificates will be handled by fastlane match.
Also add  sync certificates on your machine. Open your Fastfile and add the following:
desc "Sync certificates"
lane :sync_profiles do
match({readonly: true,type:"appstore"})
end
Pilot:- Uploading release build to TestFlight with pilot.
pilot(ipa: "fastlane/builds/sofadog.ipa")

**Fastlane for android=>**
official doc for environment set-up:-https://docs.fastlane.tools/getting-started/android/setup.
Setting up  fastlane :-
*fastlane init*
**Appfile**:- contains a JSON key file and package name:- 
json_key_file("/Users/apple/vidtreon-rn-/android/app/api-6041575696799968906-740144-5431efeea948.json").
package_name("com.vidtreon.android")
**Fastfile** :- contains automation configurations and lanes.
Here is our project android main lane:-
desc "Deploy a new version to the Google Play"
lane :deploy do
#1
increment_vc
#2
build_bundle
#3
upload_to_play_store(skip_upload_apk: true, track: 'internal',
release_status: 'draft',
aab: '/Users/apple/vidtreon-rn-/android/app/build/outputs/bundle/release/app-release.aab')
#4
huawei_Upload
end
**increment_vc**:- Incrementing version code
Version code determines whether the current build version is more recent than another.
Install plugin:- fastlane add_plugin increment_version_code
**build_bundle:**- This is used for making release android build.
To do so, add the following lane:-
desc "Build release app bundle"
lane :build_bundle do
gradle(
task: "bundle",
build_type: "Release"
)
end
**upload_to_play_store**:- To upload aab or apk file to play_store.
**huawei_Upload**:- To upload app to huawei app gallery.






























