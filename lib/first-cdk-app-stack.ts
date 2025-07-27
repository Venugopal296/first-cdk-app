import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaApiFunction } from '../src/api/rest/lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class FirstCdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucketName = new cdk.CfnParameter(this, 'bucketName', {
      type: 'String',
      description: 'The name of the S3 bucket to create',
    });

    const bucketKey = new cdk.CfnParameter(this, 'bucketKey', {
      type: 'String',
      description: 'The key for the object in the S3 bucket',
    });

    new LambdaApiFunction(this, 'create-basic-lambda', {
      environment: {
        BUCKET_NAME: bucketName.valueAsString,
        BUCKET_KEY: bucketKey.valueAsString,
      },
    });
  }
}
