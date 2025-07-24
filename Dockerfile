FROM node:22-alpine

LABEL author="Venu Gopal"
LABEL description="Dockerfile for AWS CDK first-cdk-app"

RUN apk add --update --no-cache git make tmux bash openssh jq zip build-base docker openrc

RUN npm install -g aws-cdk

RUN rc-update add docker boot

ENV SHELL=/bin/bash