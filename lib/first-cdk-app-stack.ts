import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaApiFunction } from '../src/api/rest/lambda';
import { ICdkTsApiGatewayStackProps } from '../bin/stack-config-types';
import { OpenSecureApi } from './openSecure/api';

export class FirstCdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ICdkTsApiGatewayStackProps) {
    super(scope, id, props);

    // Dummy lambda function
    new LambdaApiFunction(this, 'create-basic-lambda', {});

    // Lambda function for API Gateway
    new OpenSecureApi(this, 'OpenSecureApi', props);
  }
}
