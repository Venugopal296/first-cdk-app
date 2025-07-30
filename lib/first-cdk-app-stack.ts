import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaApiFunction } from '../src/api/rest/lambda';

export class FirstCdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new LambdaApiFunction(this, 'create-basic-lambda', {});
  }
}
