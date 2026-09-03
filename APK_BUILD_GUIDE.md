# Rian — Building the Android APK (fresh Windows setup)

This guide takes you from a clean Windows install to an installed APK on your phone.
You only do **Part 1 (install tools)** once. After that, every rebuild is just **Part 3**.

> Project path as of the 2026-09 PC rebuild: `D:\X-Files\Vibe Code\Rian`
> (earlier versions of this guide used `C:\Users\morow\Documents\VibeCode\Rian\rian` —
> update the commands below if you've moved the project again. Quote the path in every
> command below — it contains spaces.)

---

## Part 0 — Before you build: push the web app

The APK loads the app live from GitHub Pages, so any web changes must be pushed first.

In the project folder (`D:\X-Files\Vibe Code\Rian`), open **PowerShell** and run:

```powershell
git add app.html
git commit -m "vX.Y.Z — description"
git push
```

---

## Part 1 — Install the tools (one time)

You need three things: **Node.js**, **Java (JDK 21)**, and the **Android SDK**.
Android Studio bundles its own Java runtime and can download the SDK for you, but its
bundled JDK didn't match what this project actually needs (see the note below) — install
a standalone JDK 21 instead (e.g. `winget install -e --id EclipseAdoptium.Temurin.21.JDK`).

> **2026-09 PC rebuild — what actually happened, corrected after a real build:**
> - This project needs **JDK 21** specifically, not 17. Building under JDK 25 fails
>   Gradle itself ("Unsupported class file major version 69" — Gradle 8.14.3 can't run
>   on 25 yet); building under JDK 17 fails one Capacitor module's compile step
>   ("invalid source release: 21" — that module targets Java 21, which 17 can't produce).
>   21 is the one that actually works. If a machine doesn't have a JDK 21 already,
>   install `EclipseAdoptium.Temurin.21.JDK` via winget.
> - **GUI environment-variable edits are easy to lose.** Twice this session, `ANDROID_HOME`
>   and/or the `Path` addition silently didn't save via the System Properties dialog (some
>   dialog in the OK/Apply chain got dismissed without saving). If `adb`/`java` still aren't
>   found after reopening a *genuinely new* terminal, verify what's actually persisted
>   with `[System.Environment]::GetEnvironmentVariable("ANDROID_HOME", "User")` before
>   assuming the terminal is just stale — it might not have saved at all.
> - **A long-lived terminal session won't pick up new env vars even after reopening a
>   "new" window**, if that window's underlying process predates the change (this tripped
>   up an AI assistant's own terminal tool repeatedly). If a command that should now work
>   still doesn't, set the variable directly for that one command as a workaround:
>   `$env:JAVA_HOME = "..."; $env:ANDROID_HOME = "..."; $env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"`
>   before the build/adb command, in the same PowerShell invocation.
> - **Installing over an old APK signed by a different debug keystore fails** with
>   `INSTALL_FAILED_UPDATE_INCOMPATIBLE: ... signatures do not match`. A fresh PC has no
>   `debug.keystore` yet, so the very first build auto-generates a brand new one — it won't
>   match whatever signed an APK from an old PC/install. Fix: `adb uninstall com.rian.fieldlog`
>   first (wipes local app data — fine, everything's synced to Firestore), then install.
> - The Android SDK itself was not present — Android Studio (1b) is still required for
>   that. This version of Android Studio didn't show a first-run setup wizard; instead
>   use **More Actions → SDK Manager** (or Settings → Languages & Frameworks → Android
>   SDK) from the welcome screen, and install the SDK platform matching this project's
>   `compileSdkVersion` (check `android/variables.gradle` — was 36 at the time of writing)
>   plus **Android SDK Build-Tools** and **Android SDK Platform-Tools** from the SDK Tools
>   tab. A "36.0-extNN" platform entry satisfies `compileSdkVersion 36` fine — it isn't a
>   different platform, just that API level with a specific SDK extension bundled.

### 1a. Node.js
1. Go to https://nodejs.org
2. Download the **LTS** installer (Windows, 64-bit).
3. Run it, accept defaults, finish.
4. Verify — open a new PowerShell window and run:
   ```powershell
   node --version
   npm --version
   ```
   Both should print a version number.

### 1b. Android Studio (includes Java + Android SDK)
1. Go to https://developer.android.com/studio
2. Download and run the installer, accept defaults.
3. Launch Android Studio once. On first run it shows a **Setup Wizard** — choose
   **Standard** and let it download the SDK, platform-tools, and build-tools
   (this needs internet and takes a while).
4. When it finishes, you can close Android Studio.

After this, the Android SDK is normally at:
```
C:\Users\morow\AppData\Local\Android\Sdk
```
Don't use Android Studio's own bundled Java (`...\Android Studio\jbr`) for `JAVA_HOME` —
use the standalone JDK 21 installed above instead (path looks like
`C:\Program Files\Eclipse Adoptium\jdk-21.x.x.x-hotspot`; check the exact folder name,
the patch version changes).

### 1c. Set two environment variables
So the command-line build can find Java and the SDK:

1. Press **Start**, type **"environment variables"**, open
   **"Edit the system environment variables"** → **Environment Variables…**
2. Under **User variables**, click **New** and add each of these
   (adjust the paths if yours differ from above):

   | Variable name   | Value                                                              |
   |-----------------|---------------------------------------------------------------------|
   | `JAVA_HOME`     | `C:\Program Files\Eclipse Adoptium\jdk-21.x.x.x-hotspot` (JDK 21!)  |
   | `ANDROID_HOME`  | `C:\Users\morow\AppData\Local\Android\Sdk`               |

   **Verify both actually saved** before moving on — reopen this same dialog and confirm
   they're both listed. GUI edits here silently failed to save twice during the 2026-09
   rebuild (some dialog in the OK/Apply chain got dismissed without saving) — don't assume
   it worked just because no error appeared.

3. Still in **User variables**, select **Path** → **Edit** → **New**, and add:
   ```
   %ANDROID_HOME%\platform-tools
   ```
4. Click **OK** on everything. **Close and reopen PowerShell** so the changes apply.
5. Verify:
   ```powershell
   java -version
   adb --version
   ```
   Both should print a version. If `java -version` fails, double-check the `JAVA_HOME` path exists.

---

## Part 2 — One-time project setup

After a Windows reinstall your project's `node_modules` folder is probably gone, so
reinstall the project's dependencies. In the project folder:

```powershell
cd "D:\X-Files\Vibe Code\Rian"
npm install
```

(This reads `package.json` and restores Capacitor and the build tools. Only needed once,
or whenever dependencies change.)

---

## Part 3 — Build the APK (every time)

From the project folder:

```powershell
cd "D:\X-Files\Vibe Code\Rian"
node scripts/build-www.js      # copy the web app into the Android project
npx cap sync android           # sync Capacitor + plugins
cd android
.\gradlew assembleDebug        # build the APK (first run downloads Gradle — be patient)
```

When it finishes you'll see **BUILD SUCCESSFUL**. The APK is here:

```
D:\X-Files\Vibe Code\Rian\android\app\build\outputs\apk\debug\app-debug.apk
```

> First-ever build can take several minutes (Gradle downloads dependencies). Later builds are much faster.

### If `gradlew` fails with a Java error
It means it isn't using JDK 21. Two different errors, two different wrong JDKs:
- `Unsupported class file major version 69` → too new (JDK 25) — Gradle itself can't run on it.
- `invalid source release: 21` → too old (JDK 17) — one Capacitor module targets Java 21.

Confirm `JAVA_HOME` points at a JDK 21 folder (Part 1c) in a genuinely fresh terminal
(verify with `[System.Environment]::GetEnvironmentVariable("JAVA_HOME", "User")` if
`java -version` still looks wrong). If it still won't take, override it for just the
build command:
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.x.x.x-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
.\gradlew assembleDebug
```

### If install fails with "signatures do not match"
`INSTALL_FAILED_UPDATE_INCOMPATIBLE`. A fresh PC has no `debug.keystore` yet, so the
first build here auto-generates a new one — it won't match whatever signed an
already-installed APK from a different PC. Uninstall the old one first (wipes local app
data on the phone — fine, everything's synced to Firestore):
```powershell
adb uninstall com.rian.fieldlog
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

### If it complains about SDK / build-tools / licenses
Open Android Studio → **More Actions → SDK Manager**, make sure an **Android SDK Platform**
and **Android SDK Build-Tools** are installed, and accept any license prompts. Then rebuild.

### If Google Sign-In fails on a fresh machine (2026-09 PC rebuild — confirmed, both steps required)
Two separate one-time-per-machine steps, discovered in this order because the first error
masked the second:

1. **Copy `google-services.json` into `android/app/`.** This file is git-ignored (only a
   project-root copy is tracked), and nothing in the build copies it automatically. Without
   it inside `android/app/`, the Firebase native plugin silently has no config and sign-in
   fails with a webpage "400: malformed request" error instead of a native dialog.
   ```powershell
   cp google-services.json android/app/google-services.json
   ```
2. **Register this machine's debug-keystore SHA-1 in Firebase**, or sign-in fails with a
   native "Account reauth failed (err 16)" error instead. Every machine's first-ever build
   auto-generates its own new `debug.keystore`, whose fingerprint won't be registered yet.
   ```powershell
   keytool -list -v -keystore "$env:USERPROFILE\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
   ```
   Copy the `SHA1:` value, then in [Firebase Console](https://console.firebase.google.com) →
   your project → ⚙️ Project settings → **Your apps** → the Android app → **Add fingerprint**
   → paste it → Save. Then **re-download `google-services.json`** from that same app card
   (the file embeds registered fingerprints, so the old copy won't include the new one) and
   replace *both* the project-root copy and `android/app/google-services.json` with it
   before rebuilding.

---

## Part 4 — Install the APK on your phone

**Option A — USB cable (fastest for repeat installs):**
1. On the phone: **Settings → About phone → Software information**, tap **Build number**
   7 times to enable **Developer options**.
2. **Settings → Developer options → USB debugging → ON**.
3. Plug the phone into the PC, accept the "Allow USB debugging?" prompt on the phone.
4. In PowerShell:
   ```powershell
   adb install -r "D:\X-Files\Vibe Code\Rian\android\app\build\outputs\apk\debug\app-debug.apk"
   ```
   `-r` reinstalls over the existing app, keeping your data — *if* the existing install
   was signed by the same debug keystore. On a fresh PC it usually isn't (see
   "signatures do not match" in Part 3's troubleshooting) — `adb uninstall
   com.rian.fieldlog` first in that case. You should see **Success**.

**Option B — Copy the file across:**
1. Copy `app-debug.apk` to the phone (USB drag-and-drop, Google Drive, email to yourself, etc.).
2. On the phone, tap the file to install. Android will ask to **allow installing unknown apps**
   for whatever app you opened it from (Files / Drive) — allow it, then install.

---

## Part 5 — Test it

1. Open Rian on the phone, check the version (☰ menu) matches the current `VERSION` in `app.html`.
2. Open a note fullscreen, tap the 📎 (paperclip) button, and attach an `.xlsx`.
3. Close the editor so you see the note **preview**, then tap the file chip.
4. It should download briefly and then open directly in your Excel app — no browser.

If it still opens a browser, the phone is likely running the old APK — reconfirm the install
in Part 4 succeeded and that you pushed the web app in Part 0.

---

## Quick reference (once everything is installed)

```powershell
cd "D:\X-Files\Vibe Code\Rian"
git add . ; git commit -m "…" ; git push        # publish web changes
node scripts/build-www.js
npx cap sync android
cd android
.\gradlew assembleDebug
adb install -r app\build\outputs\apk\debug\app-debug.apk   # if this fails on signatures, adb uninstall com.rian.fieldlog first
```
