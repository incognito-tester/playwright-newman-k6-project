# Project Overview
This project includes UI, API, and Performance testing setup using Playwright, Newman, and K6 respectively.
Follow the instructions below to install dependencies, run the tests, and view reports locally.

# Prerequisites
Make sure you have Node.js and npm installed before getting started.
You can verify the installation with:
```sh
node -v
npm -v
```
# UI Test (Playwright)
Install Playwright and dependencies
```sh
npm init playwright@latest
```
Run UI tests locally
```sh
npm run test:ui
```
View the Playwright report
```sh
npx playwright show-report
```
# API Test (Postman + Newman)
Install Newman and HTML reporter
```sh
npm install --save-dev newman newman-reporter-htmlextra
```
Run API tests locally
```sh
npm run test:api
```
View the Newman HTML report
```sh
open newman-report/index.html
```
# Load Test (K6)
Install K6 (Ubuntu / Debian)
```sh
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```
Run Load tests locally
```sh
npm run test:load
```
View K6 report
```sh
open k6-report/index.html
```

# Summary

Playwright → End-to-end UI automation

Newman → API functional testing

K6 → Performance and load testing

Each layer is configured to generate its own report for easy visualization and analysis.