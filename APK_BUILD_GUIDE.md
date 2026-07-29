# Rian — Building the Android APK (fresh Windows setup)

This guide takes you from a clean Windows install to an installed APK on your phone.
You only do **Part 1 (install tools)** once. After that, every rebuild is just **Part 3**.

---

## Part 0 — Before you build: push the web app

The APK loads the app live from GitHub Pages, so the new JavaScript (the part that
tells the phone to open files in Excel/Word) must be pushed first.

In the project folder (`C:\Users\morow\Documents\VibeCode\Rian\rian`), open **PowerShell** and run:

```powershell
git add app.html android
git commit -m "v6.6.74 — Native open-file-in-app for attachments"
git push
```

---

## Part 1 — Install the tools (one time)

You need three things: **Node.js**, **Java (JDK 17)**, and the **Android SDK**.
The easiest way to get the Java + Android SDK together is to install **Android Studio**
(it bundles a Java runtime and can download the SDK for you).

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
and Android Studio's bundled Java is at:
```
C:\Program Files\Android\Android Studio\jbr
```

### 1c. Set two environment variables
So the command-line build can find Java and the SDK:

1. Press **Start**, type **"environment variables"**, open
   **"Edit the system environment variables"** → **Environment Variables…**
2. Under **User variables**, click **New** and add each of these
   (adjust the paths if yours differ from above):

   | Variable name   | Value                                                    |
   |-----------------|----------------------------------------------------------|
   | `JAVA_HOME`     | `C:\Program Files\Android\Android Studio\jbr`            |
   | `ANDROID_HOME`  | `C:\Users\morow\AppData\Local\Android\Sdk`               |

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
cd C:\Users\morow\Documents\VibeCode\Rian\rian
npm install
```

(This reads `package.json` and restores Capacitor and the build tools. Only needed once,
or whenever dependencies change.)

---

## Part 3 — Build the APK (every time)

From the project folder:

```powershell
cd C:\Users\morow\Documents\VibeCode\Rian\rian
node scripts/build-www.js      # copy the web app into the Android project
npx cap sync android           # sync Capacitor + plugins
cd android
.\gradlew assembleDebug        # build the APK (first run downloads Gradle — be patient)
```

When it finishes you'll see **BUILD SUCCESSFUL**. The APK is here:

```
C:\Users\morow\Documents\VibeCode\Rian\rian\android\app\build\outputs\apk\debug\app-debug.apk
```

> First-ever build can take several minutes (Gradle downloads dependencies). Later builds are much faster.

### If `gradlew` fails with a Java error
It means it isn't using JDK 17. Confirm `JAVA_HOME` points at the Android Studio `jbr`
folder (Part 1c) and that you reopened PowerShell. Then retry.

### If it complains about SDK / build-tools / licenses
Open Android Studio → **More Actions → SDK Manager**, make sure an **Android SDK Platform**
and **Android SDK Build-Tools** are installed, and accept any license prompts. Then rebuild.

---

## Part 4 — Install the APK on your phone

**Option A — USB cable (fastest for repeat installs):**
1. On the phone: **Settings → About phone → Software information**, tap **Build number**
   7 times to enable **Developer options**.
2. **Settings → Developer options → USB debugging → ON**.
3. Plug the phone into the PC, accept the "Allow USB debugging?" prompt on the phone.
4. In PowerShell:
   ```powershell
   adb install -r "C:\Users\morow\Documents\VibeCode\Rian\rian\android\app\build\outputs\apk\debug\app-debug.apk"
   ```
   `-r` reinstalls over the existing app, keeping your data. You should see **Success**.

**Option B — Copy the file across:**
1. Copy `app-debug.apk` to the phone (USB drag-and-drop, Google Drive, email to yourself, etc.).
2. On the phone, tap the file to install. Android will ask to **allow installing unknown apps**
   for whatever app you opened it from (Files / Drive) — allow it, then install.

---

## Part 5 — Test it

1. Open Rian on the phone, check the version (☰ menu) reads **6.6.74** or higher.
2. Open a note fullscreen, tap the 📎 (paperclip) button, and attach an `.xlsx`.
3. Close the editor so you see the note **preview**, then tap the file chip.
4. It should download briefly and then open directly in your Excel app — no browser.

If it still opens a browser, the phone is likely running the old APK — reconfirm the install
in Part 4 succeeded and that you pushed the web app in Part 0.

---

## Quick reference (once everything is installed)

```powershell
cd C:\Users\morow\Documents\VibeCode\Rian\rian
git add . ; git commit -m "…" ; git push        # publish web changes
node scripts/build-www.js
npx cap sync android
cd android
.\gradlew assembleDebug
adb install -r app\build\outputs\apk\debug\app-debug.apk
```
