import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { IValidators } from '../../../bin/stack-config-types';

export interface IRestApiProps {
  readonly restApiName: string;
  readonly description: string;
}

export class RestApi extends Construct {
  readonly restApi: apigateway.RestApi;
  readonly requestValidator: apigateway.IRequestValidator;
  constructor(
    scope: Construct,
    id: string,
    private readonly props: IRestApiProps
  ) {
    super(scope, id);

    this.restApi = new apigateway.RestApi(this, 'rest-api', {
      restApiName: this.props.restApiName,
      description: this.props.description,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      defaultMethodOptions: {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
      },
      deployOptions: {
        stageName: 'v1',
        tracingEnabled: true,
        metricsEnabled: true,
      },
    });
  }

  createValidator(input: IValidators) {
    return new apigateway.RequestValidator(this, input.requestValidatorName, {
      restApi: this.restApi,
      requestValidatorName: input.requestValidatorName,
      validateRequestBody: input.validateRequestBody,
      validateRequestParameters: input.validateRequestParameters,
    });
  }
}
