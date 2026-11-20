#!/usr/bin/env node
/**
 * Copies the ilib locale data required by @enact/i18n / Moonstone into
 * public/ilib/locale so that it ships with the app and is reachable via the
 * relative ILIB_BASE_PATH set in public/index.html.
 *
 * Kept out of git: the data is ~73 MB in node_modules/ilib/locale; we only
 * ship the locales needed by the UI (und + en + de covers the common case;
 * add more as needed). Run automatically via the npm "prebuild" hook.
 */
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', 'ilib', 'locale');
const dest = path.join(__dirname, '..', 'public', 'ilib', 'locale');
const locales = ['und', 'en', 'de'];

if (!fs.existsSync(src)) {
    console.error('copy-ilib: node_modules/ilib/locale not found - run npm install first');
    process.exit(1);
}

fs.rmSync(path.join(__dirname, '..', 'public', 'ilib'), { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

fs.copyFileSync(path.join(src, 'ilibmanifest.json'), path.join(dest, 'ilibmanifest.json'));
for (const locale of locales) {
    const from = path.join(src, locale);
    if (!fs.existsSync(from)) {
        console.warn(`copy-ilib: skipping missing locale ${locale}`);
        continue;
    }
    fs.cpSync(from, path.join(dest, locale), { recursive: true });
}

const total = locales.reduce((sum, l) => sum + (fs.existsSync(path.join(dest, l)) ? fs.statSync(path.join(dest, l)).size : 0), 0);
console.log(`copy-ilib: copied ${locales.join(', ')} (~${(total / 1048576).toFixed(1)} MB) to public/ilib/locale`);
