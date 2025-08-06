#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { FirstCdkAppStack } from '../lib/first-cdk-app-stack';
import { resourceNameWithPrefix } from '../src/utils/context';
import environmentConfig from './stack-config';

const app = new App();
const naming = resourceNameWithPrefix(app);

const stackName = naming('first-cdk-app');
new FirstCdkAppStack(app, stackName, environmentConfig);
