#!/bin/bash
npm run build:production
forever start -c "npm run start:production" ./
