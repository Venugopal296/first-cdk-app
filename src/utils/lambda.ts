import {
  ApplicationLogLevel,
  Architecture,
  LoggingFormat,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import {
  NodejsFunctionProps,
  OutputFormat,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { activatedStage } from './context';

export const commonLambdaProps = (
  scope: Construct,
  environment?: Record<string, string>,
  bundling = {
    tsconfig: './tsconfig.json',
    format: OutputFormat.ESM,
  }
) =>
  ({
    architecture: Architecture.ARM_64,
    logRetention:
      activatedStage(scope) === 'prod'
        ? RetentionDays.ONE_WEEK
        : RetentionDays.ONE_DAY,
    applicationLogLevelV2: ApplicationLogLevel.INFO,
    loggingFormat: LoggingFormat.JSON,
    runtime: Runtime.NODEJS_22_X,
    environment,
    handler: 'handler',
    bundling,
    memorySize: 1024,
  } satisfies Partial<NodejsFunctionProps>);
