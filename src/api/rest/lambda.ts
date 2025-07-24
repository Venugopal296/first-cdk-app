import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';

import { Construct } from 'constructs';
import { commonLambdaProps } from '../../utils/lambda';
import { resourceNameWithPrefix } from '../../utils/context';

export class LambdaApiFunction extends Construct {
  readonly handler: lambda.IFunction;

  constructor(scope: Construct, id: string, props?: any) {
    super(scope, id);

    const naming = resourceNameWithPrefix(this);

    const lambdaProps = {
      ...commonLambdaProps(this),
      ...props,
      entry: `src/api/http/${id}.ts`,
      functionName: naming(id),
    };

    this.handler = new nodejs.NodejsFunction(
      this,
      'LambdaHandler',
      lambdaProps
    );
  }
}
