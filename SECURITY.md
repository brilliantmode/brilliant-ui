# Security Policy

Brilliant UI is pre-1.0. Security fixes are prioritized for the current `main` branch and the latest
published prerelease once packages begin publishing.

Do not open public issues for suspected vulnerabilities. Email the maintainer security contact or use
GitHub private vulnerability reporting when it is enabled for the repository. Include reproduction
steps, impacted package names, and any known workarounds.

The CLI must not write outside the selected project root. Registry files are validated for safe
relative paths and checksums before installation.
