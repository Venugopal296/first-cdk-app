import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaApiFunction } from '../src/api/rest/lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda';
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

    const bucket = new cdk.aws_s3.Bucket(this, 'MyBucket', {
      bucketName: bucketName.valueAsString,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
    });

    new LambdaApiFunction(this, 'create-basic-lambda', {
      code: lambda.Code.fromBucket(bucket, bucketKey.valueAsString),
    });
  }
}
